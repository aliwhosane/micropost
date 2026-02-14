"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingSectionProps {
    productIds: {
        pro: string;
        agencyMonthly: string;
        agencyYearly: string;
    }
}

export function PricingSection({ productIds }: PricingSectionProps) {
    return (
        <section className="py-24 px-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight text-on-surface">Fair & Simple Pricing</h2>
                    <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                        Start for free, upgrade when you go viral.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Free Tier */}
                    <Card className="border-outline-variant/40 bg-surface h-full flex flex-col hover:border-outline-variant/60 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-xl font-medium text-on-surface-variant">Free</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-on-surface">$0</span>
                                <span className="text-on-surface-variant ml-2">/ forever</span>
                            </div>
                            <CardDescription className="pt-2">
                                For hobbyists.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 pt-4">
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                    <span>5 Posts per month</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                    <span>Access to Free Tools</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                    <span>Basic Formatting</span>
                                </li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Link href="/login">
                                <Button variant="outlined" className="w-full h-12 text-base">
                                    Start Free
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-outline-variant/40 bg-surface h-full flex flex-col hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-xl font-medium text-on-surface-variant">Pro</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-on-surface">$29</span>
                                <span className="text-on-surface-variant ml-2">/ month</span>
                            </div>
                            <CardDescription className="pt-2">
                                For solo creators.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 pt-4">
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>3 Posts per day</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>Basic Analytics</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>Unlimited Topic Gen</span>
                                </li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Link href={`/checkout/${productIds.pro}`}>
                                <Button variant="outlined" className="w-full h-12 text-base">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Agency Monthly */}
                    <Card className="border-primary bg-primary/5 h-full flex flex-col relative overflow-hidden transform md:scale-105 shadow-xl z-10">
                        <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-xl">
                            MOST POPULAR
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-primary">Agency</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-on-surface">$99</span>
                                <span className="text-on-surface-variant ml-2">/ month</span>
                            </div>
                            <CardDescription className="pt-2">
                                Ultimate power & video tools.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 pt-4">
                                <li className="flex items-start gap-3 text-on-surface">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span><b>Unlimited</b> Posts</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span><b>ShortsMaker</b> (Video)</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>Advanced Analytics</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>Commercial Usage Rights</span>
                                </li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Link href={`/checkout/${productIds.agencyMonthly}`}>
                                <Button variant="filled" className="w-full h-12 text-base shadow-primary/25 shadow-lg">
                                    Subscribe Now
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Agency Yearly */}
                    <Card className="border-tertiary/50 bg-tertiary/5 h-full flex flex-col relative overflow-hidden hover:border-tertiary transition-colors">
                        <div className="absolute top-0 right-0 bg-tertiary text-on-tertiary text-xs font-bold px-3 py-1 rounded-bl-xl">
                            BEST VALUE
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-tertiary">Agency Yearly</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-on-surface">$399</span>
                                <span className="text-on-surface-variant ml-2">/ year</span>
                            </div>
                            <CardDescription className="pt-2">
                                Founder's Deal (Limited Time).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 pt-4">
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-tertiary shrink-0" />
                                    <span><b>Everything in Agency</b></span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-tertiary shrink-0" />
                                    <span>4 Months Free</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-tertiary shrink-0" />
                                    <span>Founder Badge</span>
                                </li>
                                <li className="flex items-start gap-3 text-on-surface-variant">
                                    <Check className="h-5 w-5 text-tertiary shrink-0" />
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Link href={`/checkout/${productIds.agencyYearly}`}>
                                <Button variant="outlined" className="w-full h-12 text-base border-tertiary/50 text-tertiary hover:bg-tertiary/10">
                                    Get Yearly Deal
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </section>
    );
}
