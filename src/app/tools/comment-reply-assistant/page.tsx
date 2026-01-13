"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Loader2, Copy, Check, MessageSquare } from "lucide-react";

export default function CommentReplyAssistant() {
    const [comment, setComment] = useState("");
    const [replies, setReplies] = useState<{ style: string, content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!comment) return;

        setIsLoading(true);
        setError("");
        setReplies([]);

        try {
            const res = await fetch("/api/tools/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.replies && Array.isArray(data.replies)) {
                setReplies(data.replies);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Reply generation failed", error);
            setError(error.message || "Failed to generate replies. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getStyleColor = (style: string) => {
        switch (style) {
            case "Funny": return "text-orange-500 bg-orange-500/10";
            case "Grateful": return "text-green-500 bg-green-500/10";
            default: return "text-blue-500 bg-blue-500/10";
        }
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Comment Reply Assistant</h1>
                    <p className="text-xl text-on-surface-variant">
                        Engagement is key. Automate the posting, not the connection.
                        <br className="hidden md:block" /> Reply faster and keep the conversation going.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                    <label className="text-sm font-medium text-on-surface mb-2 block">The Comment You Received</label>
                    <textarea
                        className="w-full h-32 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                        placeholder="e.g. This is great advice! I've been struggling with this exact problem for weeks."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl mt-6"
                        onClick={handleGenerate}
                        disabled={!comment || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Thinking of witty replies...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Generate Replies
                            </div>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-center text-error font-medium max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {replies.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {replies.map((reply, index) => (
                            <div key={index} className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-green-500/50 transition-colors shadow-sm hover:shadow-md group flex flex-col">
                                <div className="mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${getStyleColor(reply.style)}`}>
                                        {reply.style}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg text-on-surface leading-relaxed font-medium">"{reply.content}"</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-outline-variant/20 flex justify-end">
                                    <Button variant="outlined" size="sm" onClick={() => copyToClipboard(reply.content, index)} className="flex items-center gap-2">
                                        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedIndex === index ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
