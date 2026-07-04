import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { videoTitle } = await req.json();

        if (!videoTitle) {
            return NextResponse.json(
                { error: "Please provide a video title." },
                { status: 400 }
            );
        }

        if (videoTitle.length > 200) {
            return NextResponse.json(
                { error: "Video title is too long (max 200 characters)." },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: MODELS.ANALYTICAL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        ideas: {
                            type: SchemaType.ARRAY,
                            description: "5 short, punchy thumbnail text overlay ideas",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    text: { type: SchemaType.STRING, description: "The overlay text (max 4 words)" },
                                },
                                required: ["text"],
                            },
                        },
                    },
                    required: ["ideas"],
                },
            },
        });

        const prompt = `
            You are a YouTube viral growth expert.
            
            Task: Create 5 short, punchy text overlays for a YouTube thumbnail based on the following video title.
            
            Video Title/Concept:
            "${videoTitle}"
            
            Constraints:
            - MAX 4 words per overlay (shorter is better).
            - Focus on curiosity, shock, or result.
            - Must be different from the title itself.
            - Examples of good overlays: "I Quit", "1M Views in 7 Days", "Don't Buy This", "The Truth".
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("Thumbnail title generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate thumbnail text" },
            { status: 500 }
        );
    }
}
