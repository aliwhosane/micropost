"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Save,
  Timer,
  Mail,
  PenLine,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AutoApproveTabProps {
  initialEnabled?: boolean;
  initialDelay?: number; // hours
  initialPlatforms?: string[];
}

const DELAY_OPTIONS = [
  { value: 1, label: "1h" },
  { value: 6, label: "6h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
] as const;

const PLATFORM_OPTIONS = [
  { id: "twitter", label: "Twitter / X", color: "#1DA1F2" },
  { id: "linkedin", label: "LinkedIn", color: "#0077b5" },
  { id: "threads", label: "Threads", color: "var(--on-surface)" },
] as const;

const SAFETY_ITEMS = [
  {
    icon: XCircle,
    text: "You can always reject a post before it auto-publishes",
  },
  {
    icon: PenLine,
    text: "Editing a post resets the auto-publish timer",
  },
  {
    icon: Mail,
    text: "You\u2019ll receive an email notification 1 hour before auto-publish",
  },
] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export function AutoApproveTab({
  initialEnabled = false,
  initialDelay = 24,
  initialPlatforms = [],
}: AutoApproveTabProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [delay, setDelay] = useState(initialDelay);
  const [platforms, setPlatforms] = useState<string[]>(initialPlatforms);
  const [saving, setSaving] = useState(false);

  function togglePlatform(id: string) {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    setSaving(true);
    // Simulate server action
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Automation settings saved");
  }

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">
            Automation
          </h3>
          <p className="text-sm text-on-surface-variant">
            Configure automatic publishing for AI-generated posts.
          </p>
        </div>
      </div>

      {/* ── Hero / Toggle Card ──────────────────────────────────────────── */}
      <Card className="overflow-hidden border-outline-variant/30 shadow-sm bg-surface">
        <CardHeader className="border-b border-outline-variant/10 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Auto-Publish
              </CardTitle>
              <CardDescription className="mt-1 max-w-lg">
                When enabled, your AI ghostwriter will automatically publish
                approved drafts without manual review.
              </CardDescription>
            </div>

            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={cn(
                "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                enabled ? "bg-primary" : "bg-surface-variant"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200",
                  enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Warning banner */}
          <motion.div
            initial={false}
            animate={{ opacity: enabled ? 1 : 0.6 }}
            className={cn(
              "mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
              enabled
                ? "bg-warning/10 text-warning"
                : "bg-surface-variant/30 text-on-surface-variant"
            )}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {enabled
                ? "Posts will go live without you reviewing them first."
                : "Auto-publish is currently disabled. All posts require manual review."}
            </span>
          </motion.div>
        </CardHeader>

        {/* ── Expanded Configuration ──────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {enabled && (
            <motion.div
              key="config"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="space-y-8 p-8">
                {/* ── Delay Selector ──────────────────────────────────── */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <Timer className="w-4 h-4 text-primary" />
                    Publish after
                  </label>
                  <p className="text-xs text-on-surface-variant">
                    Posts will auto-publish after this delay unless you edit or
                    reject them.
                  </p>

                  <div className="flex gap-2">
                    {DELAY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDelay(opt.value)}
                        className={cn(
                          "relative rounded-full px-5 py-2 text-sm font-medium transition-all",
                          delay === opt.value
                            ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                            : "bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant/60"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Platform Checkboxes ─────────────────────────────── */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Platforms
                  </label>
                  <p className="text-xs text-on-surface-variant">
                    Choose which platforms auto-publish applies to.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PLATFORM_OPTIONS.map((plat) => {
                      const active = platforms.includes(plat.id);
                      return (
                        <button
                          key={plat.id}
                          type="button"
                          onClick={() => togglePlatform(plat.id)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                            active
                              ? "border-primary/40 bg-primary/5 text-on-surface"
                              : "border-outline-variant/20 bg-surface-variant/10 text-on-surface-variant hover:bg-surface-variant/20"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all",
                              active
                                ? "border-primary bg-primary"
                                : "border-outline-variant"
                            )}
                          >
                            {active && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-on-primary" />
                            )}
                          </span>
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: plat.color }}
                          />
                          {plat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Preview Card ────────────────────────────────────── */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-on-surface">
                    Preview
                  </p>
                  <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-variant/10 px-5 py-4 flex items-center gap-3 text-sm text-on-surface-variant">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      Auto-publishes in{" "}
                      <strong className="text-on-surface">
                        {delay === 1 ? "1 hour" : `${delay} hours`}
                      </strong>{" "}
                      unless edited
                    </span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Safety Features ─────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-outline-variant/30 shadow-sm bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Safety Guardrails
          </CardTitle>
          <CardDescription className="mt-1">
            Built-in protections to keep you in control.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          {SAFETY_ITEMS.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-xl bg-surface-variant/10 px-4 py-3 text-sm text-on-surface-variant"
            >
              <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>{item.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Save Button ─────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <Button
          variant="filled"
          size="lg"
          onClick={handleSave}
          isLoading={saving}
          className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
