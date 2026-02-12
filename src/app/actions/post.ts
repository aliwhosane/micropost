"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generatePostContent } from "@/lib/ai";

export async function createPostAction(
    topic: string,
    platform: "TWITTER" | "LINKEDIN" | "THREADS",
    clientId?: string,
    instructions?: string
) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        let context = "";
        let tone = "";

        // If a client ID is provided, fetch specific client context
        if (clientId) {
            const client = await prisma.clientProfile.findUnique({
                where: { id: clientId },
                select: { bio: true, tone: true, niche: true }
            });

            if (client) {
                context = `\n\nClient Context:\nBio: ${client.bio}\nNiche: ${client.niche}\nTarget Audience: ${client.niche}`;
                tone = client.tone || "";
            }
        }

        // Generate content using AI
        const content = await generatePostContent(
            topic,
            platform,
            instructions ? `${instructions} ${context}` : context,
            tone
        );

        // Save to DB
        const post = await prisma.post.create({
            data: {
                userId: session.user.id,
                content,
                topic,
                platform,
                clientProfileId: clientId || null,
                status: "DRAFT"
            } as any
        });

        revalidatePath("/dashboard/posts");
        return { success: true, post };

    } catch (error) {
        console.error("Create Post Error:", error);
        return { success: false, error: "Failed to create post." };
    }
}
