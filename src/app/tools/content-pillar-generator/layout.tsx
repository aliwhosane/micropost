import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Content Pillar Strategy Generator | Micropost AI",
    description: "Generate 5 unique content pillars and topic ideas for any niche in seconds. Stop guessing what to post.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
