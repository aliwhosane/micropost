import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-outline-variant/20 bg-surface">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <BrandLogo size="md" />
                    <span className="text-sm text-on-surface-variant">© 2026</span>
                </div>
                <div className="flex gap-8 text-sm text-on-surface-variant cursor-pointer">
                    <span className="hover:text-primary transition-colors">Privacy</span>
                    <span className="hover:text-primary transition-colors">Terms</span>
                    <span className="hover:text-primary transition-colors">Twitter</span>
                    <span className="hover:text-primary transition-colors">Support</span>
                </div>
            </div>
        </footer>
    );
}
