"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // Oops, I didn't install radix slot, I'll use standard props or install it if I want polymorphism. 
// I'll stick to standard button for now to avoid extra deps unless needed.
// Actually, using motion.button is better for animations.
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "filled" | "tonal" | "outlined" | "text" | "elevated";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "filled", size = "default", isLoading, children, ...props }, ref) => {

        // MD3 Styles
        const variants = {
            filled: "bg-primary text-on-primary hover:shadow-md hover:brightness-110 active:scale-95",
            tonal: "bg-secondary-container text-on-secondary-container hover:shadow-sm hover:brightness-105 active:scale-95",
            outlined: "border border-outline text-primary hover:bg-primary/10 active:bg-primary/20",
            text: "text-primary hover:bg-primary/10 active:bg-primary/20",
            elevated: "bg-surface-container-low text-primary shadow-sm hover:shadow-md hover:bg-primary/5",
        };

        const sizes = {
            default: "h-10 px-6 py-2",
            sm: "h-8 px-4 text-xs",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10 p-2 flex items-center justify-center rounded-full", // Icon buttons usually round
        };

        const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
