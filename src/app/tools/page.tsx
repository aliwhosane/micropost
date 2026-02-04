import Link from "next/link";
import { ArrowRight, Eye, Sparkles, Target, Youtube, User, Zap, Send, Heart, Maximize2, Layers, Magnet, UserCog, Eraser, Wand2, Languages, MessageCircle, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Social Media Tools | Micropost AI",
    description: "Simple, powerful utilities to level up your social game. LinkedIn Previewer, Professional Translator, and more.",
};

export default function ToolsPage() {
    return (
        <div className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full -z-10" />

            <div className="text-center mb-20 space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface">
                    Free Social Media Tools
                </h1>
                <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
                    Simple, powerful utilities to level up your social game.
                    <span className="block mt-2 text-primary font-medium">No sign-up required.</span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Tool 0: Idea to Posts (New) */}
                <Link href="/tools/idea-to-post" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-amber-600 transition-colors">Idea to Posts</CardTitle>
                            <CardDescription>
                                Turn one raw thought into a week of content. Generate posts for LinkedIn, Twitter, and Threads.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-amber-600">
                                Generate Content <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                {/* Tool 1: LinkedIn Previewer */}
                <Link href="/tools/linkedin-previewer" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Eye className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-primary transition-colors">LinkedIn Previewer</CardTitle>
                            <CardDescription>
                                See exactly where your post gets cut off. Optimize your hook before you hit publish.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-primary">
                                Try it now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Tool 2: Professional Translator */}
                <Link href="/tools/professional-translator" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-secondary/50 transition-all hover:shadow-lg hover:shadow-secondary/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                                <Languages className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-secondary transition-colors">Professional Translator</CardTitle>
                            <CardDescription>
                                Turn your raw thoughts into office-safe corporate speak. Powered by AI.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-secondary">
                                Try it now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Tool 3: Content Pillar Generator */}
                <Link href="/tools/content-pillar-generator" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-tertiary/50 transition-all hover:shadow-lg hover:shadow-tertiary/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-4 group-hover:scale-110 transition-transform">
                                <Layers className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-tertiary transition-colors">Content Pillar Generator</CardTitle>
                            <CardDescription>
                                Get 5 unique content pillars and topic ideas for any niche in seconds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-tertiary">
                                Try it now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Tool 4: YouTube Summarizer */}
                <Link href="/tools/youtube-summarizer" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                                <Youtube className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-red-600 transition-colors">YouTube to Thread</CardTitle>
                            <CardDescription>
                                Turn long videos into viral Twitter threads. Paste a URL, get a thread.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-red-600">
                                Summarize Video <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                {/* Tool 5: Viral Hook Generator */}
                <Link href="/tools/viral-hooks" className="group">
                    <Card className="h-full border-outline-variant/40 bg-surface hover:border-purple-600/50 transition-all hover:shadow-lg hover:shadow-purple-600/5">
                        <CardHeader>
                            <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                <Magnet className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors">Viral Hook Generator</CardTitle>
                            <CardDescription>
                                Stop the scroll. Generate 10+ psychologically triggered hooks for any topic.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-purple-600">
                                Generate Hooks <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/bio-optimizer" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 relative overflow-hidden border-outline-variant/40">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <UserCog className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2 text-2xl group-hover:text-blue-600 transition-colors">
                                AI Bio Optimizer
                            </CardTitle>
                            <CardDescription>
                                Craft the perfect social media bio for Twitter, LinkedIn, and Instagram.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-blue-600">
                                Optimize Bio <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/buzzword-killer" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-yellow-500/50 relative overflow-hidden border-outline-variant/40">
                        <CardHeader>
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Eraser className="w-6 h-6 text-yellow-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2 text-2xl group-hover:text-yellow-600 transition-colors">
                                Buzzword Killer
                            </CardTitle>
                            <CardDescription>
                                Identify toxic corporate jargon and replace it with punchy, human alternatives.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-yellow-600">
                                Kill Jargon <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/cold-dm-writer" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-indigo-500/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Send className="w-6 h-6 text-indigo-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2">
                                Cold DM Writer
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-on-surface-variant">
                                Generate 3 high-response cold outreach scripts to pitch your services.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/feature-to-benefit" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-pink-500/50 relative overflow-hidden border-outline-variant/40">
                        <CardHeader>
                            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Wand2 className="w-6 h-6 text-pink-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2 text-2xl group-hover:text-pink-600 transition-colors">
                                Feature to Benefit
                            </CardTitle>
                            <CardDescription>
                                Turn boring technical specs into irresistible emotional marketing copy.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="text" className="pl-0 group-hover:text-pink-600">
                                Convert Copy <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/tweet-to-linkedin-expander" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-blue-700/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-700/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Maximize2 className="w-6 h-6 text-blue-700" />
                            </div>
                            <CardTitle className="flex items-center gap-2">
                                Tweet to LinkedIn
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-700" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-on-surface-variant">
                                Expand short tweets into high-performing, formatted LinkedIn posts.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/comment-reply-assistant" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-green-500/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2">
                                Reply Assistant
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-green-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-on-surface-variant">
                                Engagement is key. Generate funny, grateful, or engaging replies instantly.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tools/youtube-thumbnail-title" className="block group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-red-600/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <ImageIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <CardTitle className="flex items-center gap-2">
                                Thumbnail Text
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-on-surface-variant">
                                Get more clicks. Generate short, punchy text overlays for your video thumbnails.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
