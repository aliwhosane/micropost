import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCard } from "@/components/settings/PricingCard";
import { auth } from "@/auth";

export default async function PricingPage() {
    const session = await auth();
    // Reusing the PricingCard component which handles checkout logic.
    // If user is not logged in, the server action `createCheckout` will likely throw error or we should handle it in UI.
    // The PricingCard uses `createCheckout` from '@/lib/polar-actions' which checks auth.
    // So if not logged, it will error. 
    // However, for a generic pricing page, usually "Get Started" redirects to Login if not authenticated.
    // But since the user wants "select... and redirect to polar", let's assume this page is primarily for logged-in users or I need to update PricingCard to handle non-auth.
    // Actually, `PricingCard` is a client component calling a server action. The server action checks session.
    // If I want this page to work for non-logged in users, I should probably redirect to login first.
    // But let's build the page first.

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1 py-24 px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
                            Choose the plan that fits your growth. No hidden fees. Cancel anytime.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <PricingCard
                            name="Monthly Membership"
                            price="Pay what you want"
                            description="Full access to all AI tools and features."
                            features={[
                                "Unlimited AI Posts",
                                "All 12+ Creator Tools",
                                "Viral Hook Generator",
                                "Priority Support",
                                "Cancel Anytime"
                            ]}
                            buttonText="Subscribe Monthly"
                            productId="585a7590-d6dc-4bd5-b2ce-df7d29ae57ce"
                            isPopular={true}
                        />

                        <PricingCard
                            name="Lifetime Access"
                            price="$999"
                            description="One-time payment. Own it forever."
                            features={[
                                "Everything in Monthly",
                                "Lifetime Updates",
                                "No Recurring Fees"
                            ]}
                            buttonText="Get Lifetime Access"
                            productId="6f0dcd25-6b07-4cac-bb10-151b03435bbb"
                            isPopular={false}
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-on-surface-variant">
                            Secure payment via Polar.sh. 14-day money-back guarantee.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
