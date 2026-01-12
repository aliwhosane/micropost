import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { updatePreferences } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { SocialConnection } from "@/components/settings/SocialConnection";
import { Linkedin, Twitter, Save, AlertCircle } from "lucide-react";
import { AnalyzeButton } from "@/components/settings/AnalyzeButton";

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
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-on-surface">Settings</h1>
                <p className="text-on-surface-variant mt-2">Configure how your AI ghostwriter behaves.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    <form action={updatePreferences}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Preferences</CardTitle>
                                <CardDescription>Control frequency and style.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                            <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Twitter Posts / Day
                                        </label>
                                        <Input
                                            type="number"
                                            name="twitterPostsPerDay"
                                            min={0}
                                            max={10}
                                            defaultValue={prefs.twitterPostsPerDay || 1}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                            <Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn Posts / Day
                                        </label>
                                        <Input
                                            type="number"
                                            name="linkedinPostsPerDay"
                                            min={0}
                                            max={10}
                                            defaultValue={prefs.linkedinPostsPerDay || 1}
                                            required
                                        />
                                    </div>
                                </div>
                                <input type="hidden" name="postsPerDay" value={prefs.postsPerDay} /> {/* Legacy support */}

                                <div className="space-y-2">

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Writing Style Sample
                                        </label>
                                        <AnalyzeButton
                                            platform="TWITTER"
                                            isConnected={user.accounts.some((a: any) => a.provider === "twitter")}
                                        />
                                    </div>
                                    <textarea
                                        name="styleSample"
                                        className="flex min-h-[150px] w-full rounded-md border border-outline-variant bg-surface-variant/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Paste some of your previous posts or writing here. The AI will analyze this to mimic your tone (e.g., professional, casual, witty). Or click 'Analyze My Tweets' to auto-generate."
                                        defaultValue={prefs.styleSample || ""}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-between border-t border-outline-variant/10 pt-6">
                                <div className="flex items-center text-xs text-on-surface-variant">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Changes apply to tomorrow's queue.
                                </div>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* Social Accounts */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Accounts</CardTitle>
                            <CardDescription>Where we publish content.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SocialConnection
                                provider="linkedin"
                                isConnected={user.accounts.some((a: any) => a.provider === "linkedin")}
                            />
                            <SocialConnection
                                provider="twitter"
                                isConnected={user.accounts.some((a: any) => a.provider === "twitter")}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
