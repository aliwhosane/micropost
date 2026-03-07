import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization helper
const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GeneratePostParams {
    topics: string[];
    styleSample?: string;
    platform: "LINKEDIN" | "TWITTER" | "THREADS";
    topicAttributes?: {
        name: string;
        notes?: string;
        stance?: string;
    }[];
    temporaryThoughts?: string;
    newsContext?: {
        title: string;
        summary: string;
        url: string;
    };
    framework?: string;
    hallOfFamePosts?: string[];
}




// --- PHASE 1: THE "DIGITAL TWIN" AGENTS ---

// 1. THE BRIDGE AGENT (Connects News/Topic to User Niche)
// 1. THE BRIDGE AGENT (Connects News/Topic to User Niche)
export async function generateBridgeAngle(topic: string, niche: string, newsContext?: any): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    You are a Strategic Social Media Editor.
    GOAL: Find a unique, high-performing "Angle" for a post.
    
    User Niche/Focus: "${niche || "General Professional"}"
    Topic: "${topic}"
    ${newsContext ? `News Context:\n- Title: ${newsContext.title}\n- Summary: ${newsContext.summary}` : ""}

    Task:
    1. Analyze the connection between the User's Niche and the Topic/News.
    2. Score the "Relevance/Connection Strength" from 0-100.
       - 100: Perfect fit (e.g. Tech news for a Tech founder).
       - 0: No connection (e.g. Knitting patterns for a Fintech CEO).
    3. If Score < 70 and News is present: IGNORE the news. Generate a generic, evergreen angle for the Topic instead.
    4. If Score >= 70: Generate a specific angle connecting the News to the Niche.
    
    Output JSON ONLY:
    {
        "score": number,
        "angle": "The generated angle string",
        "reasoning": "Why this score?"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text);

        if (!data.angle) throw new Error("No angle returned from Bridge");

        console.log(`[Bridge] Score: ${data.score} - Reason: ${data.reasoning}`);

        if (newsContext && data.score < 70) {
            console.log(`[Bridge] Connection too weak (${data.score}). Falling back to generic angle.`);
            // fallback handled by the prompt logic itself (step 3), but we accept the output 'angle'
            // which should be the generic one as requested.
            return data.angle;
        }

        return data.angle;
    } catch (e) {
        console.error("Bridge Agent Failed:", e);
        return newsContext ? `Thoughts on ${newsContext.title}` : `Insights on ${topic}`; // Fallback
    }
}

// 2. THE CRITIC AGENT (Quality Control)
export async function critiquePost(draft: string, platform: string, topic: string): Promise<{ score: number, feedback: string }> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    You are a Brutal Social Media Critic.
    Platform: ${platform}
    Topic: ${topic}
    
    Draft Post:
    "${draft}"
    
    Task:
    - Grade this post from 0-100 based on "Viral Potential" and "Quality".
    - Critically analyze:
      1. The Hook: Is it boring? (e.g. "I'm excited to announce") -> Needs to be punchy.
      2. The Fluff: Are there wasted words? (e.g. "In today's fast paced world") -> Delete.
      3. The Clichés: Does it use words like "Unlock", "Unleash", "Game-changer"? -> -10 points.
      4. Formatting: Is it a wall of text?
      
    Output JSON ONLY:
    {
        "score": number,
        "feedback": "Specific instructions on how to fix it. Be direct."
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        console.error("Critic Agent Failed:", e);
        return { score: 100, feedback: "" }; // Assume perfection if critic fails
    }
}

// 3. THE REFINER AGENT (Polishing)
export async function refinePost(draft: string, feedback: string, platform: string): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    You are an Expert Copyeditor.
    Platform: ${platform}
    
    Original Draft:
    "${draft}"
    
    Critic's Feedback:
    "${feedback}"
    
    Task:
    - Rewrite the draft to address the feedback.
    - Make it punchier, cleaner, and more human.
    - KEEP the core message/angle.
    - DO NOT use the forbidden words (Unlock, Unleash, etc).
    
    Output:
    The final rewritten post content ONLY.
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (e) {
        console.error("Refiner Agent Failed:", e);
        return draft; // Fallback to original
    }
}


