"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

interface FormSliderProps {
    name: string;
    defaultValue: number;
    max: number;
    step: number;
    label: string;
    icon: React.ReactNode;
    description: string;
}

export function FormSlider({
    name,
    defaultValue,
    max,
    step,
    label,
    icon,
    description
}: FormSliderProps) {
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="space-y-6 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 transition-all hover:border-primary/20 hover:shadow-sm group">
            <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-on-surface flex items-center gap-2">
                    {icon}
                    {label}
                </label>
                <span className="text-2xl font-bold text-primary tabular-nums">
                    {value} <span className="text-xs font-medium text-on-surface-variant/70 uppercase tracking-wider ml-1">posts/day</span>
                </span>
            </div>

            <Slider
                defaultValue={[defaultValue]}
                max={max}
                step={step}
                className="py-2"
                onValueChange={(vals) => setValue(vals[0])}
            />

            {/* Hidden input to ensure value is submitted with form */}
            <input type="hidden" name={name} value={value} />

            <p className="text-xs text-on-surface-variant">
                {description}
            </p>
        </div>
    );
}
