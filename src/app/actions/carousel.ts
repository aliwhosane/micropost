"use server";

import { generateCarouselContent } from "@/lib/ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function createCarouselAction(topic: string, clientId?: string) {
    const session = await auth();
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    try {
        let context = "";
        if (clientId) {
            const client = await prisma.clientProfile.findUnique({
                where: { id: clientId },
                select: { bio: true, tone: true, niche: true }
            });
            if (client) {
                context = `\n\nClient Context:\nBio: ${client.bio}\nNiche: ${client.niche}\nTone: ${client.tone}`;
            }
        }

        // Pass context to AI (appended to topic for now, or update AI signature)
        const effectiveTopic = topic + context;

        const slides = await generateCarouselContent(effectiveTopic);
        return { success: true, slides };
    } catch (error) {
        console.error("Carousel Action Error:", error);
        return { success: false, error: "Failed to generate carousel." };
    }
}
