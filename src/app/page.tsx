"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Mail,
  Share2,
  PenTool,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Check,
  Eye,
  Target,
  Youtube,
  User,
  Send
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40 } as any }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* H E R O   S E C T I O N */}
        <section className="relative pt-32 pb-48 px-6 lg:px-8">
          {/* Background Ambient Effects */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-tertiary/20 blur-[100px] rounded-full -z-10" />

          <motion.div
            className="max-w-5xl mx-auto text-center space-y-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>v2.5 is live: Smarter, Faster, More Human.</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold tracking-tighter text-on-surface leading-[1.05]"
              variants={item}
            >
              Stop Writing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:200%_auto] animate-gradient">
                Start Growing.
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed"
              variants={item}
            >
              The AI ghostwriter that learns your voice, fills your content calendar in minutes, and posts for you. <span className="text-on-surface font-semibold">Finally, consistency without the burnout.</span>
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Link href="/login">
                <Button size="lg" className="rounded-full h-16 px-12 text-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Generate My First Post <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant mt-2 sm:mt-0">
                <ShieldCheck className="h-4 w-4" /> No credit card required
              </div>
            </motion.div>

            {/* Social Proof Mini-Bar */}
            <motion.div variants={item} className="pt-16 grayscale opacity-60 flex justify-center gap-12 items-center flex-wrap">
              {/* Placeholders for logos (Text for now) */}
              <span className="text-xl font-bold font-mono">X (Twitter)</span>
              <span className="text-xl font-bold font-mono">LinkedIn</span>
              <span className="text-xl font-bold font-mono">ProductHunt</span>
              <span className="text-xl font-bold font-mono">IndieHackers</span>
            </motion.div>
          </motion.div>
        </section>

        {/* P R O B L E M   V S   S O L U T I O N */}
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
                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Infinite Ideas:</span> We suggest topics based on your niche.
                  </li>
                  <li className="flex gap-3 text-lg text-on-surface">
                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Consistency Solved:</span> Scheduled drafts waiting for you.
                  </li>
                  <li className="flex gap-3 text-lg text-on-surface">
                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Human Sounding:</span> Tuned to remove "AI fluff".
                  </li>
                  <li className="flex gap-3 text-lg text-on-surface">
                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Actual Growth:</span> Consistent posting = visibility.
                  </li>
                </ul>
              </motion.div>

            </div>
          </div>
        </section>

        {/* F E A T U R E   D E E P   D I V E */}
        <section className="py-32 px-6" ref={targetRef}>
          <motion.div className="max-w-6xl mx-auto space-y-32">

            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div style={{ opacity, scale }} className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
                <div className="bg-surface border border-outline-variant/40 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4 font-mono text-sm opacity-80">
                    <p className="text-primary">{">"} Analyzing writing style...</p>
                    <p className="text-tertiary">{">"} Detected: "Witty, Professional, Concise"</p>
                    <p className="text-on-surface">Generating 5 post variations...</p>
                  </div>
                </div>
              </motion.div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">AI That Doesn't Sound Like AI.</h2>
                <p className="text-xl text-on-surface-variant leading-relaxed">
                  Most tools sound robotic. We use advanced prompting pipelines to mimic <i>your</i> unique tone. Casual, professional, or chaotic-good — we adapt to you.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Your Morning Brief.</h2>
                <p className="text-xl text-on-surface-variant leading-relaxed">
                  Wake up to a fresh batch of drafted posts in your dashboard (or inbox).
                  One click to <b>Approve</b>, <b>Edit</b>, or <b>Regenerate</b>. You stay in control, but without the effort.
                </p>
              </div>
              <motion.div style={{ opacity, scale }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 to-transparent blur-3xl -z-10 rounded-full" />
                <div className="bg-surface border border-outline-variant/40 rounded-2xl p-6 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-4 border-b border-outline-variant/20 pb-4">
                    <Mail className="text-secondary h-6 w-6" />
                    <div>
                      <div className="font-bold">Your Daily Drafts are Ready</div>
                      <div className="text-xs opacity-60">8:00 AM • Micropost AI</div>
                    </div>
                  </div>
                  <div className="h-2 w-3/4 bg-outline-variant/20 rounded mb-2" />
                  <div className="h-2 w-full bg-outline-variant/20 rounded mb-2" />
                  <div className="h-2 w-1/2 bg-outline-variant/20 rounded" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 w-20 bg-primary/20 rounded" />
                    <div className="h-8 w-20 bg-outline-variant/20 rounded" />
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </section>

        {/* F R E E   T O O L S */}
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
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">LinkedIn Previewer</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    See exactly where your post gets cut off. Optimize your hook before you hit publish.
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm mt-auto">
                    Try it free <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>

              {/* Tool 2: Professional Translator */}
              <Link href="/tools/professional-translator">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Professional Translator</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Turn your raw thoughts into office-safe corporate speak. Powered by AI.
                  </p>
                  <div className="flex items-center text-secondary font-medium text-sm mt-auto">
                    Translate Text <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>

              {/* Tool 3: Content Pillar Generator */}
              <Link href="/tools/content-pillar-generator">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-4 group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Content Pillar Generator</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Get 5 unique content pillars and topic ideas for any niche in seconds.
                  </p>
                  <div className="flex items-center text-tertiary font-medium text-sm mt-auto">
                    Generate Pillars <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>

              {/* Tool 4: YouTube Summarizer */}
              <Link href="/tools/youtube-summarizer">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                    <Youtube className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">YouTube to Thread</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Turn long videos into viral Twitter threads. Paste a URL, get a thread.
                  </p>
                  <div className="flex items-center text-red-600 font-medium text-sm mt-auto">
                    Summarize Video <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
              {/* Tool 5: Viral Hook Generator */}
              <Link href="/tools/viral-hooks">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Viral Hook Generator</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Stop the scroll. Generate 10+ psychologically triggered hooks for any topic.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium text-sm mt-auto">
                    Generate Hooks <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
              <Link href="/tools/bio-optimizer">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI Bio Optimizer</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Craft the perfect social media bio for Twitter, LinkedIn, and Instagram.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                    Optimize Bio <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
              <Link href="/tools/buzzword-killer">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Buzzword Killer</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Identify toxic corporate jargon and replace it with punchy, human alternatives.
                  </p>
                  <div className="flex items-center text-yellow-600 font-medium text-sm mt-auto">
                    Kill Jargon <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
              <Link href="/tools/cold-dm-writer">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all cursor-pointer group h-full"
                >
                  <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cold DM Writer</h3>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Generate 3 high-response cold outreach scripts to pitch your services.
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto">
                    Write DM <ArrowRight className="ml-1 h-4 w-4" />
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

        {/* P R I C I N G */}
        <section className="py-24 px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-on-surface">Fair & Simple Pricing</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                We believe in accessibility. Choose the plan that makes sense for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly - Pay What You Want */}
              <Card className="border-outline-variant/40 bg-surface h-full flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-on-surface-variant">Community Plan</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-on-surface">Pay what you want</span>
                    <span className="text-on-surface-variant ml-2">/ month</span>
                  </div>
                  <CardDescription className="pt-2">
                    Value-based pricing for everyone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-start gap-3 text-on-surface-variant">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Full access to all AI features</span>
                    </li>
                    <li className="flex items-start gap-3 text-on-surface-variant">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Unlimited topic generation</span>
                    </li>
                    <li className="flex items-start gap-3 text-on-surface-variant">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href="/login">
                    <Button variant="outlined" className="w-full h-12 text-base">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Lifetime Deal */}
              <Card className="border-primary bg-primary/5 h-full flex flex-col relative overflow-hidden transform md:scale-105 shadow-xl">
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-xl">
                  BEST VALUE
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary">Founding Member</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-on-surface">$999</span>
                    <span className="text-on-surface-variant ml-2">/ one-time</span>
                  </div>
                  <CardDescription className="pt-2">
                    Pay once, own it forever.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-start gap-3 text-on-surface">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span><b>Lifetime access</b> to Micropost AI</span>
                    </li>
                    <li className="flex items-start gap-3 text-on-surface">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>All future updates included</span>
                    </li>
                    <li className="flex items-start gap-3 text-on-surface">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Priority support channel</span>
                    </li>
                    <li className="flex items-start gap-3 text-on-surface">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href="/login">
                    <Button variant="filled" className="w-full h-12 text-base shadow-primary/25 shadow-lg">
                      Get Lifetime Access
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* C T A   S E C T I O N */}
        <section className="py-24 px-6 bg-primary text-on-primary text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto relative z-10 space-y-8"
          >
            <h2 className="text-5xl font-bold tracking-tight">Ready to dominate your niche?</h2>
            <p className="text-xl text-primary-container/90">
              Join the beta today. No credit card required. 14 days free trial.
            </p>
            <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" variant="tonal" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Start for Free
                </Button>
              </Link>
              <Button size="lg" variant="text" className="h-14 px-8 text-lg w-full sm:w-auto text-on-primary hover:bg-on-primary/10 hover:text-on-primary">
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// Add custom animation styles
