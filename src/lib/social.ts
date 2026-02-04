import { prisma } from "@/lib/db";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";

export async function publishToSocials(post: { id: string; userId: string; content: string; platform: string }) {
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
        console.warn(`No connected ${provider} account found for user ${post.userId}. Posting mocked.`);
        return { success: true, mocked: true };
    }

    try {
        if (provider === "twitter") {
            // Check for expiration
            let accessToken = account.access_token;
            const expiresAt = account.expires_at; // Integer timestamp in seconds
            const now = Math.floor(Date.now() / 1000);

            // If expired or about to expire (within 5 mins), refresh
            if (expiresAt && (expiresAt - now < 300) && account.refresh_token) {
                console.log("Twitter token expired or close to expiration. Refreshing...");
                try {
                    // TwitterApi requires client ID and secret for refresh
                    const client = new TwitterApi({
                        clientId: process.env.AUTH_TWITTER_ID!,
                        clientSecret: process.env.AUTH_TWITTER_SECRET!,
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
                } catch (refreshError) {
                    console.error("Failed to refresh Twitter token:", refreshError);
                    // If refresh fails, we might still try with old token or throw
                    throw new Error("Failed to refresh Twitter token");
                }
            }

            if (!accessToken) throw new Error("No access token available for Twitter");

            const client = new TwitterApi(accessToken);
            await client.v2.tweet(post.content);
            console.log("Successfully posted to Twitter");
        } else if (provider === "linkedin") {
            // LinkedIn API v2: ugcPosts or shares
            // We need the person's URN (ID). 
            // Often stored in 'providerAccountId' but sometimes just 'id'.
            // Let's assume providerAccountId is the URN (e.g. "urn:li:person:...")

            const urn = account.providerAccountId; // Ensure this is stored correctly by NextAuth

            await axios.post(
                "https://api.linkedin.com/v2/ugcPosts",
                {
                    author: `urn:li:person:${urn}`, // providerAccountId usually is the ID, we need to prefix if not present? 
                    // Actually NextAuth usually stores just the numeric/string ID. 
                    // LinkedIn URN format: urn:li:person:123456
                    lifecycleState: "PUBLISHED",
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: post.content,
                            },
                            shareMediaCategory: "NONE",
                        },
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );
            console.log("Successfully posted to LinkedIn");
        } else if (provider === "threads") {
            // Threads API publishing (2 steps)
            const accessToken = account.access_token;
            if (!accessToken) throw new Error("No access token available for Threads");

            // Step 1: Create a media container
            const createContainerResponse = await axios.post(
                "https://graph.threads.net/v1.0/me/threads",
                {
                    media_type: "TEXT",
                    text: post.content,
                },
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
        } else {
            // Likely TwitterApi error
            console.error("Error Object:", error);
            if (error.code) console.error("Error Code:", error.code);
            if (error.data) console.error("Error Data:", JSON.stringify(error.data, null, 2));
            if (error.errors) console.error("Inner Errors:", JSON.stringify(error.errors, null, 2));
        }

        return { success: false, error };
    }
}
