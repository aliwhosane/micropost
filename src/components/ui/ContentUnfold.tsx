"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContentUnfoldProps {
  content: string;
  speed?: number; // characters per second, default 60
  onComplete?: () => void;
  className?: string;
  as?: "p" | "span" | "div"; // wrapper element
  cursor?: boolean; // show blinking cursor at end
}

export function ContentUnfold({
  content,
  speed = 60,
  onComplete,
  className,
  as: Component = "p",
  cursor = true,
}: ContentUnfoldProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(content);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref fresh to avoid re-triggering the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset when content changes
    if (content !== contentRef.current) {
      contentRef.current = content;
      setDisplayedChars(0);
      setIsComplete(false);
    }

    // Don't start interval if already complete
    if (displayedChars >= content.length) {
      if (!isComplete) {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
      return;
    }

    const intervalMs = 1000 / speed;

    intervalRef.current = setInterval(() => {
      setDisplayedChars((prev) => {
        // Find the next word boundary — reveal up to the next space/newline
        let next = prev + 1;
        while (
          next < content.length &&
          content[next] !== " " &&
          content[next] !== "\n"
        ) {
          next++;
        }

        if (next >= content.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return content.length;
        }
        return next;
      });
    }, intervalMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [content, speed, displayedChars, isComplete]);

  const displayedText = content.slice(0, displayedChars);

  return (
    <Component className={cn("whitespace-pre-wrap", className)}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom"
        />
      )}
    </Component>
  );
}

export function ContentUnfoldSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, width: "0%" }}
          animate={{
            opacity: 1,
            width: i === lines - 1 ? "60%" : "100%",
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.15,
            ease: "easeOut",
          }}
          className="h-4 rounded-full bg-surface-variant/50"
        />
      ))}
    </div>
  );
}
