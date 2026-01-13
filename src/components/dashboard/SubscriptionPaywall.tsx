import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lock, Sparkles, CheckCircle2 } from "lucide-react";

export function SubscriptionPaywall() {
    return (
        <div className="flex-1 h-full flex items-center justify-center p-6 min-h-[60vh]">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* Hero Icon */}
                <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center relative">
                    <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                    <div className="absolute -bottom-2 -right-2 bg-surface rounded-full p-1.5 shadow-sm border border-outline-variant/20">
                        <Lock className="h-5 w-5 text-on-surface-variant" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                        Unlock the Full Power of Micropost
                    </h2>
                    <p className="text-lg text-on-surface-variant max-w-lg mx-auto">
                        Your free trial gives you access to our basic tools. Upgrade to Pro to unlock unlimited AI generation, scheduling, and analytics.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-4 text-left max-w-lg mx-auto bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium text-on-surface">Unlimited AI Posts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium text-on-surface">Multi-platform Scheduling</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium text-on-surface">Advanced Analytics</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium text-on-surface">Custom AI Persona</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/pricing" target="_blank">
                        <Button size="lg" className="px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30">
                            Upgrade to Pro
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="text" size="lg">
                            Restore Purchase
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-on-surface-variant/60">
                    30-day money-back guarantee. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
