import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comment Reply Assistant - Boost Engagement | Micropost",
    description: "Never run out of things to say. Generate funny, grateful, and engaging replies to social media comments instantly.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
