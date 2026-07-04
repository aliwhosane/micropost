import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { comment } = await req.json();

        if (!comment) {
            return NextResponse.json(
                { error: "Please provide a comment to reply to." },
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
            model: MODELS.CREATIVE,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        replies: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    style: { type: SchemaType.STRING, description: "Reply style (Funny, Grateful, or Question)" },
                                    content: { type: SchemaType.STRING, description: "The reply content" }
                                },
                                required: ["style", "content"]
                            }
                        }
                    },
                    required: ["replies"]
                }
            }
        });

        const prompt = `
            You are a social media manager known for great audience engagement.
            
            Task: Write 3 replies to the following user comment.
            
            Comment:
            "${comment}"
            
            Styles:
            1. Funny/Witty (Lighthearted, maybe a pun)
            2. Grateful/Appreciative (Sincere thanks)
            3. Engaging Question (Keeps the thread going)
            
            Constraints:
            - Keep them short (under 280 chars).
            - Sound authentic, not like a bot.
            - No hashtags.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("Reply generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate replies" },
            { status: 500 }
        );
    }
}
