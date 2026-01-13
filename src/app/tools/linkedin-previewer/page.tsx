"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Smartphone, Monitor } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function LinkedInPreviewer() {
    const [text, setText] = useState("");

    // LinkedIn truncation logic approx.
    // Mobile: ~140 chars or 3 lines
    // Desktop: ~210 chars or 5 lines
    // This is an approximation as it depends on pixel width, but good enough for a tool.

    return (
        <div className="container mx-auto py-12 px-6 max-w-5xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Input Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold text-on-surface mb-2">LinkedIn Previewer</h1>
                        <p className="text-on-surface-variant">
                            Don't let your hook get buried. Check exactly where your post cuts off on mobile and desktop.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Your Post Draft</label>
                        <textarea
                            className="w-full h-[400px] p-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                            placeholder="Start typing your post here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex justify-between text-xs text-on-surface-variant">
                            <span>{text.length} characters</span>
                            <span>{text.split('\n').length} lines</span>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-surface-variant/30 p-8 rounded-3xl border border-outline-variant/20">
                    <Tabs defaultValue="mobile" className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-on-surface">Preview</h3>
                            <TabsList>
                                <TabsTrigger value="mobile" className="flex gap-2"><Smartphone className="h-4 w-4" /> Mobile</TabsTrigger>
                                <TabsTrigger value="desktop" className="flex gap-2"><Monitor className="h-4 w-4" /> Desktop</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="mobile" className="mt-0">
                            <div className="w-[320px] mx-auto bg-white text-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 font-sans">
                                <div className="p-4 border-b border-gray-100 flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                                    <div>
                                        <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                        <div className="h-2 w-16 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="p-4 text-[14px] leading-[1.4] whitespace-pre-wrap">
                                    <TruncatedText text={text} limit={140} lines={3} />
                                </div>
                                <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-300 border-t border-gray-100">
                                    Post Media
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="desktop" className="mt-0">
                            <div className="w-full bg-white text-black rounded-xl overflow-hidden shadow-xl border border-gray-200 font-sans">
                                <div className="p-4 border-b border-gray-100 flex gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                        <div className="h-3 w-20 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="p-4 text-[14px] leading-[1.4] whitespace-pre-wrap">
                                    <TruncatedText text={text} limit={210} lines={5} />
                                </div>
                                <div className="h-48 bg-gray-50 flex items-center justify-center text-gray-300 border-t border-gray-100">
                                    Post Media
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 text-center bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <p className="font-medium text-on-surface mb-4">Want more than just previews?</p>
                        <Link href="/login">
                            <Button>Write Better With Micropost AI</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TruncatedText({ text, limit, lines }: { text: string, limit: number, lines: number }) {
    if (!text) return <span className="text-gray-400 italic">Preview will appear here...</span>;

    const charTruncated = text.slice(0, limit);
    const lineTruncated = text.split('\n').slice(0, lines).join('\n');

    // Whichever is shorter effectively dictates the cut-off
    const effectivelyTruncated = charTruncated.length < lineTruncated.length ? charTruncated : lineTruncated;
    const isCutOff = text.length > effectivelyTruncated.length;

    return (
        <div>
            {effectivelyTruncated}
            {isCutOff && <span className="text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"> ...see more</span>}
        </div>
    );
}
