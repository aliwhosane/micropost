"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateStyleDescription } from "@/lib/ai";

export async function completeOnboarding(tone: string, styleSample?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.preferences.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            tone: tone,
            styleSample: styleSample || "",
            onboardingCompleted: true
        } as any,
        update: {
            tone: tone,
            styleSample: styleSample, // Only update if provided? Or always? Let's say if provided or allow overwrite.
            onboardingCompleted: true
        } as any
    });

    revalidatePath("/dashboard");
}

export async function saveAnalyzedTone(styleSample: string, tone: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.preferences.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            styleSample,
            tone
        } as any,
        update: {
            styleSample,
            tone
        } as any
    });
}

export async function analyzeStyleFromText(text: string): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (!text || text.length < 50) {
        throw new Error("Text too short for analysis");
    }

    try {
        const description = await generateStyleDescription([text]);
        return description;
    } catch (error) {
        console.error("Failed to analyze style:", error);
        throw new Error("Failed to analyze style");
    }
}
