import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tweet to LinkedIn Expander - Repurpose Content Fast | Micropost",
    description: "Turn your short tweets into viral LinkedIn posts in seconds. AI-powered content repurposing for creators and founders.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
