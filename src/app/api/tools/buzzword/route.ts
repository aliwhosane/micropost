import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Please provide some text to analyze." },
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
            You are a ruthless editor who hates corporate jargon, buzzwords, and vague business speak.
            
            Task: Analyze the following text and identify every instance of "corporate fluff".
            
            Text to analyze:
            "${text}"
            
            Return the response in strict JSON format with this structure:
            {
                "score": 85, // 0-100 "Human Score". 100 is perfectly human, 0 is a robot.
                "matches": [
                    {
                        "word": "synergy", // The specific word or phrase found in the text
                        "alternative": "teamwork", // A punchier, human alternative
                        "reason": "Overused and vague." // Why it's bad
                    }
                ]
            }
            
            If the text is clean, return a high score and empty matches array.
            Do not include markdown code blocks. Just return the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanedText));

    } catch (error) {
        console.error("Buzzword analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze text" },
            { status: 500 }
        );
    }
}
