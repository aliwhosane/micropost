"use server";

import { runDailyGeneration } from "@/lib/workflow";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
    await signOut({ redirectTo: "/" });
}

export async function addTopic(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;

    const topicName = formData.get("topic") as string;
    const notes = formData.get("notes") as string;
    const stance = formData.get("stance") as string;

    if (!topicName || topicName.trim().length === 0) {
        return;
    }

    // Get user ID based on email
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    await prisma.topic.create({
        data: {
            name: topicName,
            userId: user.id,
            notes: notes || null,
            stance: stance || "NEUTRAL",
            clientProfileId: activeClientId || null,
        } as any,
    });

    revalidatePath("/dashboard/topics");
    revalidatePath("/dashboard");
}

export async function updateTopicPreferences(topicId: string, notes: string | undefined, stance: string | undefined) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check ownership
    const existing = await prisma.topic.findFirst({
        where: { id: topicId, userId: session.user.id }
    });
    if (!existing) throw new Error("Topic not found or unauthorized");

    await prisma.topic.update({
        where: { id: topicId, userId: session.user.id },
        data: {
            notes: notes,
            stance: stance,
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/topics");
}

export async function deleteTopic(topicId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify ownership? (Ideally yes, simplified here by assuming ID checks)
    // But safer to check userId.

    await prisma.topic.delete({
        where: {
            id: topicId,
            userId: session.user.id,
        },
    });

    revalidatePath("/dashboard/topics");
}

export async function toggleTopic(topicId: string, currentState: boolean) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.topic.update({
        where: { id: topicId, userId: session.user.id },
        data: { enabled: !currentState }
    });

    revalidatePath("/dashboard/topics");
}

export async function updatePreferences(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;

    const postsPerDay = parseInt(formData.get("postsPerDay") as string); // Legacy support
    const twitterPostsPerDay = parseInt(formData.get("twitterPostsPerDay") as string);
    const linkedinPostsPerDay = parseInt(formData.get("linkedinPostsPerDay") as string);
    const threadsPostsPerDay = parseInt(formData.get("threadsPostsPerDay") as string);
    const styleSample = formData.get("styleSample") as string;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, preferences: true }
    });

    if (!user) throw new Error("User not found");

    if (activeClientId) {
        // Update Client Profile Settings
        await prisma.clientProfile.update({
            where: { id: activeClientId },
            data: {
                twitterPostsPerDay: isNaN(twitterPostsPerDay) ? 1 : twitterPostsPerDay,
                linkedinPostsPerDay: isNaN(linkedinPostsPerDay) ? 1 : linkedinPostsPerDay,
                threadsPostsPerDay: isNaN(threadsPostsPerDay) ? 1 : threadsPostsPerDay,
                styleSample,
            } as any
        });
    } else {
        // Update Personal Preferences
        if (user.preferences) {
            await prisma.preferences.update({
                where: { userId: user.id },
                data: {
                    postsPerDay: isNaN(postsPerDay) ? 1 : postsPerDay,
                    twitterPostsPerDay: isNaN(twitterPostsPerDay) ? 1 : twitterPostsPerDay,
                    linkedinPostsPerDay: isNaN(linkedinPostsPerDay) ? 1 : linkedinPostsPerDay,
                    threadsPostsPerDay: isNaN(threadsPostsPerDay) ? 1 : threadsPostsPerDay,
                    styleSample,
                },
            });
        } else {
            await prisma.preferences.create({
                data: {
                    userId: user.id,
                    postsPerDay: isNaN(postsPerDay) ? 1 : postsPerDay,
                    twitterPostsPerDay: isNaN(twitterPostsPerDay) ? 1 : twitterPostsPerDay,
                    linkedinPostsPerDay: isNaN(linkedinPostsPerDay) ? 1 : linkedinPostsPerDay,
                    threadsPostsPerDay: isNaN(threadsPostsPerDay) ? 1 : threadsPostsPerDay,
                    styleSample,
                },
            });
        }
    }

    revalidatePath("/dashboard/settings");
}

import { publishToSocials } from "@/lib/social";

