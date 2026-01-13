import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

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
            
            Return the response in strict JSON format with this structure:
            {
                "bios": [
                    "Bio option 1...",
                    "Bio option 2...",
                    "Bio option 3...",
                    "Bio option 4...",
                    "Bio option 5..."
                ]
            }
            
            Do not include markdown code blocks. Just return the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanedText));

    } catch (error) {
        console.error("Bio generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate bios" },
            { status: 500 }
        );
    }
}
