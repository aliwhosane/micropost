"use client";

import { useEffect, useState } from "react";

interface GreetingProps {
    firstName: string;
    pendingCount: number;
}

export function Greeting({ firstName, pendingCount }: GreetingProps) {
    const [greeting, setGreeting] = useState("Hello");

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(
            hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
        );
    }, []);

    return (
        <div className="mb-2">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
                {greeting}, {firstName}.
            </h1>
            <p className="text-on-surface-variant text-lg mt-1">
                {pendingCount > 0
                    ? `You have ${pendingCount} draft${pendingCount > 1 ? "s" : ""} ready for review.`
                    : "No drafts waiting. Time to create something new."}
            </p>
        </div>
    );
}
