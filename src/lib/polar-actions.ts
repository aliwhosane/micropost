"use server";

import { auth } from "@/auth";
import { polar } from "./polar";
import { redirect } from "next/navigation";

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