export async function generateSocialPost({ topics, styleSample, platform, topicAttributes, temporaryThoughts, newsContext, framework, hallOfFamePosts, enableCritic }: GeneratePostParams & { enableCritic?: boolean }): Promise<{ content: string; topic: string }> {

    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Select a random topic from the string name array OR use the news context topic if available
    let topicName = topics.length > 0 ? topics[Math.floor(Math.random() * topics.length)] : "General";

    const attributes = topicAttributes?.find(t => t.name === topicName);

    // --- STEP 1: THE BRIDGE (Identify Angle) ---
    // If we have attributes (niche/stance), use them. If not, default to standard.
    // We derive "Niche" from the user's stance or notes if available, or just use the topic itself.
    let niche = attributes?.stance || "General Professional";
    if (styleSample && styleSample.length > 50) niche += ` (Style: ${styleSample.substring(0, 50)}...)`;

    // If manual thoughts are provided, skipping Bridge (user knows what they want).
    // If News is present, WE MUST RUN BRIDGE to connect it.
    let angle = temporaryThoughts || "";
    if (!temporaryThoughts) {
        console.log(`[AI] running Bridge for ${topicName}...`);
        angle = await generateBridgeAngle(topicName, niche, newsContext);
        console.log(`[AI] Bridge Angle: "${angle}"`);
    }

    // ---CHAOS CONSTRAINTS (Prevent Template Drift)---
    const CHAOS_CONSTRAINTS = [
        "Constraint: Do not use any emojis.",
        "Constraint: Start the post with a single word followed by a period.",
        "Constraint: Use a metaphor to explain the main point.",
        "Constraint: Do not ask any questions in the post.",
        "Constraint: Structure the body as a bulleted list.",
        "Constraint: Keep the tone strictly objective and factual (no 'I think')."
    ];
    // 30% chance to apply a chaos constraint to keep things fresh
    const applyChaos = Math.random() < 0.3;
    const chaosInstruction = applyChaos ? CHAOS_CONSTRAINTS[Math.floor(Math.random() * CHAOS_CONSTRAINTS.length)] : "";
    if (applyChaos) console.log(`[AI] Applying Chaos: "${chaosInstruction}"`);

    const VIRAL_FRAMEWORKS: Record<string, string> = {
        PAS: `
        FRAMEWORK: PAS (Problem-Agitate-Solution)
        - Problem: Identify a specific, painful problem the audience faces.
        - Agitate: Rub salt in the wound. Explain why this problem is annoying, costly, or dangerous.
        - Solution: Present your insight/takeaway as the clear solution.
        Structure the post clearly in these three beats.`,
        AIDA: `
        FRAMEWORK: AIDA (Attention-Interest-Desire-Action)
        - Attention: Start with a scroll-stopping hook or shocking statement.
        - Interest: elaborate with interesting facts or a contrarian viewpoint.
        - Desire: Show the benefits of a better way (your way).
        - Action: End with a clear takeaway or question to drive engagement.
        `,
        BAB: `
        FRAMEWORK: BAB (Before-After-Bridge)
        - Before: Describe the current "bad" state or struggle.
        - After: Describe the desired "dream" state/outcome.
        - Bridge: Explain how to get from Before to After (your insight).
        `,
        STORYTELLING: `
        FRAMEWORK: Micro-Storytelling
        - Hook: Start in the middle of the action.
        - Conflict: Briefly describe the struggle or challenge.
        - Resolution: How it was solved.
        - Lesson: The universal takeaway for the reader.
        `,
        CONTRARIAN: `
        FRAMEWORK: Contrarian/New Truth
        - Common Belief: State what everyone thinks is true.
        - The Pivot: "But actually..." or "Unpopular opinion:".
        - New Truth: Explain why the common belief is wrong and what is actually true.
        - Proof/Reasoning: Briefly explain why.
        `
    };

    const frameworkInstruction = framework ? VIRAL_FRAMEWORKS[framework] : "";

    // --- STEP 2: THE DRAFTER ---

    const prompt = `
    You are an expert social media ghostwriter.
    Platform: ${platform}
    
    Start with this Core Angle/Thesis: "${angle}"
    
    ${newsContext ? `TOPIC: Trending News Story (${newsContext.title})` : `Topic: ${topicName}`}
    ${attributes?.stance ? `User's Stance/Perspective: ${attributes.stance}` : ""}
    ${attributes?.notes ? `User's Standing Notes: ${attributes.notes}` : ""}
    ${styleSample ? `Writing Style to Mimic: ${styleSample}` : "Style: Professional, engaging, and concise."}
    ${frameworkInstruction ? `\n    STRICT FORMATTING INSTRUCTION: Use the following copywriting framework:\n${frameworkInstruction}\n` : ""}

    ${hallOfFamePosts && hallOfFamePosts.length > 0 ? `
    CRITICAL - HALL OF FAME EXAMPLES (FEW-SHOT LEARNING):
    These are the user's BEST posts. Mimic their sentence length, formatting, spacing, and tone EXACTLY.
    ${hallOfFamePosts.map((p, i) => `Example ${i + 1}:\n"${p}"`).join("\n\n")}
    ` : ""}

    ${newsContext ? `
    CRITICAL CONTEXT - NEWSJACKING MODE:
    News Title: "${newsContext.title}"
    Summary: "${newsContext.summary}"
    ` : ""}
    
    Constraints:
    - For Twitter: 
        - Max 260 characters (including hashtags).
        - Write like a real person, not a bot. Avoid "marketing speak" or robotic sentence structures.
        - Be direct, punchy, and conversational.
        - Identify and use the top 2-4 most popular and relevant hashtags for this topic. Avoid generic tags; prefer high-traffic niche tags.
    - For LinkedIn:
        - Write in a natural, human tone. Avoid corporate jargon, buzzwords, or robotic phrasing.
        - Include a SPECIFIC real-life example, story, or anecdote related to the topic to illustrate the point.
        - You may use a publicly available famous historical story in a metaphorical, allegorical, or as an example past event if it helps the context, but DO NOT invent random personal stories.
        - Provide a concrete, valuable insight or actionable takeaway that the reader can use immediately.
        - Use clean formatting (bullet points, short paragraphs) to make it highly readable.
        - DO NOT use Markdown formatting like **bold** or *italics* as they do not render on LinkedIn. Use plain text or CAPITALIZATION for emphasis if needed.
        - Identify and use the top 2-4 most popular and relevant hashtags for this topic. Avoid generic tags; prefer high-traffic niche tags.
        - Start with a strong, engaging hook.
    - For Threads:
        - Write in a casual, conversational, and "in-the-moment" tone.
        - Focus on starting a discussion. Ask an open-ended question or share a relatable thought.
        - Keep it concise but not as short as a Tweet (up to 400 characters).
        - Avoid hashtags completely, or use maximum 1 if absolutely necessary for discovery.
        - Be visual in description if telling a story.
        - No "marketing speak". Just a human sharing a thought.
    - Do NOT include "Here is a post" or quotes. Just output the content.
    - CRITICAL: MIMIC the provided writing style closely. If the sample is casual/witty, be casual/witty. If it's formal/academic, be formal/academic.
    ${frameworkInstruction ? `- CRITICAL: Ensure the post clearly follows the requested framework structure.` : ""}
    ${chaosInstruction ? `- STRICT CONSTRAINT: ${chaosInstruction}` : ""}
    
    Generate ${platform === "LINKEDIN" ? "a high-performing LinkedIn post" : platform === "THREADS" ? "an engaging Threads post" : "a Tweet"} based on the Angle.
  `;

    try {
        const result = await model.generateContent(prompt);
        let content = result.response.text().trim();

        // --- STEP 3: THE CRITIC LOOP (Optional / Turbo Mode Check) ---
        // Defaults to FALSE in this implementation unless enableCritic is true, 
        // to save costs until we fully rollout.
        const shouldCritique = temporaryThoughts ? false : (enableCritic ?? false); // Strict check: only if enableCritic is explicitly true


        if (shouldCritique) {
            const critique = await critiquePost(content, platform, topicName);
            console.log(`[AI] Critic Score: ${critique.score}`);

            if (critique.score < 80) {
                console.log(`[AI] Refining post due to low score... Feedback: ${critique.feedback}`);
                content = await refinePost(content, critique.feedback, platform);
            }
        }

        return { content, topic: topicName };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { content: "Error generating content. Please try again later.", topic: topicName };
    }
}


export async function generatePostContent(
    topic: string,
    platform: "TWITTER" | "LINKEDIN" | "THREADS",
    contextInstructions?: string,
    styleTone?: string
): Promise<string> {
    const result = await generateSocialPost({
        topics: [topic],
        platform,
        temporaryThoughts: contextInstructions, // Use context as "temporary thoughts" to steer the AI
        styleSample: styleTone, // Use tone as style sample
    });
    return result.content;
}

export async function analyzeTrends(newsItems: any[]): Promise<any[]> {

    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Limit to batch of 10 to avoid token limits
    const batch = newsItems.slice(0, 10);

    const prompt = `
    Analyze these news items for "viral potential" on social media (LinkedIn/Twitter).
    
    News Items:
    ${batch.map((item, index) => `
    ${index + 1}. Title: ${item.title}
       Snippet: ${item.contentSnippet}
    `).join("\n")}

    For each item, output a JSON object with:
    - id: (the index number, e.g. 1)
    - viralScore: (number 0-100, based on controversy, relevance, or "breaking" nature)
    - summary: (1 sentence summary of WHY it matters)
    - hook: (A catchy "hook" sentence to start a post with)
    
    Output ONLY valid JSON array.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const analysis = JSON.parse(text);

        // Merge analysis with original items
        return batch.map(item => {
            // Find matching analysis by index (imperfect but simple for this scale)
            // We rely on the order being preserved or the ID we passed.
            // Actually, let's map by index since we passed indices 1-based.

            // Simple fallback if parsing fails or order shifts:
            // We can't easily match without robust ID.
            // Let's assume the AI returns array in same order.
            return item;
        }).map((item, idx) => {
            const analyzed = analysis.find((a: any) => a.id === idx + 1);
            return {
                ...item,
                viralScore: analyzed?.viralScore || 0,
                aiSummary: analyzed?.summary || item.contentSnippet,
                generatedHook: analyzed?.hook || item.title
            };
        });

    } catch (error) {
        console.error("AI Trend Analysis Error:", error);
        // Fallback: return items with default scores
        return batch.map(item => ({ ...item, viralScore: 0, aiSummary: item.contentSnippet }));
    }
}


