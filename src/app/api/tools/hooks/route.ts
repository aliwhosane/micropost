import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const prompt = `
        You are a viral social media expert.
        Generate 10 viral hooks (opening lines) for a post about: "${topic}".
        
        The hooks should use different psychological triggers:
        1. Contrarian (e.g., "Stop doing X")
        2. Negative/Warning (e.g., "The mistake costing you...")
        3. Storytelling (e.g., "I lost everything when...")
        4. Statistical/Numbers (e.g., "99% of people fail at...")
        5. How-to/Benefit (e.g., "How to allow X without Y")
        
        Return the response as a JSON array where each object has:
        - "hook": The text of the hook.
        - "category": The style/category of the hook.
        
        Output valid JSON only.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Basic clean up of markdown code blocks if present
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json({ hooks: JSON.parse(cleanedText) });
    } catch (error) {
        console.error("Viral hook generation error:", error);
        return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
    }
}
