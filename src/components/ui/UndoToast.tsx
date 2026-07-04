"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";

interface UndoToastOptions {
  message: string;
  duration?: number; // default 5000ms
  onUndo: () => void | Promise<void>;
  onConfirm: () => void | Promise<void>;
}

export function triggerUndoToast({ message, duration = 5000, onUndo, onConfirm }: UndoToastOptions) {
  let undone = false;

  const toastId = toast(
    () => (
      <UndoToastContent
        message={message}
        duration={duration}
        onUndo={() => {
          undone = true;
          toast.dismiss(toastId);
          onUndo();
        }}
      />
    ),
    {
      duration: duration,
      onDismiss: () => {
        if (!undone) {
          onConfirm();
        }
      },
      onAutoClose: () => {
        if (!undone) {
          onConfirm();
        }
      },
    }
  );

  return toastId;
}

function UndoToastContent({ message, duration, onUndo }: { message: string; duration: number; onUndo: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-sm text-on-surface">{message}</span>
      </div>
      <button
        onClick={onUndo}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
      >
        <Undo2 className="w-3 h-3" />
        Undo ({timeLeft}s)
      </button>
    </div>
  );
}
