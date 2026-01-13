import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { niche } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const prompt = `
      You are a social media strategy expert. 
      Generate 5 distinct content pillars for the "${niche}" niche.
      For each pillar, provide 3 specific, actionable sub-topics or post ideas.

      Return the response in strict JSON format with this structure:
      {
        "pillars": [
          {
            "title": "Pillar Title",
            "description": "Brief explanation of why this pillar matters",
            "topics": ["Topic 1", "Topic 2", "Topic 3"]
          }
        ]
      }
      
      Do not include markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean up potential markdown formatting if the model adds it despite instructions
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanedText));
    } catch (error) {
        console.error("Content Pillar generation error:", error);
        return NextResponse.json({ error: "Failed to generate content pillars" }, { status: 500 });
    }
}
