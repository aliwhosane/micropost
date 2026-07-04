"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Twitter, Linkedin, AtSign, List, CalendarDays } from "lucide-react";
import { Suspense, useCallback } from "react";

const PLATFORMS = [
  { value: "all", label: "All Platforms", icon: null },
  { value: "TWITTER", label: "Twitter", icon: Twitter },
  { value: "LINKEDIN", label: "LinkedIn", icon: Linkedin },
  { value: "THREADS", label: "Threads", icon: AtSign },
] as const;

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "approved", label: "Approved" },
  { value: "failed", label: "Failed" },
] as const;

const VIEWS = [
  { value: "list", label: "List", icon: List },
  { value: "calendar", label: "Calendar", icon: CalendarDays },
] as const;

function FilterBarInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePlatform = searchParams.get("platform") || "all";
  const activeStatus = searchParams.get("status") || "all";
  const activeView = searchParams.get("view") || "list";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || (key === "view" && value === "list")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-lg py-3 -mx-1 px-1">
      <div className="flex flex-wrap items-center gap-2">
        {/* Platform pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PLATFORMS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateFilter("platform", value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium",
                "transition-all duration-200 cursor-pointer select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                activePlatform === value
                  ? "bg-primary text-on-primary shadow-sm shadow-primary/25"
                  : "bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-outline-variant/30 mx-1" />

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUSES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateFilter("status", value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium",
                "transition-all duration-200 cursor-pointer select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                activeStatus === value
                  ? "bg-primary text-on-primary shadow-sm shadow-primary/25"
                  : "bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-outline-variant/30 mx-1" />

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-surface-variant/30">
          {VIEWS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateFilter("view", value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "transition-all duration-200 cursor-pointer select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                activeView === value
                  ? "bg-primary text-on-primary shadow-sm shadow-primary/25"
                  : "text-on-surface-variant hover:bg-surface-variant/80"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PostsFilterBar() {
  return (
    <Suspense fallback={null}>
      <FilterBarInner />
    </Suspense>
  );
}
