import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Corporate Jargon Killer - Sound Human Again | Micropost",
    description: "Detect and replace annoying corporate buzzwords like \"synergy\", \"deep dive\", and \"leverage\" with clear, human language.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
