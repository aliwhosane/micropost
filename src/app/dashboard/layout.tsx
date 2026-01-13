"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Sparkles, LayoutDashboard, PenTool, Settings, User, LogOut, Sliders, FileText } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Posts", href: "/dashboard/posts", icon: FileText },
        { name: "Topics", href: "/dashboard/topics", icon: PenTool },
        { name: "Settings", href: "/dashboard/settings", icon: Sliders },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar - Desktop */}
            <aside className="w-64 border-r border-outline-variant/20 bg-surface hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-outline-variant/10">
                    <Link href="/dashboard">
                        <BrandLogo />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} className="block">
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-outline-variant/20 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-on-surface">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-medium">
                            JD
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
