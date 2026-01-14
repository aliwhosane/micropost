"use server";

import { auth } from "@/auth";
import { polar } from "./polar";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createCheckout(productId: string) {
    const session = await auth();
    if (!session?.user?.email) {
        redirect(`/login?callbackUrl=/pricing`);
    }

    const result = await polar.checkouts.create({
        products: [productId],
        customerEmail: session.user.email,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?checkout=success`,
    });

    if (result) {
        redirect(result.url);
    }
}

export async function createCustomerPortalSession() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { polarCustomerId: true }
    });

    if (!user?.polarCustomerId) {
        throw new Error("No customer ID found for user");
    }

    const result = await polar.customerSessions.create({
        customerId: user.polarCustomerId,
    });

    if (result) {
        redirect(result.customerPortalUrl);
    }
}
