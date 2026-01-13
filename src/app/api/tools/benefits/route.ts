import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { features } = await req.json();

        if (!features) {
            return NextResponse.json(
                { error: "Please provide a list of features." },
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
            You are a world-class copywriter who follows the "Sell the Hole, Not the Drill" philosophy.
            
            Task: Convert the following list of technical features into emotional, outcome-driven benefits.
            
            Features:
            "${features}"
            
            Return the response in strict JSON format with this structure:
            {
                "conversions": [
                    {
                        "feature": "50GB Storage", // The original feature
                        "benefit": "Never delete a photo specifically to make space again.", // The emotional benefit
                        "emotion": "Relief/Security" // The core emotion targeted
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
        console.error("Benefit generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate benefits" },
            { status: 500 }
        );
    }
}
