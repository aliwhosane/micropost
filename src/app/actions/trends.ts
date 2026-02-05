"use server";

import { auth } from "@/auth";
import { fetchTrendingNews, aggregateNews } from "@/lib/news";
import { analyzeTrends, generateSocialPost } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function fetchTrendsAction(topic?: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    let newsItems = [];

    if (topic) {
        newsItems = await fetchTrendingNews(topic);
    } else {
        // Fallback: fetch for user's enabled topics
        const userTopics = await prisma.topic.findMany({
            where: {
                userId: session.user.id,
                enabled: true
            },
            select: { name: true }
        });

        const topicNames = userTopics.map(t => t.name);
        if (topicNames.length > 0) {
            newsItems = await aggregateNews(topicNames);
        } else {
            // Default generic topics if user has none
            newsItems = await aggregateNews(["Technology", "Business", "Health"]);
        }
    }

    // Limit to 10 for analysis to save tokens/time
    const limitedItems = newsItems.slice(0, 10);

    // Analyze
    const analyzed = await analyzeTrends(limitedItems);

    return analyzed;
}

export async function getUserTopicsAction() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const topics = await prisma.topic.findMany({
        where: {
            userId: session.user.id,
            enabled: true
        },
        select: { name: true }
    });
    return topics.map(t => t.name);
}

export async function generateTrendPostAction(
    platform: "LINKEDIN" | "TWITTER" | "THREADS",
    trend: { title: string; summary: string; link: string },
    userInstructions?: string
) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Fetch user preferences/style if needed
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { preferences: true, topics: true } // metrics/topics might still be relevant for stance
    });

    if (!user) throw new Error("User not found");

    // Find a matching topic or default
    // We can try to approximate a matching topic from user's topics string match
    // For now, simpler: pass user's topics and let AI decide or use "Current Events"
    const topicNames = user.topics.map(t => t.name);

    const { content, topic } = await generateSocialPost({
        topics: topicNames,
        styleSample: user.preferences?.styleSample || undefined,
        platform: platform,
        topicAttributes: user.topics.map(t => ({
            name: t.name,
            notes: t.notes || undefined,
            stance: t.stance || undefined
        })),
        temporaryThoughts: userInstructions,
        newsContext: {
            title: trend.title,
            summary: trend.summary,
            url: trend.link
        }
    });

    // Save as DRAFT/Pending
    await prisma.post.create({
        data: {
            userId: user.id,
            content,
            platform,
            topic: "Trend: " + (topic || "General"),
            status: "DRAFT" // Start as draft so user can review it immediately
        }
    });

    return { success: true };
}
