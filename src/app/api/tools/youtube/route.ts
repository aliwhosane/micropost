import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { YouTubeTranscriptApi } from "yt-transcript-api";

export async function POST(req: Request) {
    try {
        const { url, transcript } = await req.json();

        if (!url && !transcript) {
            return NextResponse.json({ error: "Please provide either a YouTube URL or a transcript" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        let transcriptText = "";

        // 1a. Handle Raw Transcript
        if (transcript) {
            transcriptText = transcript;
        }
        // 1b. Handle YouTube URL
        else if (url) {
            const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) {
                return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
            }

            try {
                const transcriptData = await YouTubeTranscriptApi.fetch(videoId);

                if (!transcriptData || transcriptData.length === 0) {
                    console.error("Transcript fetch returned empty array");
                    return NextResponse.json({ error: "Could not retrieve transcript. The video might not have captions enabled." }, { status: 400 });
                }

                transcriptText = transcriptData.map((item: any) => item.text).join(" ");
            } catch (err) {
                console.error("Transcript fetch failed:", err);
                return NextResponse.json({ error: "Could not fetch video transcript. Please try a video with clear captions." }, { status: 400 });
            }
        }

        // Truncate excessively long transcripts to avoid token limits (rudimentary check)
        if (transcriptText.length > 20000) {
            transcriptText = transcriptText.substring(0, 20000) + "...[truncated]";
        }

        // 3. Generate Thread with Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const prompt = `
      You are a viral social media ghostwriter.
      Turn the following YouTube video transcript into a highly engaging Twitter/X thread (between 5-10 tweets).
      
      The first tweet must be a killer hook.
      The last tweet should be a summary/CTA.
      Each tweet should be under 280 characters.
      
      Transcript:
      "${transcriptText}"

      Return the response in strict JSON format with this structure:
      {
        "thread": [
          "Tweet 1...",
          "Tweet 2...",
          "Tweet 3..."
        ]
      }
      
      Do not include markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean up potential markdown formatting
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanedText));
    } catch (error) {
        console.error("YouTube summarization error:", error);
        return NextResponse.json({ error: "Failed to generate thread" }, { status: 500 });
    }
}
