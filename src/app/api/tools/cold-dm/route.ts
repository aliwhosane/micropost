import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { recipientRole, goal, context, style } = await req.json();

        if (!recipientRole || !goal || !context) {
            return NextResponse.json(
                { error: "Please provide a recipient role, goal, and context." },
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
            model: MODELS.CREATIVE,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        dms: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    label: { type: SchemaType.STRING, description: "Option label (e.g. Hook focus, Value focus, Question focus)" },
                                    content: { type: SchemaType.STRING, description: "The DM script content" }
                                },
                                required: ["label", "content"]
                            }
                        }
                    },
                    required: ["dms"]
                }
            }
        });

        const prompt = `
            You are an expert sales copywriter specializing in cold outreach.
            
            Task: Write 3 distinct cold DM scripts for a ${recipientRole}.
            
            Goal of the DM: ${goal}
            My Context/Offer: ${context}
            Desired Style: ${style || "Direct"}
            
            Guidelines:
            - Keep it short (under 100 words).
            - No "I hope this finds you well" fluff.
            - Focus on the recipient's pain points or value.
            - Sound human, not robotic.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("Cold DM generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate DMs" },
            { status: 500 }
        );
    }
}
