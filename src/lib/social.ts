import { prisma } from "@/lib/db";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";

export async function publishToSocials(post: { id: string; userId: string; content: string; platform: string; imageUrl?: string | null }) {
    console.log(`Attempting to publish post ${post.id} to ${post.platform}...`);

    // 1. Get User's Account Token
    // We search for the specific provider account linked to this user.
    // We search for the specific provider account linked to this user.
    let provider = "";
    if (post.platform === "TWITTER") provider = "twitter";
    else if (post.platform === "LINKEDIN") provider = "linkedin";
    else if (post.platform === "THREADS") provider = "threads";

    const account = await prisma.account.findFirst({
        where: {
            userId: post.userId,
            provider: provider,
        },
    });

    if (!account || !account.access_token) {
        console.error(`No connected ${provider} account found for user ${post.userId}.`);
        return { success: false, error: `No connected ${provider} account found. Please connect in Settings.` };
    }

    try {
        if (provider === "twitter") {
            // Check for expiration
            let accessToken = account.access_token;
            const expiresAt = account.expires_at; // Integer timestamp in seconds
            const now = Math.floor(Date.now() / 1000);

            // 1. Refresh if expired or about to expire (within 24 hours)
            if (expiresAt && (expiresAt - now < 86400) && account.refresh_token) {
                console.log("Twitter token expired or close to expiration. Refreshing...");
                try {
                    // TwitterApi requires client ID and secret for refresh
                    const client = new TwitterApi({
                        clientId: process.env.AUTH_TWITTER_ID?.trim()!,
                        clientSecret: process.env.AUTH_TWITTER_SECRET?.trim()!,
                    });

                    const { client: refreshedClient, accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = await client.refreshOAuth2Token(account.refresh_token);

                    // Update database
                    await prisma.account.update({
                        where: {
                            provider_providerAccountId: {
                                provider: "twitter",
                                providerAccountId: account.providerAccountId,
                            },
                        },
                        data: {
                            access_token: newAccessToken,
                            refresh_token: newRefreshToken,
                            expires_at: Math.floor(Date.now() / 1000) + expiresIn,
                        },
                    });

                    accessToken = newAccessToken;
                    console.log("Successfully refreshed Twitter token.");
                } catch (refreshError: any) {
                    console.error("Failed to refresh Twitter token:", refreshError);
                    if (refreshError.code) console.error("Refresh Error Code:", refreshError.code);
                    if (refreshError.data) console.error("Refresh Error Data:", JSON.stringify(refreshError.data, null, 2));

                    // Check below will catch if it is still expired
                }
            }

            // 2. Check if ALREADY expired and NOT refreshed
            const isRefreshed = accessToken !== account.access_token;
            if (!isRefreshed && expiresAt && now >= expiresAt) {
                console.error("Twitter token has expired and could not be refreshed. User needs to re-authenticate.");
                throw new Error("Twitter session expired. Please sign out and sign in again.");
            }

            if (!accessToken) throw new Error("No access token available for Twitter");

            const client = new TwitterApi(accessToken);

            let mediaId = undefined;
            if (post.imageUrl && post.imageUrl.startsWith("data:")) {
                try {
                    // Extract base64 (remove data:image/png;base64, prefix)
                    const base64Data = post.imageUrl.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");

                    // Upload media (v1.1)
                    const mediaIds = await client.v1.uploadMedia(buffer, { mimeType: 'image/png' });
                    mediaId = mediaIds;
                    console.log("Uploaded media to Twitter:", mediaId);
                } catch (e) {
                    console.error("Twitter media upload failed", e);
                    throw e; // Fail the post if media upload fails
                }
            }

            if (mediaId) {
                await client.v2.tweet({
                    text: post.content,
                    media: { media_ids: [mediaId] }
                });
            } else {
                await client.v2.tweet(post.content);
            }
            console.log("Successfully posted to Twitter");
        } else if (provider === "linkedin") {
            // LinkedIn API v2: ugcPosts or shares
            // We need the person's URN (ID). 
            // Often stored in 'providerAccountId' but sometimes just 'id'.
            // Let's assume providerAccountId is the URN (e.g. "urn:li:person:...")

            let accessToken = account.access_token;
            const expiresAt = account.expires_at;
            const now = Math.floor(Date.now() / 1000);

            // 1. Refresh if within 7 days of expiry (or already expired)
            // 7 days = 7 * 24 * 60 * 60 = 604800 seconds
            if (expiresAt && (expiresAt - now < 604800) && account.refresh_token) {
                console.log("LinkedIn token is within 7 days of expiration. Refreshing...");
                try {
                    const params = new URLSearchParams();
                    params.append('grant_type', 'refresh_token');
                    params.append('refresh_token', account.refresh_token);
                    params.append('client_id', process.env.AUTH_LINKEDIN_ID!);
                    params.append('client_secret', process.env.AUTH_LINKEDIN_SECRET!);

                    const refreshResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", params, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });

                    const { access_token: newAccessToken, expires_in, refresh_token: newRefreshToken, refresh_token_expires_in } = refreshResponse.data;

                    if (newAccessToken) {
                        await prisma.account.update({
                            where: {
                                provider_providerAccountId: {
                                    provider: "linkedin",
                                    providerAccountId: account.providerAccountId,
                                },
                            },
                            data: {
                                access_token: newAccessToken,
                                expires_at: Math.floor(Date.now() / 1000) + expires_in,
                                refresh_token: newRefreshToken || account.refresh_token, // Update refresh token if provided
                            },
                        });
                        accessToken = newAccessToken;
                        console.log("Successfully refreshed LinkedIn token.");
                    }
                } catch (refreshError) {
                    console.error("Failed to refresh LinkedIn token:", refreshError);
                    // Continue with old token
                }
            }

            // 2. Strict Check: If still expired after refresh attempt, fail.
            const isRefreshed = accessToken !== account.access_token;
            if (!isRefreshed && expiresAt && now >= expiresAt) {
                console.error("LinkedIn token has expired. User needs to re-authenticate.");
                throw new Error("LinkedIn session expired. Please sign out and sign in again.");
            }

            if (!accessToken) throw new Error("No access token available for LinkedIn");

            const urn = account.providerAccountId; // Ensure this is stored correctly by NextAuth

            // Prepare content payload
            let shareContent: any = {
                shareCommentary: {
                    text: post.content,
                },
                shareMediaCategory: "NONE",
            };

            // Image Upload Handling
            if (post.imageUrl && post.imageUrl.startsWith("data:")) {
                try {
                    // Step 1: Register Upload
                    const registerResponse = await axios.post(
                        "https://api.linkedin.com/v2/assets?action=registerUpload",
                        {
                            registerUploadRequest: {
                                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                                owner: `urn:li:person:${urn}`,
                                serviceRelationships: [{
                                    relationshipType: "OWNER",
                                    identifier: "urn:li:userGeneratedContent"
                                }]
                            }
                        },
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );

                    const uploadUrl = registerResponse.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
                    const assetUrn = registerResponse.data.value.asset;

                    console.log("LinkedIn Upload URL obtained:", uploadUrl);

                    // Step 2: Upload Image Binary
                    const base64Data = post.imageUrl.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");

                    await axios.put(uploadUrl, buffer, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "image/png"
                        }
                    });

                    console.log("LinkedIn Image uploaded successfully");

                    // Step 3: Configure Share Content
                    shareContent.shareMediaCategory = "IMAGE";
                    shareContent.media = [{
                        status: "READY",
                        description: { text: "Image" },
                        media: assetUrn,
                        title: { text: "Image" }
                    }];

                } catch (imageError) {
                    console.error("Failed to upload image to LinkedIn:", imageError);
                    throw new Error("Failed to upload image to LinkedIn");
                }
            }

            await axios.post(
                "https://api.linkedin.com/v2/ugcPosts",
                {
                    author: `urn:li:person:${urn}`, // providerAccountId usually is the ID, we need to prefix if not present? 
                    // Actually NextAuth usually stores just the numeric/string ID. 
                    // LinkedIn URN format: urn:li:person:123456
                    lifecycleState: "PUBLISHED",
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": shareContent
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );
            console.log("Successfully posted to LinkedIn");
        } else if (provider === "threads") {
            // Threads API publishing (2 steps)
            let accessToken = account.access_token;
            if (!accessToken) throw new Error("No access token available for Threads");

            // Check for expiration
            const expiresAt = account.expires_at;
            const now = Math.floor(Date.now() / 1000);

            // 1. Refresh if within 30 days of expiry (or already expired)
            // 30 days = 30 * 24 * 60 * 60 = 2,592,000 seconds
            if (expiresAt && (expiresAt - now < 2592000)) {
                console.log("Threads token is compatible for refresh. Refreshing...");
                try {
                    const refreshResponse = await axios.get("https://graph.threads.net/refresh_access_token", {
                        params: {
                            grant_type: "th_refresh_token",
                            access_token: accessToken
                        }
                    });

                    const { access_token: newAccessToken, expires_in } = refreshResponse.data;

                    if (newAccessToken) {
                        // Update database
                        await prisma.account.update({
                            where: {
                                provider_providerAccountId: {
                                    provider: "threads",
                                    providerAccountId: account.providerAccountId,
                                },
                            },
                            data: {
                                access_token: newAccessToken,
                                expires_at: Math.floor(Date.now() / 1000) + (expires_in || 5184000), // Default 60 days
                            },
                        });

                        accessToken = newAccessToken;
                        console.log("Successfully refreshed Threads token.");
                    }
                } catch (refreshError) {
                    console.error("Failed to refresh Threads token:", refreshError);
                    // Continue with old token as it might still be valid for a short time
                }
            }

            // 2. Strict Check: If still expired after refresh attempt, fail.
            const isRefreshed = accessToken !== account.access_token;
            if (!isRefreshed && expiresAt && now >= expiresAt) {
                console.error("Threads token has expired. User needs to re-authenticate.");
                throw new Error("Threads session expired. Please sign out and sign in again.");
            }

            // Step 1: Create a media container
            const publicImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://micropost-ai.com"}/api/images/${post.id}`;

            const containerParams: any = {
                text: post.content,
            };

            if (post.imageUrl) {
                containerParams.media_type = "IMAGE";
                containerParams.image_url = publicImageUrl;
            } else {
                containerParams.media_type = "TEXT";
            }

            const createContainerResponse = await axios.post(
                "https://graph.threads.net/v1.0/me/threads",
                containerParams,
                {
                    params: { access_token: accessToken }
                }
            );

            const creationId = createContainerResponse.data.id;

            // Step 1.5: Wait for container to be ready (FINISHED status)
            let attempts = 0;
            const maxAttempts = 10;
            let isReady = false;

            while (attempts < maxAttempts && !isReady) {
                attempts++;

                // Short wait between checks (1s)
                await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    const statusResponse = await axios.get(
                        `https://graph.threads.net/v1.0/${creationId}`,
                        {
                            params: {
                                fields: "status,error_message",
                                access_token: accessToken
                            }
                        }
                    );

                    const status = statusResponse.data.status;
                    console.log(`Threads container ${creationId} status: ${status}`);

                    if (status === "FINISHED") {
                        isReady = true;
                    } else if (status === "ERROR" || status === "EXPIRED") {
                        throw new Error(`Threads container creation failed: ${statusResponse.data.error_message || status}`);
                    }
                    // If IN_PROGRESS or PUBLISHING, loop again
                } catch (statusError) {
                    console.warn(`Error checking Threads container status (attempt ${attempts}):`, statusError);
                    // Continue waiting if transient error, or maybe break if 4xx? 
                    // Let's assume transient and continue, allow polling to timeout if persistent
                }
            }

            if (!isReady) {
                throw new Error("Timeout waiting for Threads container to be ready");
            }

            // Step 2: Publish the container
            await axios.post(
                "https://graph.threads.net/v1.0/me/threads_publish",
                {
                    creation_id: creationId,
                },
                {
                    params: { access_token: accessToken }
                }
            );
            console.log("Successfully posted to Threads");
        }

        return { success: true, mocked: false };

    } catch (error: any) {
        // Detailed error logging
        console.error(`Failed to post to ${provider}.`);

        if (axios.isAxiosError(error)) {
            console.error(`Axios Status: ${error.response?.status}`);
            console.error("Axios Response Data:", JSON.stringify(error.response?.data, null, 2));

            // Check for Threads expired session (Code 190)
            if (provider === "threads" && error.response?.data?.error?.code === 190) {
                console.error("Threads Session Expired. User needs to re-authenticate.");
                return { success: false, error: "Threads session expired. Please sign out and sign in again." };
            }
        } else {
            // Likely TwitterApi error
            console.error("Error Object:", error);
            if (error.code) console.error("Error Code:", error.code);
            if (error.data) console.error("Error Data:", JSON.stringify(error.data, null, 2));
            if (error.code === 403) {
                console.error("****************************************************************");
                console.error("CRITICAL ADVICE: Twitter 403 Forbidden Error detected.");
                console.error("1. If you are on Twitter FREE Tier: Media upload is NOT supported. You must post text-only.");
                console.error("2. If you are on BASIC Tier: Your access token might be stale. Reconnect Twitter in Settings.");
                console.error("****************************************************************");
            }
            if (error.errors) console.error("Inner Errors:", JSON.stringify(error.errors, null, 2));
        }

        return { success: false, error };
    }
}