export async function approvePost(postId: string, scheduledAt?: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Fetch the post first to get details for publishing
    const post = await prisma.post.findUnique({
        where: { id: postId, userId: session.user.id },
    }) as any;

    if (!post) throw new Error("Post not found");

    // If scheduledAt is provided, just mark as APPROVED and set time
    if (scheduledAt) {
        await prisma.post.update({
            where: { id: postId, userId: session.user.id },
            data: {
                status: "APPROVED",
                scheduledFor: new Date(scheduledAt)
            }
        });
        revalidatePath("/dashboard");
        return;
    }

    // Update status to APPROVED locally first (or keep as PENDING until published?)
    // Let's mark as APPROVED, then try to publish.
    await prisma.post.update({
        where: { id: postId, userId: session.user.id },
        data: { status: "APPROVED" }
    });

    // Attempt to publish
    if (post.platform) {
        const result = await publishToSocials({
            id: post.id,
            userId: session.user.id!,
            content: post.content,
            platform: post.platform!,
            imageUrl: post.imageUrl,
            clientProfileId: post.clientProfileId
        });

        if (result.success) {
            await prisma.post.update({
                where: { id: postId, userId: session.user.id },
                data: {
                    status: "PUBLISHED",
                    publishedAt: new Date(),
                    imageUrl: null // Cleanup heavy base64 data to save DB space
                } as any
            });
        } else {
            // Optionally mark as FAILED
            console.error("Publishing failed for post", postId, "Error:", result.error);
            await prisma.post.update({
                where: { id: postId, userId: session.user.id },
                data: { status: "FAILED" }
            });
        }
    }

    revalidatePath("/dashboard");
}

export async function rejectPost(postId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.post.update({
        where: { id: postId, userId: session.user.id },
        data: { status: "REJECTED" }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/posts");
}

export async function updatePostContent(postId: string, newContent: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify ownership indirectly by updating only if it matches
    // Note: In a stricter app, retrieve post first to check userId, 
    // but here we trust the user session if the post ID is valid and accessible.
    // Ideally we should check if the post belongs to the user.

    // Let's do a quick check for safety
    // Precise ownership check by including userId in the query
    const result = await prisma.post.updateMany({
        where: { id: postId, userId: session.user.id },
        data: { content: newContent }
    });

    if (result.count === 0) {
        throw new Error("Post not found or unauthorized");
    }

    revalidatePath("/dashboard");
}

import { regeneratePostContent } from "@/lib/ai";

export async function regeneratePostAction(postId: string, selectedText: string, instruction: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({
        where: { id: postId, userId: session.user.id }
    });
    if (!post) throw new Error("Post not found or unauthorized");

    const newContent = await regeneratePostContent(
        post.content,
        selectedText,
        instruction,
        post.platform || "TWITTER"
    );

    await prisma.post.update({
        where: { id: postId, userId: session.user.id },
        data: { content: newContent }
    });

    revalidatePath("/dashboard");
}

import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        throw new Error("Missing required fields");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // TODO: Sign in user immediately or redirect to login
}

import { analyzeTwitterStyle } from "@/lib/style-analyzer";

export async function analyzeSocialStyleAction(platform: "TWITTER") {
    const session = await auth();
    console.log("Analyze Action Session:", JSON.stringify(session, null, 2)); // Debug log
    if (!session?.user?.id) throw new Error("Unauthorized: No User ID");

    if (platform === "TWITTER") {
        await analyzeTwitterStyle(session.user.id);
    }

    revalidatePath("/dashboard/settings");
}

export async function triggerManualGeneration(formData?: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let temporaryThoughts;
    let framework;
    let platforms: string[] | undefined;
    let clientId: string | undefined;

    if (formData) {
        temporaryThoughts = formData.get("thoughts") as string;
        framework = formData.get("framework") as string;
        clientId = formData.get("clientId") as string;
        const platformsJson = formData.get("platforms") as string;
        if (platformsJson) {
            try {
                platforms = JSON.parse(platformsJson);
            } catch (e) {
                console.error("Failed to parse platforms", e);
            }
        }
    }

    const results = await runDailyGeneration(session.user.id, temporaryThoughts, framework, platforms, clientId);
    revalidatePath("/dashboard");
    return results;
}

export async function disconnectAccount(provider: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // "twitter", "linkedin", "threads"
    await prisma.account.deleteMany({
        where: {
            userId: userId,
            provider: provider.toLowerCase(),
        },
    });

    revalidatePath("/dashboard/settings");
}
