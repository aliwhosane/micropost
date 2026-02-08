"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PenTool, Sliders, FileText, LogOut, Video, MessageSquare, Linkedin, Youtube, Mail, Sparkles, Flame, Clapperboard } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "TrendSurfer", href: "/dashboard/trends", icon: Flame },
        { name: "Posts", href: "/dashboard/posts", icon: FileText },
        { name: "Topics", href: "/dashboard/topics", icon: PenTool },
        { name: "ShortsMaker", href: "/dashboard/shortsmaker", icon: Clapperboard },
        { name: "Free Tools", href: "/tools", icon: Sparkles },
        { name: "Settings", href: "/dashboard/settings", icon: Sliders },
    ];

    return (
        <aside className="w-64 border-r border-outline-variant/20 bg-surface hidden md:flex flex-col h-screen sticky top-0">
            <div className="h-16 flex items-center px-6 border-b border-outline-variant/10">
                <Link href="/dashboard">
                    <BrandLogo />
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="mb-4">
                    <p className="px-4 text-xs font-medium text-on-surface-variant/50 uppercase tracking-wider mb-2">Platform</p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} className="block mb-1">
                                <Button
                                    variant={isActive ? "tonal" : "text"}
                                    className={cn(
                                        "w-full justify-start",
                                        isActive ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:text-on-surface"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-outline-variant/10">
                <form action={signOutAction}>
                    <Button variant="text" className="w-full justify-start text-on-surface-variant hover:text-error">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign out
                    </Button>
                </form>
            </div>
        </aside>
    );
}
