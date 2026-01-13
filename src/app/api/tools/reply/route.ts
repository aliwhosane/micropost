import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

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
            
            Return the response in strict JSON format with this structure:
            {
                "replies": [
                    {
                        "style": "Funny",
                        "content": "..."
                    },
                    {
                        "style": "Grateful",
                        "content": "..."
                    },
                    {
                        "style": "Question",
                        "content": "..."
                    }
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
        console.error("Reply generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate replies" },
            { status: 500 }
        );
    }
}
