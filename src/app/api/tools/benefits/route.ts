import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

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
        const model = genAI.getGenerativeModel({
            model: MODELS.ANALYTICAL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        conversions: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    feature: { type: SchemaType.STRING, description: "The original feature" },
                                    benefit: { type: SchemaType.STRING, description: "The emotional, outcome-driven benefit" },
                                    emotion: { type: SchemaType.STRING, description: "The core emotion targeted (e.g. Relief, Security)" }
                                },
                                required: ["feature", "benefit", "emotion"]
                            }
                        }
                    },
                    required: ["conversions"]
                }
            }
        });

        const prompt = `
            You are a world-class copywriter who follows the "Sell the Hole, Not the Drill" philosophy.
            
            Task: Convert the following list of technical features into emotional, outcome-driven benefits.
            
            Features:
            "${features}"

            For each feature, provide:
            - feature: The original feature text
            - benefit: An emotional, outcome-driven benefit statement
            - emotion: The core emotion targeted (e.g. Relief, Security, Confidence)
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("Benefit generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate benefits" },
            { status: 500 }
        );
    }
}
