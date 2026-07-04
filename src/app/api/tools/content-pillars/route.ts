import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { niche } = await req.json();

        if (!niche) {
            return NextResponse.json(
                { error: "Please provide a niche." },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: MODELS.ANALYTICAL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        pillars: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    title: { type: SchemaType.STRING, description: "Pillar title" },
                                    description: { type: SchemaType.STRING, description: "Brief explanation of why this pillar matters" },
                                    topics: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING },
                                        description: "3 specific, actionable sub-topics or post ideas"
                                    }
                                },
                                required: ["title", "description", "topics"]
                            }
                        }
                    },
                    required: ["pillars"]
                }
            }
        });

        const prompt = `
      You are a social media strategy expert. 
      Generate 5 distinct content pillars for the "${niche}" niche.
      For each pillar, provide 3 specific, actionable sub-topics or post ideas.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));
    } catch (error) {
        console.error("Content Pillar generation error:", error);
        return NextResponse.json({ error: "Failed to generate content pillars" }, { status: 500 });
    }
}
