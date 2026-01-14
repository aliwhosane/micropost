import { prisma } from "@/lib/db";
import { generateSocialPost } from "@/lib/ai";
import { sendDailyDigest } from "@/lib/email";

export async function runDailyGeneration(targetUserId?: string, temporaryThoughts?: string) {
    console.log("Starting daily generation workflow...");

    // 1. Fetch users with preferences and enabled topics
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

    console.log(`Found ${users.length} eligible users.`);

    const results = [];

    // 2. Process each user
    for (const user of users) {
        if (!user.email || !user.preferences) continue;

        const { postsPerDay, styleSample } = user.preferences;
        const topicNames = user.topics.map((t: any) => t.name);

        // Determine platforms. If none connected, default to Twitter for demo.
        // In real app maybe skip or notify.
        const platforms: ("LINKEDIN" | "TWITTER")[] = [];
        if (user.accounts.some((a: any) => a.provider === "linkedin")) platforms.push("LINKEDIN");
        if (user.accounts.some((a: any) => a.provider === "twitter")) platforms.push("TWITTER");
        if (platforms.length === 0) platforms.push("TWITTER"); // Fallback

        const generatedPosts = [];

        // 3. Generate Posts

        // Twitter Generation Loop
        const twitterCount = user.preferences.twitterPostsPerDay || 0;
        if (user.accounts.some((a: any) => a.provider === "twitter")) {
            for (let i = 0; i < twitterCount; i++) {
                try {
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
        if (user.accounts.some((a: any) => a.provider === "linkedin")) {
            for (let i = 0; i < linkedinCount; i++) {
                try {
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
