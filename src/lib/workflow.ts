import { prisma } from "@/lib/db";
import { generateSocialPost, analyzeTrends } from "@/lib/ai";
import { aggregateNews } from "@/lib/news";
import { sendDailyDigest } from "@/lib/email";

export async function runDailyGeneration(targetUserId?: string, temporaryThoughts?: string, manualFramework?: string, targetPlatforms?: string[]) {
    console.log("Starting daily generation workflow...");

    // Helper to pick a weighted random framework
    const selectRandomFramework = () => {
        const rand = Math.random();
        // 40% None (Freeform)
        if (rand < 0.40) return undefined;
        // 15% PAS
        if (rand < 0.55) return "PAS";
        // 15% AIDA
        if (rand < 0.70) return "AIDA";
        // 15% Storytelling
        if (rand < 0.85) return "STORYTELLING";
        // 15% Contrarian
        return "CONTRARIAN";
    };

    // 1. Fetch users with preferences and enabled topics
    // CRITICAL: Strict isolation - if targetUserId is provided, we MUST only fetch that user.
    const users = await prisma.user.findMany({
        where: {
            ...(targetUserId ? { id: targetUserId } : {}),
            preferences: {
                isNot: null,
            },
            topics: {
                some: {
                    enabled: true,
                },
            },
        },
        include: {
            preferences: true,
            topics: {
                where: { enabled: true },
            },
            accounts: true,
        },
    });

    console.log(`Found ${users.length} eligible users. Target User ID: ${targetUserId || "ALL"}`);

    const results = [];

    // 2. Process each user
    for (const user of users) {
        if (!user.email || !user.preferences) continue;

        const { postsPerDay, styleSample } = user.preferences;
        const topicNames = user.topics.map((t: any) => t.name);

        // Determine platforms. If none connected, default to Twitter for demo.
        // In real app maybe skip or notify.
        const availablePlatforms: string[] = [];
        if (user.accounts.some((a: any) => a.provider === "linkedin")) availablePlatforms.push("LINKEDIN");
        if (user.accounts.some((a: any) => a.provider === "threads")) availablePlatforms.push("THREADS");
        if (user.accounts.some((a: any) => a.provider === "twitter")) availablePlatforms.push("TWITTER");
        if (availablePlatforms.length === 0) availablePlatforms.push("TWITTER"); // Fallback

        // Should function helper to check if we should run for this platform
        const shouldRunFor = (platform: string) => {
            // If manual target platforms are provided, strictly adhere to them
            if (targetPlatforms && targetPlatforms.length > 0) {
                return targetPlatforms.includes(platform);
            }
            // Otherwise run if available (default daily behavior)
            return availablePlatforms.includes(platform);
        }

        const generatedPosts = [];

        // 2a. Fetch Trends for this user (Newsjacking Injection)
        let newsContext = undefined;
        try {
            // Only fetch if they have topics
            if (topicNames.length > 0) {
                // Get trending news for user's topics (limit to 2 topics to avoid huge RSS fetch if they have many)
                // actually aggregateNews handles array.
                const newsItems = await aggregateNews(topicNames.slice(0, 3));

                if (newsItems.length > 0) {
                    // Analyze top 3 to save tokens/time
                    const analyzedTrends = await analyzeTrends(newsItems.slice(0, 3));
                    // Sort by viral score
                    analyzedTrends.sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));

                    // Pick the top trend
                    if (analyzedTrends.length > 0) {
                        const topTrend = analyzedTrends[0];
                        newsContext = {
                            title: topTrend.title,
                            summary: topTrend.aiSummary || topTrend.contentSnippet || "",
                            url: topTrend.link
                        };
                        console.log(`[TrendSurfer] Injected trend for user ${user.id}: "${topTrend.title}"`);
                    }
                }
            }
        } catch (e) {
            console.error(`[TrendSurfer] Failed to fetch trends for user ${user.id}`, e);
        }

        // 3. Generate Posts

        // Twitter Generation Loop
        const twitterCount = user.preferences.twitterPostsPerDay || 0;
        if (shouldRunFor("TWITTER") && user.accounts.some((a: any) => a.provider === "twitter")) {
            for (let i = 0; i < twitterCount; i++) {
                try {
                    // Use manual framework if provided (manual generation), otherwise randomize
                    const currentFramework = manualFramework || selectRandomFramework();

                    const { content, topic } = await generateSocialPost({
                        topics: topicNames,
                        styleSample: styleSample || undefined,
                        platform: "TWITTER",
                        topicAttributes: user.topics.map((t: any) => ({
                            name: t.name,
                            notes: t.notes,
                            stance: t.stance
                        })),
                        temporaryThoughts,
                        newsContext,
                        framework: currentFramework
                    });

                    // Save to Database
                    const post = await prisma.post.create({
                        data: {
                            userId: user.id,
                            content,
                            platform: "TWITTER",
                            topic: topic,
                            status: "PENDING",
                        },
                    });

                    generatedPosts.push({
                        id: post.id,
                        content: post.content,
                        platform: post.platform!,
                        topic: post.topic || topic,
                    });
                } catch (err) {
                    console.error(`Failed to generate Twitter post for user ${user.id}:`, err);
                }
            }
        }

        // LinkedIn Generation Loop
        const linkedinCount = user.preferences.linkedinPostsPerDay || 0;
        if (shouldRunFor("LINKEDIN") && user.accounts.some((a: any) => a.provider === "linkedin")) {
            for (let i = 0; i < linkedinCount; i++) {
                try {
                    const currentFramework = manualFramework || selectRandomFramework();

                    const { content, topic } = await generateSocialPost({
                        topics: topicNames,
                        styleSample: styleSample || undefined,
                        platform: "LINKEDIN",
                        topicAttributes: user.topics.map((t: any) => ({
                            name: t.name,
                            notes: t.notes,
                            stance: t.stance
                        })),
                        temporaryThoughts,
                        newsContext,
                        framework: currentFramework
                    });

                    // Save to Database
                    const post = await prisma.post.create({
                        data: {
                            userId: user.id,
                            content,
                            platform: "LINKEDIN",
                            topic: topic,
                            status: "PENDING",
                        },
                    });

                    generatedPosts.push({
                        id: post.id,
                        content: post.content,
                        platform: post.platform!,
                        topic: post.topic || topic,
                    });
                } catch (err) {
                    console.error(`Failed to generate LinkedIn post for user ${user.id}:`, err);
                }
            }
        }

        // Threads Generation Loop
        const threadsCount = (user.preferences as any).threadsPostsPerDay || 0;
        if (shouldRunFor("THREADS") && user.accounts.some((a: any) => a.provider === "threads")) {
            for (let i = 0; i < threadsCount; i++) {
                try {
                    const currentFramework = manualFramework || selectRandomFramework();

                    const { content, topic } = await generateSocialPost({
                        topics: topicNames,
                        styleSample: styleSample || undefined,
                        platform: "THREADS",
                        topicAttributes: user.topics.map((t: any) => ({
                            name: t.name,
                            notes: t.notes,
                            stance: t.stance
                        })),
                        temporaryThoughts,
                        newsContext,
                        framework: currentFramework
                    });

                    // Save to Database
                    const post = await prisma.post.create({
                        data: {
                            userId: user.id,
                            content,
                            platform: "THREADS",
                            topic: topic,
                            status: "PENDING",
                        },
                    });

                    generatedPosts.push({
                        id: post.id,
                        content: post.content,
                        platform: post.platform!,
                        topic: post.topic || topic,
                    });
                } catch (err) {
                    console.error(`Failed to generate Threads post for user ${user.id}:`, err);
                }
            }
        }

        // 5. Send Daily Digest
        if (generatedPosts.length > 0) {
            const emailResult = await sendDailyDigest({
                email: user.email,
                name: user.name || "Creator",
                posts: generatedPosts,
                approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
            });
            results.push({ userId: user.id, success: true, count: generatedPosts.length, email: emailResult });
        }
    }

    return results;
}
