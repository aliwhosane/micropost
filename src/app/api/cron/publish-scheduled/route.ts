import { prisma } from "@/lib/db";
import { publishToSocials } from "@/lib/social";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        // Authenticate the cron request (optional, but recommended)
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new Response('Unauthorized', { status: 401 });
        // }

        console.log("Running scheduled publisher cron...");

        const postsToPublish = await prisma.post.findMany({
            where: {
                status: "APPROVED",
                scheduledFor: {
                    lte: new Date(),
                },
            },
        });

        console.log(`Found ${postsToPublish.length} posts to publish.`);

        const results = [];

        for (const post of postsToPublish) {
            try {
                if (!post.platform) continue;

                const result = await publishToSocials({
                    id: post.id,
                    userId: post.userId,
                    content: post.content,
                    platform: post.platform!,
                });

                if (result.success) {
                    await prisma.post.update({
                        where: { id: post.id },
                        data: {
                            status: "PUBLISHED",
                            publishedAt: new Date(),
                            // scheduledFor: null // Optional: clear schedule or keep for history
                        },
                    });
                    results.push({ id: post.id, status: "SUCCESS" });
                } else {
                    await prisma.post.update({
                        where: { id: post.id },
                        data: {
                            status: "FAILED",
                        },
                    });
                    results.push({ id: post.id, status: "FAILED", error: result.error });
                }
            } catch (err: any) {
                console.error(`Failed to publish post ${post.id}:`, err);
                results.push({ id: post.id, status: "ERROR", error: err.message });
            }
        }

        return NextResponse.json({ success: true, published: results.length, details: results });
    } catch (error: any) {
        console.error("Cron job failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
