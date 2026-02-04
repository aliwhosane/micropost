import { Webhook } from "svix";
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
    const svix_id = headerPayload.get("webhook-id");
    const svix_timestamp = headerPayload.get("webhook-timestamp");
    const svix_signature = headerPayload.get("webhook-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
        evt = wh.verify(body, {
            "webhook-id": svix_id,
            "webhook-timestamp": svix_timestamp,
            "webhook-signature": svix_signature,
        });
    } catch (err) {
        return new Response("Error occured", {
            status: 400,
        });
    }

    const eventType = evt.type;

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
        const email = subscription.user.email; // Verify where email is located in payload
        // If email is not directly on user, we might need to fetch user or rely on customer_id

        // Check if we have a user with this email
        // Note: Polar payload structure: data: { user: { email: ... }, ... } or similar.
        // We should safely access it.

        if (email) {
            await prisma.user.update({
                where: { email },
                data: {
                    polarSubscriptionId: subscription.id,
                    polarCustomerId: subscription.user_id || subscription.customer_id, // Adjust based on actual payload
                    subscriptionStatus: subscription.status,
                    subscriptionPlanId: subscription.product_id,
                }
            });
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

    return new Response("", { status: 200 });
}
