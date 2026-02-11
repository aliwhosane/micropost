import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return new Response("Please add POLAR_WEBHOOK_SECRET from Polar Dashboard to .env", {
            status: 400,
        });
    }

    const headerPayload = await headers();
    const headersObject = Object.fromEntries(headerPayload.entries());
    const body = await req.text();
    let evt: any;

    try {
        evt = validateEvent(body, headersObject, WEBHOOK_SECRET);
    } catch (err: any) {
        console.error("Webhook verification failed:", err.message);
        if (err instanceof WebhookVerificationError) {
            return new Response("Webhook Verification Error", { status: 403 });
        }
        return new Response(`Error occured: ${err.message}`, {
            status: 400,
        });
    }

    const eventType = evt.type;

    if (eventType.startsWith("customer.")) {
        console.log(`[Polar Webhook] Ignoring customer event: ${eventType}`);
        return new Response("", { status: 200 });
    }

    // Filter by product ID to avoid processing events from other products
    const ALLOWED_PRODUCT_IDS = [
        "585a7590-d6dc-4bd5-b2ce-df7d29ae57ce", // Monthly Membership
        "6f0dcd25-6b07-4cac-bb10-151b03435bbb", // Lifetime Access
    ];

    const data = evt.data as any;
    // Check if the event has a product_id and if it matches our allowed list.
    // We safely access product_id because other products might have different structures.
    if (data && data.product_id && !ALLOWED_PRODUCT_IDS.includes(data.product_id)) {
        console.log(`[Polar Webhook] Ignoring event ${eventType} for unrelated product: ${data.product_id}`);
        return new Response("", { status: 200 });
    }


    if (eventType === "subscription.created" || eventType === "subscription.updated") {
        const subscription = evt.data;
        // Verify where email is located in payload - user or customer
        console.log(`[Polar Webhook] Subscription keys: ${Object.keys(subscription).join(', ')}`);
        const email = subscription.user?.email || subscription.customer?.email;

        // Check if we have a user with this email
        // Note: Polar payload structure: data: { user: { email: ... }, ... } or similar.
        // We should safely access it.

        if (email) {
            if (email) {
                try {
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (user) {
                        await prisma.user.update({
                            where: { email },
                            data: {
                                polarSubscriptionId: subscription.id,
                                polarCustomerId: subscription.user_id || subscription.customer_id,
                                subscriptionStatus: subscription.status,
                                subscriptionPlanId: subscription.product_id,
                            }
                        });
                        console.log(`[Polar Webhook] Updated subscription for user: ${email}`);
                    } else {
                        console.warn(`[Polar Webhook] User not found for email: ${email}. Skipping update.`);
                    }
                } catch (dbError: any) {
                    console.error(`[Polar Webhook] Database error updating user ${email}:`, dbError.message);
                    // Return 500 to retry if it's a transient DB error, or 200 if logic error? 
                    // Usually safer to return 200 if we can't fix it, but let's stick to logging and returning 200 to stop retries if logic failed.
                }
            }
        }
    }

    if (eventType === "subscription.revoked" || eventType === "subscription.canceled") {
        const subscription = evt.data;
        await prisma.user.updateMany({ // Use updateMany in case ID is not exact or to avoid error if not found
            where: { polarSubscriptionId: subscription.id },
            data: {
                subscriptionStatus: 'canceled'
            }
        });
    }

    if (eventType === "order.created" || eventType === "order.paid") {
        const order = evt.data;
        // Handle one-time purchases (Lifetime access)
        if (order.paid && !order.subscription_id) {
            const email = order.customer.email;
            if (email) {
                await prisma.user.update({
                    where: { email },
                    data: {
                        polarOrderId: order.id,
                        polarCustomerId: order.customer_id,
                        subscriptionStatus: 'active',
                        subscriptionPlanId: order.product_id,
                    }
                });
            }
        }
    }

    if (eventType === "order.refunded") {
        const order = evt.data;
        if (!order.subscription_id) {
            await prisma.user.updateMany({
                where: { polarOrderId: order.id },
                data: {
                    subscriptionStatus: 'refunded'
                }
            });
        }
    }

    // ... existing event handlers ...



    return new Response("", { status: 200 });
}
