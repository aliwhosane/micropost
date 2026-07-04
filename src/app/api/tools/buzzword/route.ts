import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

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
        const model = genAI.getGenerativeModel({
            model: MODELS.ANALYTICAL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        score: {
                            type: SchemaType.NUMBER,
                            description: "0-100 Human Score. 100 is perfectly human, 0 is a robot."
                        },
                        matches: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    word: { type: SchemaType.STRING, description: "The specific word or phrase found in the text" },
                                    alternative: { type: SchemaType.STRING, description: "A punchier, human alternative" },
                                    reason: { type: SchemaType.STRING, description: "Why it is bad" }
                                },
                                required: ["word", "alternative", "reason"]
                            }
                        }
                    },
                    required: ["score", "matches"]
                }
            }
        });

        const prompt = `
            You are a ruthless editor who hates corporate jargon, buzzwords, and vague business speak.
            
            Task: Analyze the following text and identify every instance of "corporate fluff".
            
            Text to analyze:
            "${text}"
            
            For each match, provide the specific word or phrase, a punchier human alternative, and a reason why it is bad.
            Give a "score" from 0-100 representing how human the text sounds (100 = perfectly human, 0 = a robot).
            If the text is clean, return a high score and empty matches array.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("Buzzword analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze text" },
            { status: 500 }
        );
    }
}
