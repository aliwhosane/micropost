"use client";

import { usePathname } from "next/navigation";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "Today",
  "/dashboard/posts": "Posts",
  "/dashboard/topics": "Topics",
  "/dashboard/settings": "Settings",
  "/dashboard/trends": "TrendSurfer",
  "/dashboard/shortsmaker": "ShortsMaker",
  "/dashboard/carousel": "Carousel Maker",
  "/dashboard/analytics": "Analytics",
};

export function PageTitle() {
  const pathname = usePathname();

  // Find the most specific match
  const title = TITLE_MAP[pathname] ||
    Object.entries(TITLE_MAP)
      .filter(([path]) => pathname.startsWith(path) && path !== "/dashboard")
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ||
    "Dashboard";

  return (
    <h1 className="text-2xl font-bold text-on-surface tracking-tight">
      {title}
    </h1>
  );
}
