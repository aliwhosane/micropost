import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Feature to Benefit Converter - Sell the Dream | Micropost",
    description: "Turn boring technical specs into irresistible marketing copy. AI-powered copywriting tool for SaaS, e-commerce, and agencies.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
