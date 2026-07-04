"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ChevronDown, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { signOutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface UserButtonProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function UserButton({ user }: UserButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
        : "U";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-transparent hover:bg-surface-variant/30 hover:border-outline-variant/20 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-8 w-8 rounded-full object-cover border border-primary/20"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-medium border border-outline-variant/10">
                        {initials}
                    </div>
                )}

                <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-on-surface leading-none max-w-[100px] truncate">{user?.name || "User"}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-on-surface-variant transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-outline-variant/20 bg-surface shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-outline-variant/10">
                        <p className="text-sm font-medium text-on-surface">{user?.name || "Member"}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user?.email || ""}</p>
                    </div>

                    <div className="p-2">
                        <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                            <Button variant="text" className="w-full justify-start h-9 px-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                        <Link href="/pricing" onClick={() => setIsOpen(false)}>
                            <Button variant="text" className="w-full justify-start h-9 px-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant/30">
                                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                                Upgrade Plan
                            </Button>
                        </Link>
                        <Button
                            variant="text"
                            onClick={() => {
                                localStorage.removeItem("micropost_onboarding_completed");
                                localStorage.removeItem("micropost_getting_started_dismissed");
                                window.location.reload();
                            }}
                            className="w-full justify-start h-9 px-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Restart Onboarding
                        </Button>
                    </div>

                    <div className="h-px bg-outline-variant/10 my-1" />

                    <div className="p-2">
                        <form action={signOutAction}>
                            <Button variant="text" className="w-full justify-start h-9 px-2 text-error hover:text-error hover:bg-error/10">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
