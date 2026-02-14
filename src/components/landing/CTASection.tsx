"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="py-24 px-6 bg-primary text-on-primary text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/20 blur-[150px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto relative z-10 space-y-8"
            >
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Ready to dominate your niche?</h2>
                <p className="text-xl text-primary-container/90 max-w-2xl mx-auto">
                    Join 5,000+ creators using Micropost to automate their growth.
                    <br />
                    <span className="opacity-80 text-lg">No credit card required. Free basic tier available.</span>
                </p>
                <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/login">
                        <Button size="lg" variant="tonal" className="h-16 px-10 text-xl w-full sm:w-auto font-bold shadow-xl shadow-black/20 hover:scale-105 transition-transform">
                            Start for Free
                        </Button>
                    </Link>
                    <a href="https://calendly.com/a-husen21/introduction-call" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="text" className="h-16 px-10 text-xl w-full sm:w-auto text-on-primary hover:bg-on-primary/10 hover:text-on-primary">
                            Book a Demo
                        </Button>
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
