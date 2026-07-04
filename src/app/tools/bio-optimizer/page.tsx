"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BioOptimizer } from "@/components/tools/BioOptimizer";

export default function BioOptimizerPage() {
    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <BioOptimizer />
        </div>
    );
}
