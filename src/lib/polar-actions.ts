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

    let customerId = user?.polarCustomerId;

    // Helper to validate UUID
    const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // If ID is missing or invalid (e.g. legacy/dummy ID), try to fetch correct UUID from Polar
    if (!customerId || !isUuid(customerId)) {
        try {
            console.log(`[Polar Action] Invalid or missing Customer ID (${customerId}). Looking up by email: ${session.user.email}`);

            // List customers by email
            const customers = await polar.customers.list({
                email: session.user.email,
                limit: 1,
            });

            if (customers.result.items.length > 0) {
                customerId = customers.result.items[0].id;
                console.log(`[Polar Action] Found correct Customer UUID: ${customerId}`);

                // Update database with correct UUID to prevent future lookups
                await prisma.user.update({
                    where: { email: session.user.email },
                    data: { polarCustomerId: customerId }
                });
            } else {
                console.error(`[Polar Action] No customer found in Polar for email: ${session.user.email}`);
            }
        } catch (error) {
            console.error("[Polar Action] Failed to lookup user by email:", error);
        }
    }

    if (!customerId) {
        // If we still don't have an ID, we can't create a session.
        // Redirect to settings with error or maybe they just aren't a customer yet?
        console.error("[Polar Action] Could not resolve a valid Polar Customer ID.");
        redirect("/dashboard/settings?error=customer_not_found");
    }

    try {
        const result = await polar.customerSessions.create({
            customerId: customerId,
        });

        if (result) {
            redirect(result.customerPortalUrl);
        }
    } catch (error: any) {
        console.error("[Polar Action] Failed to create customer session:", error?.message || error);
        redirect("/dashboard/settings?error=portal_error");
    }
}
