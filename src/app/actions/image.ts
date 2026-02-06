"use server";

import { auth } from "@/auth";
import { generateSocialCard, generateAiImage } from "@/lib/image-gen";
import { prisma } from "@/lib/db";

export async function generateVisionAction(type: "SNAP" | "QUOTE" | "HOOK" | "NOTE", postContent: string, platform: "TWITTER" | "LINKEDIN" | "THREADS" = "TWITTER") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Retrieve user for handle/branding info if needed
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, image: true } // Could get handle if we store it
    });

    // Construct a handle (fallback to name or "User")
    const handle = user?.name ? `@${user.name.replace(/\s+/g, '')}` : "@micropost_user";

    try {
        if (type === "SNAP" || type === "QUOTE" || type === "NOTE") {
            let contentToRender = postContent;

            if (type === "QUOTE") {
                // Extract a punchy quote using AI
                try {
                    const { GoogleGenerativeAI } = await import("@google/generative-ai");
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

                    const prompt = `
                     Extract the single most impactful sentence or phrase (5-10 words max) from this text for a social media graphic.
                     
                     Rules:
                     - MUST be short and punchy.
                     - REMOVE ALL EMOJIS. Pure text only.
                     - Do not add quotes around it.
                     - Return ONLY the phrase.
                     
                     Text:
                     "${postContent}"
                     `;

                    const result = await model.generateContent(prompt);
                    contentToRender = result.response.text().trim().replace(/['"]+/g, '');
                } catch (e) {
                    console.warn("Failed to extract quote, falling back to truncated content", e);
                    contentToRender = postContent.slice(0, 100) + "...";
                }
            }

            // For NOTE, we use the post content directly (or custom passed content if we had another arg)

            const buffer = await generateSocialCard(contentToRender, type, handle, platform, user?.image);
            // Convert buffer to base64 data uri
            const base64 = buffer.toString('base64');
            return `data:image/png;base64,${base64}`;
        }

        if (type === "HOOK") {
            // For hook, we use the post content as the concept
            const concept = postContent.slice(0, 300);
            return await generateAiImage(concept, platform);
        }

    } catch (error) {
        console.error("Vision generation failed", error);
        throw new Error("Failed to generate visual");
    }

    return null;
}

export async function savePostImageAction(postId: string, imageUrl: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch the post first to check platform and content
    const post = await prisma.post.findUnique({
        where: { id: postId, userId: session.user.id },
        select: { platform: true, content: true }
    });

    if (!post) throw new Error("Post not found");

    let newContent = post.content;
    const creditText = "\n\n📸 credit: micropost-ai";

    // Append credit for LinkedIn and Threads if not already present
    if ((post.platform === "LINKEDIN" || post.platform === "THREADS") && !post.content.includes("credit: micropost-ai")) {
        newContent = `${post.content.trim()}${creditText}`;
    }

    await prisma.post.update({
        where: { id: postId, userId: session.user.id },
        data: {
            imageUrl,
            content: newContent
        } as any
    });

    return { success: true, newContent };
}

export async function removePostImageAction(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.post.update({
        where: { id: postId, userId: session.user.id },
        data: { imageUrl: null } as any
    });

    return { success: true };
}
