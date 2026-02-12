import { auth } from "@/auth";
import { polar } from "@/lib/polar";
import { redirect } from "next/navigation";

export default async function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const session = await auth();

    // 1. Auth Check
    if (!session?.user?.email) {
        // Redirect to login with a callback to this page to resume checkout
        const callbackUrl = encodeURIComponent(`/checkout/${productId}`);
        return redirect(`/login?callbackUrl=${callbackUrl}`);
    }

    // 2. Validate Product ID (optional but good for safety, avoiding random strings)
    // For now we trust the ID or Polar will error out.

    // 3. Create Checkout
    try {
        const result = await polar.checkouts.create({
            products: [productId],
            customerEmail: session.user.email,
            // Redirect back to settings page on success to see the active subscription
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?checkout=success`,
        });

        if (result && result.url) {
            return redirect(result.url);
        }
    } catch (error) {
        console.error("Checkout creation failed:", error);
        // Fallback to pricing page with error
        return redirect("/dashboard/settings?error=checkout_failed");
    }

    return redirect("/dashboard/settings");
}
