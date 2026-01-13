import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { updatePreferences } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { SocialConnection } from "@/components/settings/SocialConnection";
import { Linkedin, Twitter, Save, AlertCircle } from "lucide-react";
import { AnalyzeButton } from "@/components/settings/AnalyzeButton";
import { PricingCard } from "@/components/settings/PricingCard";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { preferences: true, accounts: true },
    });

    if (!user) return <div>User not found</div>;

    const prefs = user.preferences || { postsPerDay: 1, twitterPostsPerDay: 1, linkedinPostsPerDay: 1, styleSample: "", linkedinConnected: false, twitterConnected: false };

    return (

        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-on-surface">Settings</h1>
                <p className="text-lg text-on-surface-variant">Configure your personal AI ghostwriter preferences.</p>
            </div>

            {/* Pricing Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-on-surface">Subscription Plan</h2>
                    {user.subscriptionStatus === 'active' &&
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Active</span>
                    }
                </div>

                {user.subscriptionStatus === 'active' ? (
                    <Card className="max-w-3xl border-primary bg-surface-container-low shadow-sm hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="flex h-3 w-3 rounded-full bg-green-500" />
                                Premium Active
                            </CardTitle>
                            <CardDescription className="text-base">
                                You have full access to all premium features. Thank you for your support!
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        <PricingCard
                            name="Monthly"
                            price="Pay What You Want"
                            description="Support the project monthly."
                            features={["14-day free trial", "Unlimited Posts", "Priority Support", "Feature Access"]}
                            buttonText="Subscribe"
                            productId="585a7590-d6dc-4bd5-b2ce-df7d29ae57ce"
                            isPopular={true}
                        />
                        <PricingCard
                            name="Lifetime"
                            price="$999"
                            description="One-time payment forever."
                            features={["All Monthly features", "No recurring fees", "Founder badge", "Lifetime Updates"]}
                            buttonText="Get Lifetime Access"
                            productId="6f0dcd25-6b07-4cac-bb10-151b03435bbb"
                            isPopular={false}
                        />
                    </div>
                )}
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Content Preferences */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-on-surface">Content Configuration</h2>
                        <form action={updatePreferences}>
                            <Card className="overflow-hidden border-outline-variant/40 shadow-sm">
                                <CardHeader className="bg-surface-variant/20 border-b border-outline-variant/10">
                                    <CardTitle>Ghostwriter Preferences</CardTitle>
                                    <CardDescription>Control how often and consistently the AI writes for you.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 p-6">
                                    {/* Frequency Settings */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Posting Frequency</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                                                    <div className="p-1.5 rounded bg-[#1DA1F2]/10 text-[#1DA1F2]">
                                                        <Twitter className="h-4 w-4" />
                                                    </div>
                                                    Twitter Posts / Day
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="twitterPostsPerDay"
                                                    min={0}
                                                    max={10}
                                                    defaultValue={prefs.twitterPostsPerDay || 1}
                                                    required
                                                    className="h-11 bg-surface-container-lowest focus:bg-surface"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                                                    <div className="p-1.5 rounded bg-[#0077b5]/10 text-[#0077b5]">
                                                        <Linkedin className="h-4 w-4" />
                                                    </div>
                                                    LinkedIn Posts / Day
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="linkedinPostsPerDay"
                                                    min={0}
                                                    max={10}
                                                    defaultValue={prefs.linkedinPostsPerDay || 1}
                                                    required
                                                    className="h-11 bg-surface-container-lowest focus:bg-surface"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-outline-variant/20" />

                                    {/* Style Settings */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Writing Style</h3>
                                                <p className="text-xs text-on-surface-variant mt-1">Provide a sample for the AI to mimic.</p>
                                            </div>
                                            <AnalyzeButton
                                                platform="TWITTER"
                                                isConnected={user.accounts.some((a: any) => a.provider === "twitter")}
                                            />
                                        </div>

                                        <textarea
                                            name="styleSample"
                                            className="flex min-h-[180px] w-full rounded-xl border border-outline-variant bg-surface-variant/20 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-surface transition-all resize-y"
                                            placeholder="Paste some of your previous posts or writing here..."
                                            defaultValue={prefs.styleSample || ""}
                                        />
                                    </div>
                                    <input type="hidden" name="postsPerDay" value={prefs.postsPerDay} />
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-variant/20 border-t border-outline-variant/10 p-6">
                                    <div className="flex items-center text-xs text-on-surface-variant font-medium">
                                        <AlertCircle className="mr-2 h-4 w-4 text-primary" />
                                        Updates apply to the next daily generation cycle.
                                    </div>
                                    <Button type="submit" variant="filled" className="w-full sm:w-auto shadow-md shadow-primary/20">
                                        <Save className="mr-2 h-4 w-4" /> Save Preferences
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </section>
                </div>

                {/* Right Column: Connections */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-on-surface">Connections</h2>
                        <Card className="border-outline-variant/40 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle>Social Accounts</CardTitle>
                                <CardDescription>Connect platforms to enable auto-publishing.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <SocialConnection
                                    provider="linkedin"
                                    isConnected={user.accounts.some((a: any) => a.provider === "linkedin")}
                                />
                                <div className="h-px bg-outline-variant/20 mx-2" />
                                <SocialConnection
                                    provider="twitter"
                                    isConnected={user.accounts.some((a: any) => a.provider === "twitter")}
                                />
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
