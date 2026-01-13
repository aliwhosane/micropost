import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Bio Optimizer - Create the Perfect Social Media Bio | Micropost",
    description: "Generate professional, high-converting bios for Twitter, LinkedIn, and Instagram in seconds. Optimized for growth, sales, and authority.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
