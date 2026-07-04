import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MODELS } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { tweet } = await req.json();

        if (!tweet) {
            return NextResponse.json(
                { error: "Please provide a tweet or short thought." },
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
                        variations: {
                            type: SchemaType.ARRAY,
                            description: "Three LinkedIn post variations in different formats",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    type: { type: SchemaType.STRING, description: "Format type: Story, Actionable Advice, or Analytical" },
                                    content: { type: SchemaType.STRING, description: "The full LinkedIn post content" },
                                },
                                required: ["type", "content"],
                            },
                        },
                    },
                    required: ["variations"],
                },
            },
        });

        const prompt = `
            You are a master LinkedIn content creator who knows how to go viral.
            
            Task: Expand the following short tweet into 3 distinct, high-engagement LinkedIn posts.
            
            Source Tweet/Idea:
            "${tweet}"
            
            Requirements:
            - Create 3 distinct formats (Story-driven, Advice/How-to, Analytical/Listicle).
            - Use short paragraphs and "broetry" formatting for readability.
            - Include strong hooks and clear takeaways.
            - Add a question at the end to drive engagement.
            - Identify and use the top 2-4 most popular and relevant hashtags for this topic. Avoid generic tags; prefer high-traffic niche tags.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        return NextResponse.json(JSON.parse(response.text()));

    } catch (error) {
        console.error("LinkedIn expansion error:", error);
        return NextResponse.json(
            { error: "Failed to generate posts" },
            { status: 500 }
        );
    }
}
