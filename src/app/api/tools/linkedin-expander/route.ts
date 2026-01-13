import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { tweet } = await req.json();

        if (!tweet) {
            return NextResponse.json(
                { error: "Please provide a tweet or short thought." },
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
            You are a master LinkedIn content creator who knows how to go viral.
            
            Task: Expand the following short tweet into 3 distinct, high-engagement LinkedIn posts.
            
            Source Tweet/Idea:
            "${tweet}"
            
            Requirements:
            - Create 3 distinct formats (Story-driven, Advice/How-to, Analytical/Listicle).
            - Use short paragraphs and "broetry" formatting for readability.
            - Include strong hooks and clear takeaways.
            - Add a question at the end to drive engagement.
            
            Return the response in strict JSON format with this structure:
            {
                "variations": [
                    {
                        "type": "Story",
                        "content": "..."
                    },
                    {
                        "type": "Actionable Advice",
                        "content": "..."
                    },
                    {
                        "type": "Analytical",
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
        console.error("LinkedIn expansion error:", error);
        return NextResponse.json(
            { error: "Failed to generate posts" },
            { status: 500 }
        );
    }
}
