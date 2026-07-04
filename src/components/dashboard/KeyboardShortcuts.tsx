"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/motion";

const navigationShortcuts = [
  { keys: ["G", "H"], description: "Go to Dashboard" },
  { keys: ["G", "P"], description: "Go to Posts" },
  { keys: ["G", "T"], description: "Go to Topics" },
  { keys: ["G", "S"], description: "Go to Settings" },
];

const actionShortcuts = [
  { keys: ["N"], description: "New post (focus composer)" },
  { keys: ["?"], description: "Toggle this help" },
  { keys: ["Esc"], description: "Close modal / blur input" },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[24px] h-6 px-1.5",
        "rounded-md bg-surface-variant text-on-surface-variant text-xs font-mono",
        "border border-outline-variant shadow-sm"
      )}
    >
      {children}
    </kbd>
  );
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);
  const [gPressed, setGPressed] = useState(false);

  useEffect(() => {
    let gTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping && e.key !== "Escape") return;

      // ? — toggle help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Escape — close help or blur
      if (e.key === "Escape") {
        if (showHelp) {
          setShowHelp(false);
        } else {
          (document.activeElement as HTMLElement)?.blur();
        }
        return;
      }

      // G then X navigation
      if (e.key === "g" && !gPressed && !e.ctrlKey && !e.metaKey) {
        setGPressed(true);
        gTimeout = setTimeout(() => setGPressed(false), 1000);
        return;
      }

      if (gPressed) {
        setGPressed(false);
        clearTimeout(gTimeout);
        switch (e.key) {
          case "h":
            router.push("/dashboard");
            break;
          case "p":
            router.push("/dashboard/posts");
            break;
          case "t":
            router.push("/dashboard/topics");
            break;
          case "s":
            router.push("/dashboard/settings");
            break;
        }
        return;
      }

      // N — focus composer
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && pathname === "/dashboard") {
        e.preventDefault();
        const composer = document.querySelector(
          'textarea[placeholder*="Draft"], textarea[placeholder*="create"], textarea[placeholder*="draft"]'
        ) as HTMLTextAreaElement;
        composer?.focus();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, [router, pathname, showHelp, gPressed]);

  return (
    <AnimatePresence>
      {showHelp && (
        <>
          {/* Overlay */}
          <motion.div
            {...MOTION.fadeIn}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setShowHelp(false)}
          />

          {/* Modal */}
          <motion.div
            {...MOTION.fadeInScale}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <Command className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-on-surface">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Navigation group */}
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                    Navigation
                  </h3>
                  <div className="space-y-2.5">
                    {navigationShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.description}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-on-surface">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && (
                                <span className="text-xs text-on-surface-variant/50 mx-0.5">
                                  then
                                </span>
                              )}
                              <Kbd>{key}</Kbd>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions group */}
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                    Actions
                  </h3>
                  <div className="space-y-2.5">
                    {actionShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.description}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-on-surface">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <Kbd key={i}>{key}</Kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-variant/20">
                <p className="text-xs text-on-surface-variant/60 text-center">
                  Press <Kbd>?</Kbd> or <Kbd>Esc</Kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
