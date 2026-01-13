"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Target, Loader2, List, ArrowRight, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface Pillar {
    title: string;
    description: string;
    topics: string[];
}

export default function ContentPillarGenerator() {
    const [niche, setNiche] = useState("");
    const [pillars, setPillars] = useState<Pillar[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!niche) return;
        setIsLoading(true);
        setError("");
        setPillars([]);

        try {
            const res = await fetch("/api/tools/content-pillars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.pillars) setPillars(data.pillars);
            else throw new Error("Invalid response format");
        } catch (error) {
            console.error("Generation failed", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-6xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Layers className="w-8 h-8 text-tertiary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Content Pillar Generator</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop guessing what to post. Enter your niche, and we'll build your content strategy foundation in seconds.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-xl mx-auto flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="e.g. Real Estate, SaaS Marketing, Vegan Cooking"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="h-12 text-lg"
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                    </div>
                    <Button
                        size="lg"
                        className="h-12 px-8"
                        onClick={handleGenerate}
                        disabled={!niche || isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate Pillars"}
                    </Button>
                </div>

                {error && (
                    <div className="text-center text-error font-medium">{error}</div>
                )}

                {/* Results Grid */}
                {pillars.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {pillars.map((pillar, index) => (
                            <Card key={index} className="h-full hover:border-primary/50 transition-colors bg-surface border-outline-variant/40">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <CardTitle className="text-xl">{pillar.title}</CardTitle>
                                    </div>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <h4 className="text-xs uppercase font-bold text-on-surface-variant/80 tracking-wider">Example Topics</h4>
                                        <ul className="space-y-2">
                                            {pillar.topics.map((topic, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-on-surface">
                                                    <Target className="h-4 w-4 text-secondary shrink-0" />
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {pillars.length > 0 && (
                    <div className="text-center pt-12 space-y-6">
                        <h3 className="text-2xl font-bold text-on-surface">Ready to turn these pillars into scheduled posts?</h3>
                        <Link href="/login">
                            <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-lg shadow-primary/25">
                                Generate Full Calendar with Micropost <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="text-on-surface-variant text-sm">
                            Join content creators who save 20+ hours a month.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
