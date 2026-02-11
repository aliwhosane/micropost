import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import React from "react";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Load fonts (we'll need a font buffer for Satori)
import fs from "fs/promises";
import path from "path";

// Load fonts (we'll need a font buffer for Satori)
async function loadFont() {
    // Load from local filesystem
    const fontPath = path.join(process.cwd(), "public", "fonts", "Inter-Regular.woff");
    return await fs.readFile(fontPath);
}

/**
 * Option A & B: Social Snap / Pull Quote (Satori)
 */
export async function generateSocialCard(text: string, type: "SNAP" | "QUOTE" | "NOTE", authorHandle: string = "@micropost_user", platform: "TWITTER" | "LINKEDIN" | "THREADS" = "TWITTER", avatarUrl?: string | null): Promise<Buffer> {
    const fontData = await loadFont();

    const isQuote = type === "QUOTE";
    const isNote = type === "NOTE";

    // Dimensions
    const width = platform === "TWITTER" ? 1200 : 1080;
    const height = platform === "TWITTER" ? 675 : 1080;

    // Background Styles
    let bgStyle;
    if (isQuote) {
        bgStyle = "linear-gradient(135deg, #020617 0%, #1e293b 100%)"; // Premium Dark Slate
    } else if (isNote) {
        bgStyle = "#18181b"; // Zinc-950 (Dark Note)
    } else {
        bgStyle = "white"; // Clean white for Snap
    }

    // Styles & Typography
    let textStyle: React.CSSProperties = { color: "black", fontSize: "24px", textAlign: "left" };

    if (isQuote) {
        textStyle = { color: "white", fontSize: "64px", fontWeight: 800, textAlign: "center", lineHeight: "1.2", letterSpacing: "-0.02em" };
    } else if (isNote) {
        textStyle = { color: "#e4e4e7", fontSize: "42px", fontWeight: 500, textAlign: "left", lineHeight: "1.4", fontFamily: "Inter" }; // Zinc-200
    }

    // Safety: Strip emojis for Quote/Note to ensure font stability (Snap keeps them if possible, but satori emoji support varies)
    const renderText = (isQuote || isNote) ? text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') : text;

    const element = (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                justifyContent: isQuote ? "center" : "flex-start",
                alignItems: isQuote ? "center" : "flex-start", // Note aligns top-left but centered container
                padding: isQuote ? "80px" : "60px",
                background: bgStyle,
                fontFamily: "Inter"
            }}
        >
            {/* Note Header */}
            {isNote && (
                <div style={{ display: "flex", marginBottom: "40px", width: "100%", borderBottom: "1px solid #3f3f46", paddingBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#eab308" }} />
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
                    </div>
                </div>
            )}

            {/* Author Header (for Snap) or Footer (for Quote) */}
            {!isNote && (
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
                    {/* Avatar */}
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={avatarUrl}
                            width="48"
                            height="48"
                            style={{ borderRadius: "50%", objectFit: "cover", marginRight: "12px" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: isQuote ? "rgba(255,255,255,0.2)" : "#ccc",
                                marginRight: "10px"
                            }}
                        />
                    )}

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
            )}

            {/* Main Content */}
            <div style={{ ...textStyle, width: isNote ? "85%" : "100%" }}>
                {isQuote ? `"${renderText}"` : renderText}
            </div>

            {isNote && (
                <div style={{ marginTop: "auto", fontSize: "16px", color: "#52525b" }}>
                    micropost.ai
                </div>
            )}
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
export async function generateAiImage(concept: string, platform: "TWITTER" | "LINKEDIN" | "THREADS" | "TIKTOK" = "TWITTER"): Promise<string> {
    // 1. Enhance Prompt using lighter text model (still using old SDK for now as it's initialized globally, or switch?)
    // Let's stick to the existing `genAI` for text to minimize churn, or just use the new one for everything.
    // Minimizing churn: use defaults.
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    // Handle aspect ratios
    let aspectRatio = "16:9";
    if (platform === "THREADS") aspectRatio = "1:1";
    if (platform === "TIKTOK") aspectRatio = "9:16";

    const enhancementPrompt = `
    Act as a professional AI Art Director.
    Convert this simple concept into a detailed image generation prompt for Imagen 3/Gemini Image Gen.
    Concept: "${concept}"
    
    Requirements:
    - COMPOSITION MUST BE VERTICAL (Aspect Ratio: 9:16).
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
            },
            config: {
                // @ts-ignore - Nano Banana API specific config
                image_config: {
                    aspect_ratio: aspectRatio
                }
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

/**
 * Option D: Vertical Video Slide (Satori)
 * 1080x1920 layout for TikTok/Reels
 */
export async function generateVerticalStats(text: string, type: 'HOOK' | 'BODY' | 'CTA', bgImage?: string): Promise<Buffer> {
    console.log("generateVerticalStats called with text length:", text?.length, "type:", type, "hasBgImage:", !!bgImage);
    const fontData = await loadFont();
    console.log("Font data loaded:", fontData ? fontData.length : "null");

    // Design Tokens
    const width = 1080;
    const height = 1920;

    // Colors & Styles
    let bgStyle = "linear-gradient(180deg, #18181b 0%, #09090b 100%)"; // Zinc-950 to Black
    let textColor = "#f4f4f5"; // Zinc-100
    let fontSize = "80px";
    let fontWeight: any = 700;
    let textAlign: any = "center"; // Use 'any' to bypass strict CSSProperties type issues in Satori if needed, or cast properly
    let highlightColor = "#eab308"; // Yellow-500

    if (type === 'HOOK') {
        bgStyle = "linear-gradient(180deg, #0f172a 0%, #020617 100%)"; // Slate-900
        textColor = "#ffffff";
        fontSize = "110px"; // Massive for Hook
        fontWeight = 900;
        highlightColor = "#f43f5e"; // Rose-500
    } else if (type === 'CTA') {
        bgStyle = "linear-gradient(180deg, #4c1d95 0%, #2e1065 100%)"; // Violet-900
        fontSize = "90px";
    }

    // Split text for formatting if needed, or just render block
    // Satori handles wrapping automatically for normal text.
    // Safety: Strip emojis to ensure font stability
    const stringText = text || " ";
    const renderText = stringText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    console.log("Render text prepared:", renderText.substring(0, 50));

    const element = (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "80px",
                background: bgImage ? `url(${bgImage})` : bgStyle,
                fontFamily: "Inter",
                ...(bgImage ? {
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                } : {}),
            }
            }
        >
            {/* Safe Area Top */}
            <div style={{ position: 'absolute', top: 0, height: '200px', width: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px'
                }}
            >
                {type === 'HOOK' && (
                    <div style={{ color: highlightColor, fontSize: "40px", textTransform: "uppercase", letterSpacing: "8px", fontWeight: 600 }}>
                        Watch This
                    </div>
                )}

                <div style={{
                    color: textColor,
                    fontSize,
                    fontWeight,
                    textAlign: "center",
                    lineHeight: "1.1",
                    textShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}>
                    {renderText}
                </div>
            </div>

            {/* Safe Area Bottom */}
            <div style={{ position: 'absolute', bottom: 0, height: '300px', width: '100%', background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '32px' }}>
                    www.micropost-ai.vercel.app
                </div>
            </div >
        </div>
    );

    console.log("Calling satori...");
    const svg = await satori(
        element,
        {
            width,
            height,
            fonts: [
                {
                    name: "Inter",
                    data: fontData,
                    weight: fontWeight as any, // Cast specific weights if needed
                    style: "normal",
                },
            ],
        }
    );
    console.log("Satori generated SVG length:", svg.length);

    console.log("Calling resvg...");
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: width },
    });
    const pngData = resvg.render();
    console.log("Resvg render complete");
    return pngData.asPng();
}
