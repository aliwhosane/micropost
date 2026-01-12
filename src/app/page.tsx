"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Mail, Share2, PenTool } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function Home() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } as any }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-outline-variant/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BrandLogo size="lg" />
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="text">Log in</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h1
              className="text-6xl md:text-7xl font-bold tracking-tighter text-on-surface leading-[1.1]"
              variants={item}
            >
              Your Personal AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Social Media Ghostwriter</span>
            </motion.h1>

            <motion.p
              className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
              variants={item}
            >
              Automate your LinkedIn and Twitter presence. We learn your style, generate daily posts on your favorite topics, and email them for your approval.
            </motion.p>

            <motion.div variants={item} className="flex justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                  Start Writing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outlined" size="lg" className="rounded-full h-14 px-10 text-lg">
                View Demo
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-surface-variant/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold text-on-surface">How it works</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">Set it up once, and watch your social presence grow with high-quality, personalized content.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PenTool className="h-8 w-8 text-primary" />}
                title="Define Your Topics"
                description="Tell us what you want to talk about. Tech, Leadership, Design? We've got you covered."
                delay={0.1}
              />
              <FeatureCard
                icon={<Mail className="h-8 w-8 text-primary" />}
                title="Daily Email Digest"
                description="Receive a draft in your inbox every morning. Approve, edit, or reject with one click."
                delay={0.2}
              />
              <FeatureCard
                icon={<Share2 className="h-8 w-8 text-primary" />}
                title="Auto-Publishing"
                description="Once approved, we automatically post to your connected LinkedIn and Twitter accounts."
                delay={0.3}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-on-surface-variant border-t border-outline-variant/20">
        <p>© 2026 Micropost AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-surface">
        <CardHeader>
          <div className="mb-4 p-3 w-fit rounded-xl bg-primary-container text-on-primary-container">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
