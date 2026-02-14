"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

export function ComparisonSection() {
    return (
        <section className="py-24 px-6 bg-surface-variant/30">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Old Way */}
                    <div className="space-y-6 opacity-70">
                        <h3 className="text-2xl font-bold text-on-surface-variant flex items-center gap-2">
                            <XCircle className="text-error" /> The Old Way
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                <span className="text-error font-bold">×</span> Staring at a blank cursor for 20 mins
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                <span className="text-error font-bold">×</span> Forgetting to post for 3 weeks straight
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                <span className="text-error font-bold">×</span> Posting generic "ChatGPT" sounding noise
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                <span className="text-error font-bold">×</span> Zero engagement, zero growth
                            </li>
                        </ul>
                    </div>

                    {/* New Way (Highlight) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-surface p-8 rounded-3xl shadow-xl border border-primary/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
                        <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 mb-6">
                            <CheckCircle className="text-green-500" /> The Micropost Way
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-lg text-on-surface">
                                <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Viral Frameworks:</span> PAS, AIDA, and Storytelling modes.
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface">
                                <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Multi-platform:</span> Twitter, LinkedIn, and Threads.
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface">
                                <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Idea to Image:</span> Generate visuals on the fly.
                            </li>
                            <li className="flex gap-3 text-lg text-on-surface">
                                <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Actual Growth:</span> Consistent posting = visibility.
                            </li>
                        </ul>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
