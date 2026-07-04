import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { currentBio, goal, niche, platform } = await req.json();

        if (!goal || !niche || !platform) {
            return NextResponse.json(
                { error: "Please provide a goal, niche, and platform." },
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
                        bios: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING, description: "A bio option" },
                            description: "Array of 5 bio options",
                        },
                    },
                    required: ["bios"],
                },
            },
        });

        const prompt = `
            You are an expert personal branding consultant and social media strategist.
            
            Task: Write 5 distinct, high-converting social media bios for a user.
            
            User Details:
            - Role/Niche: ${niche}
            - Platform: ${platform}
            - Goal: ${goal}
            ${currentBio ? `- Current Bio: "${currentBio}"` : ""}
            
            Guidelines for ${platform}:
            ${platform === 'Twitter' || platform === 'X' ? '- strict 160 character limit per bio.\n- Use minimal emojis.\n- Focus on credibility and distinctiveness.' : ''}
            ${platform === 'LinkedIn' ? '- Professional but engaging tone.\n- Focus on value proposition.\n- Can be up to 3-4 lines.' : ''}
            ${platform === 'Instagram' ? '- Use line breaks.\n- Use emojis effectively.\n- Focus on personality and aesthetic.' : ''}
            
            Return 5 bio options in the "bios" array.
        `;

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());

        return NextResponse.json(data);

    } catch (error) {
        console.error("Bio generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate bios" },
            { status: 500 }
        );
    }
}
