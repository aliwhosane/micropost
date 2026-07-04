import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Client, OAuth2 } from "@xdevplatform/xdk";
import { NextResponse } from "next/server";
import { analyzeFollowerTopicsAndGeneratePost } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        // 1. Authenticate user session
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const userId = session.user.id;

        // 2. Parse request body (optional params like platform, clientProfileId)
        const body = await req.json().catch(() => ({}));
        const platform = body.platform || "TWITTER";
        const clientProfileId = body.clientProfileId || null;

        // 3. Find connected Twitter account
        const account = await prisma.account.findFirst({
            where: {
                userId,
                provider: "twitter",
                clientProfileId,
            },
        });

        if (!account || !account.access_token) {
            return NextResponse.json(
                { error: "No connected Twitter account found. Please connect your Twitter account in Settings." },
                { status: 400 }
            );
        }

        let accessToken = account.access_token;
        const expiresAt = account.expires_at;
        const now = Math.floor(Date.now() / 1000);

        // 4. Refresh token if expired or close to expiration
        if (expiresAt && (expiresAt - now < 86400) && account.refresh_token) {
            try {
                const oauth2 = new OAuth2({
                    clientId: process.env.AUTH_TWITTER_ID?.trim()!,
                    clientSecret: process.env.AUTH_TWITTER_SECRET?.trim()!,
                    redirectUri: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/twitter`,
                    scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
                });

                const tokenResponse = await oauth2.refreshToken(account.refresh_token);

                await prisma.account.update({
                    where: {
                        provider_providerAccountId: {
                            provider: "twitter",
                            providerAccountId: account.providerAccountId,
                        },
                    },
                    data: {
                        access_token: tokenResponse.access_token,
                        refresh_token: tokenResponse.refresh_token || account.refresh_token,
                        expires_at: Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
                    },
                });

                accessToken = tokenResponse.access_token;
            } catch (refreshError: any) {
                console.error("Failed to refresh Twitter token:", refreshError);
                if (refreshError?.data?.error === 'invalid_request' || refreshError?.code === 400) {
                    return NextResponse.json({ error: "Twitter session expired. Please reconnect in Settings." }, { status: 401 });
                }
            }
        }

        const isRefreshed = accessToken !== account.access_token;
        if (!isRefreshed && expiresAt && now >= expiresAt) {
             return NextResponse.json({ error: "Twitter session expired. Please reconnect in Settings." }, { status: 401 });
        }

        // 5. Fetch Timeline
        const client = new Client({ accessToken });
        
        const timelineResponse = await client.users.getTimeline(account.providerAccountId, {
            max_results: 30,
            "tweet.fields": ["text", "lang", "created_at"],
            exclude: ["retweets", "replies"]
        });

        const timelineData = timelineResponse?.data || [];
        
        // Ensure we actually got some tweets back
        if (!timelineData || timelineData.length === 0) {
             return NextResponse.json({ error: "No recent posts found in your timeline. Follow more active accounts to see trends." }, { status: 404 });
        }
        
        // Extract texts
        const tweetsText = timelineData.map(tw => tw.text).filter((text): text is string => !!text);

        // 6. Analyze and Generate
        const analysis = await analyzeFollowerTopicsAndGeneratePost(tweetsText, platform);

        return NextResponse.json({
            topics: analysis.topics,
            post: analysis.post,
            sourceCount: tweetsText.length
        });

    } catch (error: any) {
        console.error("Follower topics error:", error);
        return NextResponse.json(
            { error: error?.data?.detail || error.message || "Failed to analyze follower topics" },
            { status: 500 }
        );
    }
}
