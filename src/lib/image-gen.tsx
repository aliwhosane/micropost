import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import React from "react";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Load fonts (we'll need a font buffer for Satori)
async function loadFont() {
    // Fetch Inter font
    const response = await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff");
    return await response.arrayBuffer();
}

/**
 * Option A & B: Social Snap / Pull Quote (Satori)
 */
export async function generateSocialCard(text: string, type: "SNAP" | "QUOTE", authorHandle: string = "@micropost_user", platform: "TWITTER" | "LINKEDIN" | "THREADS" = "TWITTER"): Promise<Buffer> {
    const fontData = await loadFont();

    const isQuote = type === "QUOTE";

    // Dimensions
    const width = platform === "TWITTER" ? 1200 : 1080;
    const height = platform === "TWITTER" ? 675 : 1080;

    // Simple styles for the clear "Snap" vs gradient "Quote"
    const bgStyle = isQuote
        ? "linear-gradient(135deg, #020617 0%, #1e293b 100%)" // Premium Dark Slate Gradient
        : "white"; // Clean white for Snap

    const textStyle: React.CSSProperties = isQuote
        ? { color: "white", fontSize: "64px", fontWeight: 800, textAlign: "center", lineHeight: "1.2", letterSpacing: "-0.02em" }
        : { color: "black", fontSize: "24px", textAlign: "left" };

    // Safety: Strip emojis just in case (though action does it too)
    const renderText = isQuote ? text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') : text;

    const element = (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                justifyContent: isQuote ? "center" : "flex-start",
                alignItems: isQuote ? "center" : "flex-start",
                padding: isQuote ? "80px" : "40px",
                background: bgStyle,
                fontFamily: "Inter"
            }}
        >
            {/* Author Header (for Snap) or Footer (for Quote) */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: isQuote ? "0" : "20px",
                    marginTop: isQuote ? "40px" : "0",
                    justifyContent: isQuote ? "center" : "flex-start",
                    opacity: 0.8,
                    order: isQuote ? 2 : 0
                }}
            >
                {/* Placeholder avatar */}
                <div
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: isQuote ? "rgba(255,255,255,0.2)" : "#ccc",
                        marginRight: "10px"
                    }}
                />
                <span
                    style={{
                        color: isQuote ? "rgba(255,255,255,0.7)" : "#666",
                        fontSize: "16px",
                        fontWeight: 500
                    }}
                >
                    {authorHandle}
                </span>
            </div>

            {/* Main Content */}
            <div style={textStyle}>
                {isQuote ? `"${renderText}"` : renderText}
            </div>
        </div>
    );

    const svg = await satori(
        element,
        {
            width,
            height,
            fonts: [
                {
                    name: "Inter",
                    data: fontData,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    );

    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: width },
    });
    const pngData = resvg.render();
    return pngData.asPng(); // Fixed method
}

/**
 * Option C: Visual Hook (AI Image)
 */
export async function generateAiImage(concept: string, platform: "TWITTER" | "LINKEDIN" | "THREADS" = "TWITTER"): Promise<string> {
    // 1. Enhance Prompt using lighter text model (still using old SDK for now as it's initialized globally, or switch?)
    // Let's stick to the existing `genAI` for text to minimize churn, or just use the new one for everything.
    // Minimizing churn: use defaults.
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const aspectRatio = platform === "TWITTER" ? "16:9" : "1:1";

    const enhancementPrompt = `
    Act as a professional AI Art Director.
    Convert this simple concept into a detailed image generation prompt for Imagen 3/Gemini Image Gen.
    Concept: "${concept}"
    
    Requirements:
    - Aspect Ratio: ${aspectRatio}
    - Cinematic lighting
    - High resolution, 2k
    - Describe composition, camera angle, and textures.
    - OUTPUT ONLY THE PROMPT. No "Here is the prompt" prefix.
    `;

    let finalPrompt = concept;
    try {
        const result = await textModel.generateContent(enhancementPrompt);
        finalPrompt = result.response.text();
    } catch (e) {
        console.warn("Prompt enhancement failed, using raw concept.");
    }

    // 2. Generate Image using NEW SDK
    try {
        console.log("Using @google/genai SDK with model:", "gemini-2.5-flash-image");

        // Initialize new client
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [
                    { text: finalPrompt }
                ]
            }
        });

        console.log("Image Gen Full Response (New SDK):", JSON.stringify(response, null, 2));

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    // MimeType might be missing in type defs but usually 'image/png' or 'image/jpeg'
                    // The user's example assumes base64.
                    // Let's assume generic image/png or check if mimeType exists.
                    // User example: fails to log mimeType, just writes.
                    // We need a data URI.
                    const mimeType = part.inlineData.mimeType || "image/png";
                    return `data:${mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        throw new Error("No image data found in response");

    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
}
