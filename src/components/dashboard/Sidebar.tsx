"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PenTool, Sliders, FileText, LogOut, Video, MessageSquare, Linkedin, Youtube, Mail, Sparkles, Flame, Clapperboard, BarChart3, GalleryHorizontal } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ClientSwitcher } from "@/components/dashboard/ClientSwitcher";

export function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "TrendSurfer", href: "/dashboard/trends", icon: Flame },
        { name: "Posts", href: "/dashboard/posts", icon: FileText },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Topics", href: "/dashboard/topics", icon: PenTool },
        { name: "ShortsMaker", href: "/dashboard/shortsmaker", icon: Clapperboard },
        { name: "Carousel Maker", href: "/dashboard/carousel", icon: GalleryHorizontal },
        { name: "Free Tools", href: "/tools", icon: Sparkles },
        { name: "Settings", href: "/dashboard/settings", icon: Sliders },
    ];

    return (
        <aside className="w-72 hidden md:flex flex-col h-screen sticky top-0 p-4">
            <div className="bg-surface rounded-[2rem] shadow-sm h-full flex flex-col border border-outline-variant/10">
                <div className="h-auto flex flex-col px-6 pt-8 pb-4 gap-6">
                    <Link href="/dashboard" className="w-fit">
                        <BrandLogo />
                    </Link>
                    <ClientSwitcher />
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="mb-6">
                        <p className="px-6 text-xs font-bold text-primary uppercase tracking-widest mb-4 mt-4 opacity-80">Platform</p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.name} href={item.href} className="block mb-2">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start h-12 rounded-2xl text-base font-medium transition-all duration-300 whitespace-nowrap",
                                            isActive
                                                ? "bg-primary/10 text-primary-dark shadow-sm hover:bg-primary/20"
                                                : "text-on-surface-variant hover:bg-surface-variant/50 hover:pl-5 hover:text-on-surface"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-xl mr-3", isActive ? "bg-primary/20" : "bg-transparent")}>
                                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-on-surface-variant")} />
                                        </div>
                                        {item.name}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="mx-4 mb-4 pt-4 border-t border-outline-variant/10">
                        <form action={signOutAction}>
                            <Button variant="ghost" className="w-full justify-start text-on-surface-variant hover:text-error hover:bg-error/10 rounded-2xl h-12">
                                <LogOut className="mr-3 h-5 w-5" />
                                Sign out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </aside>
    );
}
