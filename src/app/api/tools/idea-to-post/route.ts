import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { idea, tone } = await req.json();

        if (!idea) {
            return NextResponse.json(
                { error: "Please provide an idea or concept." },
                { status: 400 }
            );
        }

        if (idea.length > 500) {
            return NextResponse.json(
                { error: "Idea is too long (max 500 characters)." },
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
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Using a fast, capable model

        const prompt = `
            You are an expert social media strategist and ghostwriter.

            Task: Turn the following raw idea into engaging social media posts for LinkedIn, Twitter, and Threads.
            
            Idea/Concept: "${idea}"
            Tone: ${tone || "Professional but engaging"}

            Requirements:
            1. Create 3 distinct variations for EACH platform (Total 9 posts).
            2. Follow specific constraints for each platform:
            
            PLATFORM CONSTRAINTS:
            - **LinkedIn**: 
                - Professional yet human tone. 
                - Use line breaks for readability. 
                - Include a hook at the start. 
                - Add 3-5 relevant hashtags at the bottom.
                - Max 1500 chars (but keep it concise).
            
            - **Twitter (X)**: 
                - Short, punchy, conversational. 
                - Max 220 chars. 
                - Use 1-2 relevant hashtags. 
                - Focus on clarity and impact.
            
            - **Threads**: 
                - Casual, conversational, "in-the-moment" vibe. 
                - Start a discussion/ask a question.
                - Max 400 chars.
                - NO hashtags (or max 1 tag if critical). 
                - fluid structure.

            Return the result in this STRICT JSON format:
            {
                "linkedin": [
                    { "content": "..." },
                    { "content": "..." },
                    { "content": "..." }
                ],
                "twitter": [
                    { "content": "..." },
                    { "content": "..." },
                    { "content": "..." }
                ],
                "threads": [
                    { "content": "..." },
                    { "content": "..." },
                    { "content": "..." }
                ]
            }

            Do not include markdown formatting (like \`\`\`json). Return only the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(cleanedText);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Idea to Post generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate posts" },
            { status: 500 }
        );
    }
}
