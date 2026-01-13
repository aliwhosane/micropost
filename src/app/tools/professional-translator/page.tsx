"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Sparkles, Copy, Check, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function ProfessionalTranslator() {
    const [text, setText] = useState("");
    const [tone, setTone] = useState("Professional");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleTranslate = async () => {
        if (!text) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/tools/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, tone }),
            });
            const data = await res.json();
            setResult(data.result);
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Languages className="w-8 h-8 text-secondary" />
                    </div>
                    <h1 className="text-4xl font-bold text-on-surface">Professional Translator</h1>
                    <p className="text-xl text-on-surface-variant">
                        Turn "You are an idiot" into "We may have a divergence in perspective."
                    </p>
                </div>

                <div className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-on-surface-variant">Tone:</span>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Diplomatic">Diplomatic</SelectItem>
                                    <SelectItem value="Empathetic">Empathetic</SelectItem>
                                    <SelectItem value="Direct">Direct but Polite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Original Thought (Raw)</label>
                            <textarea
                                className="w-full h-[250px] p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                                placeholder="Type what you *really* want to say..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        {/* Output */}
                        <div className="space-y-2 relative">
                            <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider flex items-center gap-2">
                                <Languages className="h-3 w-3 text-secondary" /> Corporate Translation
                            </label>
                            <div className="w-full h-[250px] p-4 rounded-xl bg-secondary/5 border border-secondary/20 font-sans text-base relative">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center text-secondary/50 animate-pulse">
                                        Translating...
                                    </div>
                                ) : result ? (
                                    <div className="whitespace-pre-wrap text-on-surface">{result}</div>
                                ) : (
                                    <div className="text-on-surface-variant/40 italic">Translation will appear here...</div>
                                )}

                                {result && (
                                    <Button
                                        size="icon"
                                        variant="text"
                                        className="absolute bottom-4 right-4 hover:bg-secondary/10 hover:text-secondary"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg rounded-xl"
                        onClick={handleTranslate}
                        disabled={!text || isLoading}
                    >
                        {isLoading ? "Rewriting..." : "Translate to Corporate Speak"}
                    </Button>

                </div>

                <div className="text-center bg-surface-variant/20 p-6 rounded-2xl">
                    <p className="font-medium text-on-surface mb-2">Need to do this for your entire social strategy?</p>
                    <Link href="/login" className="text-primary hover:underline font-bold">
                        Start a free trial of Micropost AI
                    </Link>
                </div>
            </div>
        </div>
    );
}
