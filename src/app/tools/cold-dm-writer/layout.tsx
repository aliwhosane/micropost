import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Cold DM Writer - Get More Replies | Micropost",
    description: "Generate high-converting, non-spammy cold DMs and outreach scripts. AI-powered sales copywriting for founders and freelancers.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
