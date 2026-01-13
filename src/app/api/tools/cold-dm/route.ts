import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

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
            
            Return the response in strict JSON format with this structure:
            {
                "dms": [
                    {
                        "label": "Option 1 (Hook focus)",
                        "content": "Subject (if email) or first line...\n\nBody..."
                    },
                     {
                        "label": "Option 2 (Value focus)",
                        "content": "..."
                    },
                     {
                        "label": "Option 3 (Question focus)",
                        "content": "..."
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
        console.error("Cold DM generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate DMs" },
            { status: 500 }
        );
    }
}
