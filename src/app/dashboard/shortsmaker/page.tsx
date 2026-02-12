import { ScriptWizard } from "@/components/dashboard/ShortsMaker/ScriptWizard";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionTier } from "@/lib/subscription";
import { PremiumGate } from "@/components/dashboard/PremiumGate";

export default async function ShortsMakerPage(props: { searchParams: Promise<{ source_post_id?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) return redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { subscriptionStatus: true, subscriptionPlanId: true }
    });

    const tier = getSubscriptionTier(user || {});

    if (tier !== "AGENCY") {
        return (
            <div className="p-8 h-full flex flex-col">
                <div className="max-w-4xl mx-auto space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface">ShortsMaker</h1>
                    <p className="text-on-surface-variant">Turn ideas into viral TikTok/Reels scripts and storyboards in seconds.</p>
                </div>
                <PremiumGate
                    title="Agency Exclusive"
                    description="The AI Video Studio is reserved for Agency & Founding Members."
                    features={["Unlimited AI Video Scripts", "Storyboards & Shot Lists", "Commercial Usage Rights"]}
                    requiredTier="AGENCY"
                />
            </div>
        );
    }

    let initialContent = "";

    if (searchParams.source_post_id) {
        const post = await prisma.post.findUnique({
            where: { id: searchParams.source_post_id },
            select: { content: true, userId: true }
        });

        if (post && post.userId === session.user.id) {
            initialContent = post.content;
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface">ShortsMaker</h1>
                <p className="text-on-surface-variant">Turn ideas into viral TikTok/Reels scripts and storyboards in seconds.</p>
            </div>

            <ScriptWizard initialContent={initialContent} />
        </div>
    );
}
