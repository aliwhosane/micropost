"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Copy, Check, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function ColdDMWriter() {
    const [recipientRole, setRecipientRole] = useState("");
    const [goal, setGoal] = useState("");
    const [context, setContext] = useState("");
    const [style, setStyle] = useState("Direct");

    const [dms, setDms] = useState<{ label: string, content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!recipientRole || !goal || !context) return;

        setIsLoading(true);
        setError("");
        setDms([]);

        try {
            const res = await fetch("/api/tools/cold-dm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientRole, goal, context, style }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.dms && Array.isArray(data.dms)) {
                setDms(data.dms);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("DM generation failed", error);
            setError(error.message || "Failed to generate DMs. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Send className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Cold DM Writer</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop feeling spammy. Start starting conversations.
                        <br className="hidden md:block" /> AI that writes high-converting, empathetic outreach messages.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto space-y-6 bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-surface">Recipient Role</label>
                            <Input
                                placeholder="e.g. Marketing Manager, CEO"
                                value={recipientRole}
                                onChange={(e) => setRecipientRole(e.target.value)}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-surface">Your Goal</label>
                            <Input
                                placeholder="e.g. Book a 15 min call"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Select Style</label>
                        <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Direct">Direct & Short</SelectItem>
                                <SelectItem value="Soft">Soft & Relational</SelectItem>
                                <SelectItem value="Question">Question Based</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">
                            Context / Your Offer / Value Prop
                        </label>
                        <textarea
                            className="w-full h-32 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                            placeholder="e.g. We help SaaS companies get more leads using AI. I noticed they recently hired a sales VP..."
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl"
                        onClick={handleGenerate}
                        disabled={!recipientRole || !goal || !context || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Writing Scripts...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Generate DMs
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
                {dms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {dms.map((dm, index) => (
                            <div key={index} className={`bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group relative ${index === 0 ? 'md:col-span-2' : ''}`}>
                                <div className="mb-4 flex justify-between items-center">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                                        {dm.label}
                                    </span>
                                </div>
                                <div className="pr-2">
                                    <p className="text-lg text-on-surface whitespace-pre-wrap leading-relaxed font-medium">{dm.content}</p>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button variant="outlined" size="sm" onClick={() => copyToClipboard(dm.content, index)} className="flex items-center gap-2">
                                        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedIndex === index ? "Copied" : "Copy to Clipboard"}
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
