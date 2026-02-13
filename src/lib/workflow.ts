import { prisma } from "@/lib/db";
import { generateSocialPost, analyzeTrends } from "@/lib/ai";
import { aggregateNews } from "@/lib/news";
import { sendDailyDigest } from "@/lib/email";
import { pLimit } from "@/lib/utils";

export async function runDailyGeneration(targetUserId?: string, temporaryThoughts?: string, manualFramework?: string, targetPlatforms?: string[], clientId?: string) {
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

    const limit = pLimit(5); // Process 5 users concurrently

    // 2. Process each user in parallel
    const results = await Promise.all(users.map(user => limit(async () => {
        if (!user.email || !user.preferences) return null;

        // Determine platforms & Settings
        // If clientId is provided, we MUST check the Client's connected accounts and Preferences.
        let availablePlatforms: string[] = [];
        let clientContext: any = null;

        let twitterCount = user.preferences.twitterPostsPerDay || 0;
        let linkedinCount = user.preferences.linkedinPostsPerDay || 0;
        let threadsCount = (user.preferences as any).threadsPostsPerDay || 0;
        let styleSample = user.preferences.styleSample || "";
        let activeTopics = user.topics.filter((t: any) => t.clientProfileId === null); // Default to personal

        if (clientId) {
            const client = await prisma.clientProfile.findUnique({
                where: { id: clientId },
                include: { accounts: true, topics: { where: { enabled: true } } } // Fetch client topics specifically if relation exists
            }) as any;

            if (client) {
                clientContext = client;

                // Override counts
                twitterCount = client.twitterPostsPerDay || 0;
                linkedinCount = client.linkedinPostsPerDay || 0;
                threadsCount = client.threadsPostsPerDay || 0;
                if (client.styleSample) styleSample = client.styleSample;

                // Override topics
                activeTopics = client.topics || [];

                if (client.accounts.some((a: any) => a.provider === "linkedin")) availablePlatforms.push("LINKEDIN");
                if (client.accounts.some((a: any) => a.provider === "threads")) availablePlatforms.push("THREADS");
                if (client.accounts.some((a: any) => a.provider === "twitter")) availablePlatforms.push("TWITTER");
            }
        } else {
            // Personal Brand -> Use User accounts and Personal topics
            if (user.accounts.some((a: any) => a.provider === "linkedin")) availablePlatforms.push("LINKEDIN");
            if (user.accounts.some((a: any) => a.provider === "threads")) availablePlatforms.push("THREADS");
            if (user.accounts.some((a: any) => a.provider === "twitter")) availablePlatforms.push("TWITTER");
        }

        const topicNames = activeTopics.map((t: any) => t.name);

        // Fallback for demo if no accounts connected at all? 
        if (availablePlatforms.length === 0) availablePlatforms.push("TWITTER", "LINKEDIN");

        // Should function helper to check if we should run for this platform
        const shouldRunFor = (platform: string) => {
            // If manual target platforms are provided, strictly adhere to them
            if (targetPlatforms && targetPlatforms.length > 0) {
                return targetPlatforms.includes(platform);
            }
            // Otherwise run if available (default daily behavior)
            return availablePlatforms.includes(platform);
        }

        const generatedPosts: any[] = [];

        // 2a. Fetch Trends for this user (Newsjacking Injection)
        let newsContext: any = undefined;
        try {
            // Only fetch if they have topics
            if (topicNames.length > 0) {
                // Get trending news for user's topics (limit to 2 topics to avoid huge RSS fetch if they have many)
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

        // 3. Generate Posts Parallelly
        const generationTasks = [];

        // Twitter Generation Tasks
        const hasTwitter = clientContext
            ? clientContext.accounts.some((a: any) => a.provider === "twitter")
            : user.accounts.some((a: any) => a.provider === "twitter");

        if (shouldRunFor("TWITTER") && (hasTwitter || availablePlatforms.includes("TWITTER"))) {
            for (let i = 0; i < twitterCount; i++) {
                generationTasks.push(async () => {
                    try {
                        const currentFramework = manualFramework || selectRandomFramework();
                        let currentStyle = styleSample;
                        let currentTopicAttributes = activeTopics.map((t: any) => ({
                            name: t.name,
                            notes: t.notes,
                            stance: t.stance
                        }));

                        let safeThoughts = temporaryThoughts;
                        if (clientContext) {
                            const ctx = clientContext as any;
                            currentStyle = ctx.tone || styleSample;
                            safeThoughts = safeThoughts ? safeThoughts + `\n\nClient Context: ${ctx.bio} - Niche: ${ctx.niche}`
                                : `Client Context: ${ctx.bio} - Niche: ${ctx.niche}`;
                        }

                        const { content, topic } = await generateSocialPost({
                            topics: topicNames,
                            styleSample: currentStyle || undefined,
                            platform: "TWITTER",
                            topicAttributes: currentTopicAttributes,
                            temporaryThoughts: safeThoughts,
                            newsContext,
                            framework: currentFramework
                        });

                        const post = await prisma.post.create({
                            data: {
                                userId: user.id,
                                content,
                                platform: "TWITTER",
                                topic: topic,
                                status: "PENDING",
                                clientProfileId: clientId || null,
                            } as any,
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
                });
            }
        }

        // LinkedIn Generation Tasks
        const hasLinkedin = clientContext
            ? clientContext.accounts.some((a: any) => a.provider === "linkedin")
            : user.accounts.some((a: any) => a.provider === "linkedin");

        if (shouldRunFor("LINKEDIN") && (hasLinkedin || availablePlatforms.includes("LINKEDIN"))) {
            for (let i = 0; i < linkedinCount; i++) {
                generationTasks.push(async () => {
                    try {
                        const currentFramework = manualFramework || selectRandomFramework();

                        const { content, topic } = await generateSocialPost({
                            topics: topicNames,
                            styleSample: styleSample || undefined,
                            platform: "LINKEDIN",
                            topicAttributes: activeTopics.map((t: any) => ({
                                name: t.name,
                                notes: t.notes,
                                stance: t.stance
                            })),
                            temporaryThoughts,
                            newsContext,
                            framework: currentFramework
                        });

                        const post = await prisma.post.create({
                            data: {
                                userId: user.id,
                                content,
                                platform: "LINKEDIN",
                                topic: topic,
                                status: "PENDING",
                                clientProfileId: clientId || null,
                            } as any,
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
                });
            }
        }

        // Threads Generation Tasks
        const hasThreads = clientContext
            ? clientContext.accounts.some((a: any) => a.provider === "threads")
            : user.accounts.some((a: any) => a.provider === "threads");

        if (shouldRunFor("THREADS") && (hasThreads || availablePlatforms.includes("THREADS"))) {
            for (let i = 0; i < threadsCount; i++) {
                generationTasks.push(async () => {
                    try {
                        const currentFramework = manualFramework || selectRandomFramework();

                        const { content, topic } = await generateSocialPost({
                            topics: topicNames,
                            styleSample: styleSample || undefined,
                            platform: "THREADS",
                            topicAttributes: activeTopics.map((t: any) => ({
                                name: t.name,
                                notes: t.notes,
                                stance: t.stance
                            })),
                            temporaryThoughts,
                            newsContext,
                            framework: currentFramework
                        });

                        const post = await prisma.post.create({
                            data: {
                                userId: user.id,
                                content,
                                platform: "THREADS",
                                topic: topic,
                                status: "PENDING",
                                clientProfileId: clientId || null,
                            } as any,
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
                });
            }
        }

        // Execute all generation tasks for this user in parallel
        await Promise.all(generationTasks.map(task => task()));

        // 5. Send Daily Digest
        if (generatedPosts.length > 0) {
            const emailResult = await sendDailyDigest({
                email: user.email,
                name: user.name || "Creator",
                posts: generatedPosts,
                approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
            });
            return { userId: user.id, success: true, count: generatedPosts.length, email: emailResult };
        }
        return { userId: user.id, success: true, count: 0, email: null };
    })));

    return results.filter(r => r !== null);
}
