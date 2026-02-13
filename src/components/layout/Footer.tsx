import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-outline-variant/20 bg-surface">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                        <BrandLogo size="md" />
                        <span className="text-sm text-on-surface-variant">© 2026 micropost-ai.com</span>
                    </div>
                    <p className="text-xs text-on-surface-variant max-w-xs">
                        The AI social media ghostwriter that helps you grow on Twitter and LinkedIn with zero effort.
                    </p>
                </div>

                <nav aria-label="Footer Navigation" className="flex flex-wrap gap-8 text-sm text-on-surface-variant justify-center md:justify-end">
                    <div className="flex flex-col gap-3">
                        <span className="font-semibold text-on-surface">Platform</span>
                        <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="font-semibold text-on-surface">Legal</span>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="font-semibold text-on-surface">Connect</span>
                        <a href="https://twitter.com/micropostai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter / X</a>
                        <a href="mailto:support@micropost-ai.com" className="hover:text-primary transition-colors">Support</a>
                    </div>
                </nav>
            </div>
        </footer>
    );
}
