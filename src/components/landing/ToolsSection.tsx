"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    Languages,
    Layers,
    Youtube,
    Magnet,
    UserCog,
    Eraser,
    Send,
    Wand2,
    Maximize2,
    MessageCircle,
    Image as ImageIcon
} from "lucide-react";

export function ToolsSection() {
    return (
        <section className="py-24 px-6 bg-surface-variant/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold text-on-surface">Free Tools for Creators</h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto">
                        Don't just take our word for it. Try these free utilities to boost your social game immediately.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Tool 1: LinkedIn Previewer */}
                    <Link href="/tools/linkedin-previewer">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Eye className="h-24 w-24 -mr-8 -mt-8 text-primary" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                <Eye className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">LinkedIn Previewer</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                See exactly where your post gets cut off. Optimize your hook before you hit publish.
                            </p>
                            <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Try it free <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Tool 2: Professional Translator */}
                    <Link href="/tools/professional-translator">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-secondary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Languages className="h-24 w-24 -mr-8 -mt-8 text-secondary" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/10">
                                <Languages className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Professional Translator</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Turn your raw thoughts into office-safe corporate speak. Powered by AI.
                            </p>
                            <div className="flex items-center text-secondary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Translate Text <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Tool 3: Content Pillar Generator */}
                    <Link href="/tools/content-pillar-generator">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-tertiary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Layers className="h-24 w-24 -mr-8 -mt-8 text-tertiary" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-tertiary/20 to-tertiary/5 border border-tertiary/20 rounded-2xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-tertiary/10">
                                <Layers className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Content Pillar Generator</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Get 5 unique content pillars and topic ideas for any niche in seconds.
                            </p>
                            <div className="flex items-center text-tertiary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Generate Pillars <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Tool 4: YouTube Summarizer */}
                    <Link href="/tools/youtube-summarizer">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-red-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Youtube className="h-24 w-24 -mr-8 -mt-8 text-red-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/10">
                                <Youtube className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">YouTube to Thread</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Turn long videos into viral Twitter threads. Paste a URL, get a thread.
                            </p>
                            <div className="flex items-center text-red-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Summarize Video <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    {/* Tool 5: Viral Hook Generator */}
                    <Link href="/tools/viral-hooks">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Magnet className="h-24 w-24 -mr-8 -mt-8 text-purple-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                                <Magnet className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Viral Hook Generator</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Stop the scroll. Generate 10+ psychologically triggered hooks for any topic.
                            </p>
                            <div className="flex items-center text-purple-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Generate Hooks <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/bio-optimizer">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UserCog className="h-24 w-24 -mr-8 -mt-8 text-blue-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                                <UserCog className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Bio Optimizer</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Craft the perfect social media bio for Twitter, LinkedIn, and Instagram.
                            </p>
                            <div className="flex items-center text-blue-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Optimize Bio <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/buzzword-killer">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-yellow-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Eraser className="h-24 w-24 -mr-8 -mt-8 text-yellow-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/10">
                                <Eraser className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Buzzword Killer</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Identify toxic corporate jargon and replace it with punchy, human alternatives.
                            </p>
                            <div className="flex items-center text-yellow-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Kill Jargon <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/cold-dm-writer">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Send className="h-24 w-24 -mr-8 -mt-8 text-indigo-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                                <Send className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Cold DM Writer</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Generate 3 high-response cold outreach scripts to pitch your services.
                            </p>
                            <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Write DM <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/feature-to-benefit">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-pink-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Wand2 className="h-24 w-24 -mr-8 -mt-8 text-pink-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/10">
                                <Wand2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Feature to Benefit</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Turn boring technical specs into irresistible emotional marketing copy.
                            </p>
                            <div className="flex items-center text-pink-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Convert Copy <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/tweet-to-linkedin-expander">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-blue-700/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Maximize2 className="h-24 w-24 -mr-8 -mt-8 text-blue-700" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-700/20 to-blue-700/5 border border-blue-700/20 rounded-2xl flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-700/10">
                                <Maximize2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Tweet to LinkedIn</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Expand short tweets into high-performing, formatted LinkedIn posts.
                            </p>
                            <div className="flex items-center text-blue-700 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Expand Post <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/comment-reply-assistant">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-green-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MessageCircle className="h-24 w-24 -mr-8 -mt-8 text-green-500" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/10">
                                <MessageCircle className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Reply Assistant</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Engagement is key. Generate funny, grateful, or engaging replies instantly.
                            </p>
                            <div className="flex items-center text-green-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Generate Reply <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                    <Link href="/tools/youtube-thumbnail-title">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-red-600/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ImageIcon className="h-24 w-24 -mr-8 -mt-8 text-red-600" />
                            </div>
                            <div className="h-14 w-14 bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-600/10">
                                <ImageIcon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Thumbnail Text</h3>
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                Get more clicks. Generate short, punchy text overlays for your video thumbnails.
                            </p>
                            <div className="flex items-center text-red-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                Generate Text <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                </div>

                <div className="text-center mt-12">
                    <Link href="/tools">
                        <Button variant="outlined" size="lg" className="rounded-full">
                            View All Free Tools
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