export async function checkStyleMatch(sample: string, generated: string) {
    // Placeholder for style matching analysis if needed
    return true;
}

export async function generateStyleDescription(texts: string[]): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

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
    const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });

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

export interface VideoScript {
    title: string;
    scenes: {
        id: string; // generated client-side or by AI
        type: 'HOOK' | 'BODY' | 'CTA';
        text: string;
        visualCue: string;
    }[];
}

export async function generateVideoScript(topicOrText: string): Promise<VideoScript> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert TikTok/Reels scriptwriter.
    Convert the following topic or text into a high-retention short video script.
    
    Input: "${topicOrText}"

    Constraints:
    - Structure: 
        1. HOOK (Grab attention immediately)
        2. BODY (3-4 points/steps, concise)
        3. CTA (Call to action)
    - Total Scenes: Strict range of 3 to 6 scenes total.
    - Tone: Conversational, high energy, punchy.
    - Visual Cues: Describe what should be on screen simply (e.g., "Person acting surprised", "Text overlay: 'Secret Hack'").

    Output Format:
    Return ONLY valid JSON with this structure:
    {
        "title": "Video Title",
        "scenes": [
            { "id": "1", "type": "HOOK", "text": "...", "visualCue": "..." },
            ...
        ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Script Generation Error:", error);
        throw new Error("Failed to generate script.");
    }
}

export interface CarouselSlide {
    title: string;
    content: string;
    imageKeyword?: string; // For auto-selecting background images later
}

export async function generateCarouselContent(topic: string): Promise<CarouselSlide[]> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an expert LinkedIn Carousel creator.
    Create a high-performing, viral carousel script based on the following topic or url.

    Topic: "${topic}"

    Constraints:
    - Slide 1: TITLE SLIDE. Short, punchy hook (under 10 words).
    - Slide 2-N: CONTENT SLIDES. 3-5 actionable points. Be concise. One big idea per slide.
    - Last Slide: OUTRO. A call to action or summary.
    - Total Slides: 5 to 7.
    - Tone: Professional but engaging, like a thought leader.

    Output Format (JSON Array ONLY):
    [
        { "title": "Big Hook Title", "content": "Sub-hook or extremely short context.", "imageKeyword": "shock" },
        { "title": "Point 1", "content": "Explanation...", "imageKeyword": "business meeting" }
    ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean markdown code blocks if present
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Carousel Generation Error:", error);
        // Fallback script if AI fails
        return [
            { title: "Error Generating", content: "Please try again.", imageKeyword: "error" }
        ];
    }
}
