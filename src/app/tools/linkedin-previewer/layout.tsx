import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LinkedIn Post Preview Tool | Micropost AI",
    description: "See exactly where your LinkedIn post gets cut off on mobile and desktop. Optimize your hook before you hit publish.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
