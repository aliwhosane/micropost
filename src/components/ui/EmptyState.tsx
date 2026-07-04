"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  variant?: "default" | "celebration"; // celebration = "All caught up!"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-5",
        variant === "celebration"
          ? "bg-secondary-container"
          : "bg-surface-variant/50"
      )}>
        <Icon className={cn(
          "w-8 h-8",
          variant === "celebration"
            ? "text-on-secondary-container"
            : "text-on-surface-variant/50"
        )} />
      </div>
      <h3 className={cn(
        "text-lg font-semibold mb-1.5",
        variant === "celebration" ? "text-on-surface" : "text-on-surface-variant"
      )}>
        {title}
      </h3>
      <p className="text-sm text-on-surface-variant/70 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-5">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="filled" size="sm">{actionLabel}</Button>
            </Link>
          ) : (
            <Button variant="filled" size="sm" onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
