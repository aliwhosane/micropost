"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Plus, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ComposerSheet } from "@/components/dashboard/ComposerSheet";

const tabs = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Posts", href: "/dashboard/posts", icon: FileText },
  { name: "Create", href: "/dashboard", icon: Plus, isCreate: true },
  { name: "Settings", href: "/dashboard/settings", icon: Sliders },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around backdrop-blur-xl bg-surface/80 border-t border-outline-variant/20 px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]"
      >
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);

          if (tab.isCreate) {
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setIsComposerOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 -mt-4 relative"
                aria-label="Create new post"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary shadow-md shadow-primary/30"
                >
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </motion.div>
                <span className="text-[10px] font-medium text-on-surface-variant mt-0.5">
                  {tab.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[64px]"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-xl transition-colors duration-200",
                    isActive && "bg-primary/12"
                  )}
                >
                  <tab.icon
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-primary" : "text-on-surface-variant"
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-primary" : "text-on-surface-variant"
                  )}
                >
                  {tab.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <ComposerSheet
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </>
  );
}
