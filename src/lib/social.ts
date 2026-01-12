import { prisma } from "@/lib/db";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";

export async function publishToSocials(post: { id: string; userId: string; content: string; platform: string }) {
    console.log(`Attempting to publish post ${post.id} to ${post.platform}...`);

    // 1. Get User's Account Token
    // We search for the specific provider account linked to this user.
    const provider = post.platform === "TWITTER" ? "twitter" : "linkedin";

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
        }

        return { success: true, mocked: false };

    } catch (error) {
        console.error(`Failed to post to ${provider}:`, error);
        // For now, if it fails (e.g. expired token), we return false so status stays APPROVED or moves to FAILED
        return { success: false, error };
    }
}
