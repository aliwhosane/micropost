"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className="relative w-full">
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "peer flex h-14 w-full rounded-t-md border-b-2 border-outline-variant bg-surface-variant/30 px-4 pt-5 pb-2 text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                        error && "border-error focus-visible:border-error",
                        className
                    )}
                    placeholder={label || "Input"}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "pointer-events-none absolute left-4 top-4 text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs",
                            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
                        )}
                    >
                        {label}
                    </label>
                )}
                {error && (
                    <span className="text-xs text-error mt-1 ml-4 block">{error}</span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
