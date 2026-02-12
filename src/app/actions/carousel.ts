"use server";

import { generateCarouselContent } from "@/lib/ai";

export async function createCarouselAction(topic: string) {
    try {
        const slides = await generateCarouselContent(topic);
        return { success: true, slides };
    } catch (error) {
        console.error("Carousel Action Error:", error);
        return { success: false, error: "Failed to generate carousel." };
    }
}
