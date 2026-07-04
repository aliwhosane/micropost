import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({
            model: MODELS.CREATIVE,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            hook: { type: SchemaType.STRING, description: "The text of the hook" },
                            category: { type: SchemaType.STRING, description: "The style/category of the hook" },
                        },
                        required: ["hook", "category"],
                    },
                },
            },
        });

        const prompt = `
        You are a viral social media expert.
        Generate 10 viral hooks (opening lines) for a post about: "${topic}".
        
        The hooks should use different psychological triggers:
        1. Contrarian (e.g., "Stop doing X")
        2. Negative/Warning (e.g., "The mistake costing you...")
        3. Storytelling (e.g., "I lost everything when...")
        4. Statistical/Numbers (e.g., "99% of people fail at...")
        5. How-to/Benefit (e.g., "How to allow X without Y")
        
        Return 10 hooks, each with "hook" and "category" fields.
        `;

        const result = await model.generateContent(prompt);
        const hooks = JSON.parse(result.response.text());

        return NextResponse.json({ hooks });
    } catch (error) {
        console.error("Viral hook generation error:", error);
        return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
    }
}
