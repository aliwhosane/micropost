"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, PenTool, Sliders, FileText, LogOut,
  Sparkles, Flame, Clapperboard, GalleryHorizontal,
  ChevronDown, Wrench, Command
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ClientSwitcher } from "@/components/dashboard/ClientSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const toolSubRoutes = ["/dashboard/trends", "/dashboard/shortsmaker", "/dashboard/carousel", "/tools"];

const mainNavigation = [
    { name: "Today", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Posts", href: "/dashboard/posts", icon: FileText },
    { name: "Topics", href: "/dashboard/topics", icon: PenTool },
];

const toolItems = [
    { name: "TrendSurfer", href: "/dashboard/trends", icon: Flame, description: "Find viral angles" },
    { name: "ShortsMaker", href: "/dashboard/shortsmaker", icon: Clapperboard, description: "Turn posts into videos" },
    { name: "Carousel Maker", href: "/dashboard/carousel", icon: GalleryHorizontal, description: "Build LinkedIn carousels" },
    { name: "Free Tools", href: "/tools", icon: Sparkles, description: "Bio optimizer & more" },
];

const bottomNavigation = [
    { name: "Settings", href: "/dashboard/settings", icon: Sliders },
];

function isToolsSubRoute(pathname: string) {
    return toolSubRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function Sidebar() {
    const pathname = usePathname();
    const isOnToolsRoute = isToolsSubRoute(pathname);
    const [isToolsOpen, setIsToolsOpen] = useState(isOnToolsRoute);

    // Auto-expand when navigating to a tools sub-route
    useEffect(() => {
        if (isOnToolsRoute) {
            setIsToolsOpen(true);
        }
    }, [isOnToolsRoute]);

    function getIsActive(item: { href: string; exact?: boolean }) {
        if (item.exact) return pathname === item.href;
        return pathname === item.href || pathname.startsWith(item.href + "/");
    }

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

                        {/* Main nav items */}
                        {mainNavigation.map((item) => {
                            const isActive = getIsActive(item);
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

                        {/* Tools expandable section */}
                        <div className="mb-2">
                            <button
                                onClick={() => setIsToolsOpen((prev) => !prev)}
                                className={cn(
                                    "w-full flex items-center h-12 rounded-2xl text-base font-medium transition-all duration-300 whitespace-nowrap px-4",
                                    isOnToolsRoute
                                        ? "bg-primary/10 text-primary-dark shadow-sm hover:bg-primary/20"
                                        : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                                )}
                            >
                                <div className={cn("p-2 rounded-xl mr-3", isOnToolsRoute ? "bg-primary/20" : "bg-transparent")}>
                                    <Wrench className={cn("h-5 w-5", isOnToolsRoute ? "text-primary" : "text-on-surface-variant")} />
                                </div>
                                <span className="flex-1 text-left">Tools</span>
                                <motion.div
                                    animate={{ rotate: isToolsOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <ChevronDown className="h-4 w-4 text-on-surface-variant" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isToolsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 pl-4 border-l-2 border-outline-variant/20 space-y-1 py-2">
                                            {toolItems.map((tool) => {
                                                const isActive = getIsActive(tool);
                                                return (
                                                    <Link key={tool.name} href={tool.href}>
                                                        <div className={cn(
                                                            "flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                                            isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : "text-on-surface-variant hover:bg-surface-variant/50"
                                                        )}>
                                                            <tool.icon className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-medium">{tool.name}</p>
                                                                <p className="text-xs text-on-surface-variant/70 leading-tight">{tool.description}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom nav items (Settings) */}
                        {bottomNavigation.map((item) => {
                            const isActive = getIsActive(item);
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
                        <button
                            onClick={() => {
                                window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant/50 hover:text-on-surface-variant transition-colors w-full rounded-lg mb-2"
                        >
                            <Command className="w-3 h-3" />
                            Keyboard shortcuts
                        </button>
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
