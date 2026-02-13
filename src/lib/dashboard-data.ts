import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getDashboardStats = unstable_cache(
    async (userId: string, activeClientId: string | null) => {
        const whereCondition = {
            userId: userId,
            clientProfileId: activeClientId || null,
        };

        const [totalPostsCount, publishedPostsCount, activeTopicsCount] = await Promise.all([
            prisma.post.count({ where: whereCondition }),
            prisma.post.count({ where: { ...whereCondition, status: "PUBLISHED" } }),
            prisma.topic.count({
                where: {
                    userId: userId,
                    enabled: true,
                    clientProfileId: activeClientId || null,
                } as any
            })
        ]);

        return {
            totalPostsCount,
            publishedPostsCount,
            activeTopicsCount
        };
    },
    ["dashboard-stats"],
    { revalidate: 60, tags: ["dashboard-stats"] }
);

export const getPendingPosts = unstable_cache(
    async (userId: string, activeClientId: string | null) => {
        return prisma.post.findMany({
            where: {
                userId: userId,
                clientProfileId: activeClientId || null,
                status: "PENDING"
            },
            orderBy: { createdAt: "desc" },
            take: 50
        });
    },
    ["dashboard-pending-posts"],
    { revalidate: 30, tags: ["dashboard-posts"] }
);

export const getActiveTopics = unstable_cache(
    async (userId: string, activeClientId: string | null) => {
        return prisma.topic.findMany({
            where: {
                userId: userId,
                enabled: true,
                clientProfileId: activeClientId || null,
            } as any,
            take: 5
        });
    },
    ["dashboard-active-topics"],
    { revalidate: 300, tags: ["dashboard-topics"] } // Cache topics longer
);
