import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { updatePreferences } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { SocialConnection } from "@/components/settings/SocialConnection";
import { Linkedin, Twitter, Save, AlertCircle, Zap, Shield, Wand2, AtSign } from "lucide-react";
import { AnalyzeButton } from "@/components/settings/AnalyzeButton";
import { ProfileOptimizerSection } from "@/components/dashboard/Settings/ProfileOptimizerSection";
import { PricingCard } from "@/components/settings/PricingCard";
import { FormSlider } from "@/components/settings/FormSlider";

import { ClientList } from "@/components/dashboard/ClientList";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;
    console.log("Settings Page Debug:", { activeClientId });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            preferences: true,
            accounts: !activeClientId ? true : false // Only fetch user accounts if no client active
        },
    });

    if (!user) return <div>User not found</div>;

    let prefs: any;
    let accounts: any[] = [];
    let isClientContext = false;

    if (activeClientId) {
        const client = await prisma.clientProfile.findUnique({
            where: { id: activeClientId },
            include: { accounts: true }
        });

        if (client) {
            const ctx = client as any;
            isClientContext = true;
            prefs = {
                postsPerDay: 1, // field missing on client, default 1
                twitterPostsPerDay: ctx.twitterPostsPerDay,
                linkedinPostsPerDay: ctx.linkedinPostsPerDay,
                threadsPostsPerDay: ctx.threadsPostsPerDay,
                styleSample: ctx.styleSample,
                // Client doesn't have "connected" booleans, we derive from accounts
            };
            accounts = ctx.accounts;
        }
    }

    // Fallback to User/Personal
    if (!isClientContext) {
        prefs = (user.preferences as any) || {
            postsPerDay: 1,
            twitterPostsPerDay: 1,
            linkedinPostsPerDay: 1,
            threadsPostsPerDay: 1,
            styleSample: "",
            linkedinConnected: false,
            twitterConnected: false,
            threadsConnected: false
        };
        accounts = user.accounts;
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-12">

            {/* Page Header */}
            <div className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/20 p-8 sm:p-12 mb-12">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Wand2 className="w-64 h-64 -translate-y-1/2 translate-x-1/4 rotate-12" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                        Settings
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                        Customize your AI ghostwriter, manage connected accounts, and control your subscription.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Preferences */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Bio / Profile Optimizer */}
                    <ProfileOptimizerSection />

                    {/* Client Management (Agency) */}
                    {/* Ideally check subscription tier here, but for now we show for all or gate via UI logic */}
                    <section id="clients" className="scroll-mt-24 space-y-6">
                        <ClientList initialClients={
                            (await prisma.clientProfile.findMany({
                                where: { userId: user.id },
                                include: { accounts: true }
                            })).map((c: any) => ({
                                ...c,
                                niche: c.niche || null,
                                bio: c.bio || null,
                                tone: c.tone || null,
                                avatarUrl: c.avatarUrl || null,
                                accounts: c.accounts || []
                            }))
                        } />
                    </section>

                    {/* Content Configuration */}
                    <section id="content" className="scroll-mt-24 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Wand2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-on-surface">Content Configuration</h2>
                        </div>

                        <form action={updatePreferences}>
                            <Card className="overflow-hidden border-outline-variant/30 shadow-sm bg-surface">
                                <CardHeader className="border-b border-outline-variant/10 pb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">Ghostwriter Preferences</CardTitle>
                                            <CardDescription className="mt-1">Control how often and consistently the AI writes for you.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-10 p-8">
                                    {/* Frequency Settings */}
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {/* Twitter Slider */}
                                            <FormSlider
                                                name="twitterPostsPerDay"
                                                defaultValue={prefs.twitterPostsPerDay}
                                                max={10}
                                                step={1}
                                                label="Twitter / X"
                                                icon={<Twitter className="h-4 w-4 fill-current text-[#1DA1F2]" />}
                                                description="Maximum daily automated tweets."
                                            />

                                            {/* LinkedIn Slider */}
                                            <FormSlider
                                                name="linkedinPostsPerDay"
                                                defaultValue={prefs.linkedinPostsPerDay}
                                                max={5}
                                                step={1}
                                                label="LinkedIn"
                                                icon={<Linkedin className="h-4 w-4 fill-current text-[#0077b5]" />}
                                                description="Maximum daily professional posts."
                                            />

                                            {/* Threads Slider */}
                                            <FormSlider
                                                name="threadsPostsPerDay"
                                                defaultValue={prefs.threadsPostsPerDay}
                                                max={10}
                                                step={1}
                                                label="Threads"
                                                icon={<AtSign className="h-4 w-4 text-on-surface" />}
                                                description="Maximum daily threads."
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

                                    {/* Style Settings */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-base font-semibold text-on-surface">Writing Style</h3>
                                                <p className="text-sm text-on-surface-variant mt-1">Provide a sample text for the AI to analyze and mimic.</p>
                                            </div>
                                            <AnalyzeButton
                                                platform="TWITTER"
                                                isConnected={accounts.some((a: any) => a.provider === "twitter")}
                                            />
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                name="styleSample"
                                                className="flex min-h-[200px] w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all resize-y shadow-inner leading-relaxed"
                                                placeholder="Paste a few of your best posts here. The AI will learn your tone, vocabulary, and sentence structure..."
                                                defaultValue={prefs.styleSample || ""}
                                            />
                                            <div className="absolute bottom-3 right-3 text-[10px] text-on-surface-variant/50 pointer-events-none bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                                Markdown supported
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" name="postsPerDay" value={prefs.postsPerDay} />
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-variant/10 border-t border-outline-variant/10 p-6">
                                    <div className="flex items-center text-xs text-on-surface-variant font-medium bg-primary/5 px-3 py-1.5 rounded-full text-primary">
                                        <AlertCircle className="mr-2 h-3.5 w-3.5" />
                                        Changes apply to the next generation cycle
                                    </div>
                                    <Button type="submit" variant="filled" size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                        <Save className="mr-2 h-4 w-4" /> Save Preferences
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </section>
                </div>

                {/* Right Column: Connections & Billing */}
                <div className="lg:col-span-4 space-y-10">

                    {/* Connections */}
                    <section id="connections" className="scroll-mt-24 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-on-surface">Connections</h2>
                        </div>
                        <Card className="border-outline-variant/30 shadow-sm bg-surface">
                            <CardContent className="pt-6 space-y-4">
                                <p className="text-sm text-on-surface-variant mb-2">Connect accounts to enable auto-publishing.</p>

                                {(() => {
                                    const getAccount = (provider: string) => accounts.find((a: any) => a.provider === provider);
                                    const checkExpired = (account: any) => {
                                        if (!account) return false;

                                        // If we have a refresh_token, we can auto-refresh, so don't show as expired.
                                        if (account.refresh_token) return false;

                                        // If no refresh_token, check access_token expiration
                                        if (!account.expires_at) return false;
                                        return account.expires_at < Math.floor(Date.now() / 1000);
                                    };

                                    const linkedin = getAccount("linkedin");
                                    const twitter = getAccount("twitter");
                                    const threads = getAccount("threads");

                                    return (
                                        <>
                                            <SocialConnection
                                                provider="linkedin"
                                                isConnected={!!linkedin}
                                                isExpired={checkExpired(linkedin)}
                                                clientId={activeClientId}
                                            />
                                            <SocialConnection
                                                provider="twitter"
                                                isConnected={!!twitter}
                                                isExpired={checkExpired(twitter)}
                                                clientId={activeClientId}
                                            />
                                            <SocialConnection
                                                provider="threads"
                                                isConnected={!!threads}
                                                isExpired={checkExpired(threads)}
                                                clientId={activeClientId}
                                            />
                                        </>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Subscription */}
                    <section id="billing" className="scroll-mt-24 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-on-surface">Subscription</h2>
                        </div>

                        {user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing' ? (
                            <PricingCard
                                name="Active Subscription"
                                price="Active"
                                description="Manage your subscription in the portal."
                                features={["Unlimited Posts", "Priority Support", "Feature Access"]}
                                buttonText="Manage Subscription"
                                productId=""
                                isActive={true}
                                isPopular={false}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Pro Plan */}
                                <PricingCard
                                    name="Pro"
                                    price="$29"
                                    description="For serious creators."
                                    features={["3 Posts/day", "Basic Analytics", "No Shorts"]}
                                    buttonText="Subscribe"
                                    productId={process.env.POLAR_PRODUCT_ID_PRO || ""}
                                    isPopular={false}
                                />

                                {/* Agency Monthly */}
                                <PricingCard
                                    name="Agency"
                                    price="$99"
                                    description="Ultimate power & video."
                                    features={["Unlimited Posts", "Advanced Analytics", "Unlimited Shorts", "Commercial Rights"]}
                                    buttonText="Subscribe"
                                    productId={process.env.POLAR_PRODUCT_ID_AGENCY_MONTHLY || ""}
                                    isPopular={false}
                                />

                                {/* Agency Yearly - Early Bird */}
                                <PricingCard
                                    name="Agency Yearly"
                                    price="$399"
                                    description="Limited Time Founder's Deal."
                                    features={["Everything in Agency", "4 months free", "Founder Badge"]}
                                    buttonText="Get Yearly Deal"
                                    productId={process.env.POLAR_PRODUCT_ID_AGENCY_YEARLY || ""}
                                    isPopular={true}
                                />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
