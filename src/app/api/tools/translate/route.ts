import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { text, tone } = await req.json();

        if (!text || !tone) {
            return NextResponse.json(
                { error: "Both 'text' and 'tone' fields are required." },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: MODELS.ANALYTICAL });

        const prompt = `
      You are a corporate communication expert. Translate the following raw, possibly informal or rude text into a "${tone}" corporate professional tone.
      
      Input Text: "${text}"
      Target Tone: ${tone}

      Rules:
      - Keep it concise.
      - Do not change the underlying meaning, just the improved delivery.
      - Return ONLY the rewritten text, no explanations.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const rewritten = response.text();

        return NextResponse.json({ result: rewritten });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json({ error: "Failed to translate text" }, { status: 500 });
    }
}
