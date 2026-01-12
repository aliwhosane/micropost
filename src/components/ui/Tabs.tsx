"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

export function Tabs({ defaultValue, value, onValueChange, className, children }: any) {
    const [selected, setSelected] = React.useState(defaultValue || value);

    const handleChange = React.useCallback((val: string) => {
        setSelected(val);
        onValueChange?.(val);
    }, [onValueChange]);

    return (
        <TabsContext.Provider value={{ value: selected, onValueChange: handleChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children }: any) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-surface-variant/20 p-1 text-on-surface-variant", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, className, children }: any) {
    const context = React.useContext(TabsContext);
    const isSelected = context?.value === value;

    return (
        <button
            type="button"
            onClick={() => context?.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected ? "bg-surface text-on-surface shadow-sm" : "hover:bg-surface/50 hover:text-on-surface",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, className, children }: any) {
    const context = React.useContext(TabsContext);
    if (context?.value !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
}
