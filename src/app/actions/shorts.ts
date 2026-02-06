'use server';

import { generateVideoScript } from "@/lib/ai";
import { generateVerticalStats } from "@/lib/image-gen";
import { prisma } from "@/lib/db"; // Assuming DB access might be needed later, or remove if unused for now

export async function createScriptAction(userInput: string) {
    try {
        const script = await generateVideoScript(userInput);
        return { success: true, script };
    } catch (error) {
        console.error("Script Action Error:", error);
        return { success: false, error: "Failed to generate script" };
    }
}

export async function renderStoryboardAction(scenes: any[]) {
    try {
        const renderedScenes = await Promise.all(scenes.map(async (scene) => {
            const buffer = await generateVerticalStats(scene.text, scene.type);
            const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
            return {
                ...scene,
                imageUrl: base64
            };
        }));

        return { success: true, scenes: renderedScenes };
    } catch (error) {
        console.error("Render Action Error:", error);
        return { success: false, error: "Failed to render visuals" };
    }
}
