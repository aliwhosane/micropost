'use server';

import { generateVideoScript } from "@/lib/ai";

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

import { generateVerticalStats, generateAiImage } from "@/lib/image-gen";
import { uploadBufferAndSign, uploadAndSign } from "@/lib/s3-helper";

export async function renderStoryboardAction(scenes: any[], style: "MINIMAL" | "CINEMATIC" = "MINIMAL") {
    console.log("Render Action Started with scenes:", JSON.stringify(scenes, null, 2));
    try {
        const renderedScenes = await Promise.all(scenes.map(async (scene: any, idx: number) => {
            console.log(`Processing scene ${idx}:`, scene);
            let bgImage = undefined;

            if (style === "CINEMATIC") {
                try {
                    if (!scene.text) {
                        console.warn(`Scene ${idx} has missing text!`);
                        scene.text = "Visual Cue";
                    }
                    console.log(`Generating AI Image for scene ${idx} with text: ${scene.text}`);
                    // This generates a base64 string
                    const aiImageBase64 = await generateAiImage(scene.text, "TIKTOK");
                    // Assuming generateAiImage returns base64 string "data:image/..."
                    // We can either pass it to generateVerticalStats (which uses it as BG) OR upload it now.
                    // generateVerticalStats expects a string (URL or base64) for CSS.
                    // Since it's used internally by Satori, base64 is fine there.
                    bgImage = aiImageBase64;
                    console.log(`AI Image generated for scene ${idx}`);
                } catch (e) {
                    console.error("Failed to generate AI background for scene, falling back to minimal", e);
                }
            }

            console.log(`Generating Vertical Stats for scene ${idx}`);
            // generateVerticalStats returns a Buffer (PNG)
            const buffer = await generateVerticalStats(scene.text || "", scene.type || "BODY", bgImage);

            console.log(`Uploading Scene ${idx} to S3...`);
            const s3Url = await uploadBufferAndSign(buffer, "image/png", "storyboards");
            console.log(`Scene ${idx} uploaded: ${s3Url.substring(0, 50)}...`);

            return {
                ...scene,
                imageUrl: s3Url // Return S3 URL instead of Base64
            };
        }));

        return { success: true, scenes: renderedScenes };
    } catch (error: any) {
        console.error("Render Action Error stack:", error.stack);
        console.error("Render Action Error message:", error.message);
        return { success: false, error: "Failed to render visuals" };
    }
}

import { generateSpeech } from "@/lib/audio";

export async function generateAudioAction(scriptText: string, voiceId: string = "Kore") {
    try {
        const audioBase64 = await generateSpeech(scriptText, voiceId);

        console.log("Uploading generated audio to S3...");
        const s3Url = await uploadAndSign(`data:audio/wav;base64,${audioBase64}`, "voiceovers");

        return { success: true, audio: s3Url }; // Return S3 URL (reusing field name 'audio' for compatibility, check usage)
    } catch (error) {
        console.error("Audio Action Error:", error);
        return { success: false, error: "Failed to generate audio" };
    }
}
