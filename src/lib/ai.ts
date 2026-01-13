import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GeneratePostParams {
    topics: string[];
    styleSample?: string;
    platform: "LINKEDIN" | "TWITTER";
}

export async function generateSocialPost({ topics, styleSample, platform }: GeneratePostParams): Promise<{ content: string; topic: string }> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const topic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `
    You are an expert social media ghostwriter.
    Platform: ${platform}
    Topic: ${topic}
    ${styleSample ? `Writing Style to Mimic: ${styleSample}` : "Style: Professional, engaging, and concise."}
    
    Constraints:
    - For Twitter: 
        - Max 280 characters.
        - Write like a real person, not a bot. Avoid "marketing speak" or robotic sentence structures.
        - Be direct, punchy, and conversational.
        - Use 1-2 relevant hashtags.
    - For LinkedIn:
        - Write in a natural, human tone. Avoid corporate jargon, buzzwords, or robotic phrasing.
        - Include a SPECIFIC real-life example, story, or anecdote related to the topic to illustrate the point.
        - You may use a publicly available famous historical story in a metaphorical, allegorical, or as an example past event if it helps the context, but DO NOT invent random personal stories.
        - Provide a concrete, valuable insight or actionable takeaway that the reader can use immediately.
        - Use clean formatting (bullet points, short paragraphs) to make it highly readable.
        - DO NOT use Markdown formatting like **bold** or *italics* as they do not render on LinkedIn. Use plain text or CAPITALIZATION for emphasis if needed.
        - 1-3 relevant hashtags.
        - Start with a strong, engaging hook.
    - Do NOT include "Here is a post" or quotes. Just output the content.
    - CRITICAL: MIMIC the provided writing style closely. If the sample is casual/witty, be casual/witty. If it's formal/academic, be formal/academic.
    
    Generate ${platform === "LINKEDIN" ? "a high-performing LinkedIn post" : "a Tweet"} about ${topic}.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { content: response.text().trim(), topic };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { content: "Error generating content. Please try again later.", topic };
    }
}

export async function checkStyleMatch(sample: string, generated: string) {
    // Placeholder for style matching analysis if needed
    return true;
}

export async function generateStyleDescription(texts: string[]): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Analyze the following social media posts and create a concise description of the writing style.
    Focus on tone, vocabulary, sentence structure, formatting (emojis, line breaks), and common patterns.
    The goal is to use this description to instruct an AI to write exactly like this person.
    
    Posts:
    ${texts.map(t => `- ${t}`).join("\n")}
    
    Output ONLY the style description.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Style Analysis Error:", error);
        throw new Error("Failed to analyze style.");
    }
}


export async function regeneratePostContent(currentContent: string, selectedText: string, instruction: string, platform: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert social media editor.
    Platform: ${platform}
    
    Current Post:
    "${currentContent}"
    
    The user wants to edit a specific part of this post.
    Selected Text to Change: "${selectedText}"
    
    User Instruction/Feedback: "${instruction}"
    
    Task:
    - Rewrite the post to incorporate the user's feedback.
    - If the user instruction is specific to the selected text, focus changes there but ensure it flows seamlessly with the rest of the post.
    - If the user instruction is general (e.g., "Make it funnier"), apply it to the whole post or the selected context as appropriate.
    - Maintain the appropriate length and formatting for ${platform}.
    - Do NOT include any explanations or "Here is the rewritten post". Just output the new post content.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Regeneration Error:", error);
        throw new Error("Failed to regenerate content.");
    }
}
