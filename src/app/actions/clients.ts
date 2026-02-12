"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ClientProfileData {
    name: string;
    niche?: string;
    bio?: string;
    tone?: string;
    targetAudience?: string;
    avatarUrl?: string;
}

export async function createClientProfile(data: ClientProfileData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const profile = await prisma.clientProfile.create({
            data: {
                userId: session.user.id,
                ...data,
            }
        });
        revalidatePath("/dashboard/settings");
        return { success: true, profile };
    } catch (error) {
        console.error("Create Client Error:", error);
        return { success: false, error: "Failed to create client profile." };
    }
}

export async function getClientProfiles() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        return await prisma.clientProfile.findMany({
            where: { userId: session.user.id },
            include: { accounts: true } as any,
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Get Clients Error:", error);
        return [];
    }
}

export async function updateClientProfile(id: string, data: Partial<ClientProfileData>) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Verify ownership
        const existing = await prisma.clientProfile.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: "Unauthorized or not found" };
        }

        const profile = await prisma.clientProfile.update({
            where: { id },
            data
        });
        revalidatePath("/dashboard/settings");
        return { success: true, profile };
    } catch (error) {
        console.error("Update Client Error:", error);
        return { success: false, error: "Failed to update profile." };
    }
}

export async function deleteClientProfile(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Verify ownership
        const existing = await prisma.clientProfile.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: "Unauthorized or not found" };
        }

        await prisma.clientProfile.delete({ where: { id } });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Delete Client Error:", error);
        return { success: false, error: "Failed to delete profile." };
    }
}
