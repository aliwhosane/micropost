import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
    return (
        <header className="px-6 h-16 flex items-center justify-between border-b border-outline-variant/20 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
            <div className="flex items-center gap-2">
                <BrandLogo size="lg" />
            </div>
            <div className="flex gap-4 items-center">
                <Link href="/login" className="hidden md:block">
                    <Button variant="text" size="sm">Log in</Button>
                </Link>
                <Link href="/login">
                    <Button size="sm" className="rounded-full">Get Started</Button>
                </Link>
            </div>
        </header>
    );
}
