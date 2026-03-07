
import * as dotenv from "dotenv";
dotenv.config();

import { generateBridgeAngle, critiquePost, refinePost } from "./src/lib/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function runTest() {
    console.log("🚀 STARTING MULTI-AGENT CONTENT GENERATION TEST\n");

    const TEST_INPUTS = {
        topic: "Remote Work",
        niche: "Bootstrap SaaS Founder",
        style: "Cynical, witty, short punchy sentences. No emojis.",
        platform: "LINKEDIN",
        news: {
            title: "Zoom orders employees back to the office",
            summary: "Zoom, the poster child of remote work, is asking employees to return to the office 2 days a week, sparking debate about the future of remote work.",
            url: "https://example.com/zoom"
        }
    };

    console.log("📋 INPUTS:");
    console.log(JSON.stringify(TEST_INPUTS, null, 2));
    console.log("\n--------------------------------------------------\n");

    // --- STEP 1: BRIDGE AGENT ---
    console.log("Construction: 🌉 BRIDGE AGENT (Connecting News to Niche)...");
    const angle = await generateBridgeAngle(TEST_INPUTS.topic, TEST_INPUTS.niche, TEST_INPUTS.news);
    console.log(`\n✅ ANGLE GENERATED:\n"${angle}"`);
    console.log("\n--------------------------------------------------\n");

    // --- STEP 2: DRAFTER AGENT ---
    console.log("Construction: ✍️ DRAFTER AGENT (Writing Draft)...");

    // Reproducing the prompt logic from ai.ts for the test
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = `
    You are an expert social media ghostwriter.
    Platform: ${TEST_INPUTS.platform}
    
    Start with this Core Angle/Thesis: "${angle}"
    
    TOPIC: Trending News Story (${TEST_INPUTS.news.title})
    User's Stance/Perspective: ${TEST_INPUTS.niche}
    Writing Style to Mimic: ${TEST_INPUTS.style}

    CRITICAL CONTEXT - NEWSJACKING MODE:
    News Title: "${TEST_INPUTS.news.title}"
    Summary: "${TEST_INPUTS.news.summary}"
    
    Constraints:
    - Write a high-performing LinkedIn post.
    - Write in a natural, human tone.
    - Include a SPECIFIC real-life example or anecdote.
    - Provide a concrete, valuable insight.
    - Use clean formatting.
    - Start with a strong, engaging hook.
    - Do NOT include "Here is a post" or quotes.
    
    Generate the post content.
    `;

    const draftResult = await model.generateContent(prompt);
    let draft = draftResult.response.text().trim();
    console.log(`\n✅ DRAFT GENERATED:\n\n${draft}`);
    console.log("\n--------------------------------------------------\n");

    // --- STEP 3: CRITIC AGENT ---
    console.log("Construction: 🧐 CRITIC AGENT (Reviewing Draft)...");
    const critique = await critiquePost(draft, TEST_INPUTS.platform, TEST_INPUTS.topic);
    console.log(`\n📊 CRITIQUE RESULT:`);
    console.log(`Score: ${critique.score}/100`);
    console.log(`Feedback: "${critique.feedback}"`);
    console.log("\n--------------------------------------------------\n");

    // --- STEP 4: REFINER AGENT ---
    if (critique.score < 100) { // Force refinement for the test, or use < 80 threshold
        console.log("Construction: ✨ REFINER AGENT (Polishing based on feedback)...");
        const refined = await refinePost(draft, critique.feedback, TEST_INPUTS.platform);
        console.log(`\n✅ FINAL POLISHED POST:\n\n${refined}`);
    } else {
        console.log("✨ Draft scored 100! No refinement needed.");
    }
}

runTest();
