import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "YouTube Thumbnail Title Generator - Viral Text Overlays | Micropost",
    description: "Generate short, punchy text overlays for your YouTube thumbnails. Get more clicks with curiosity-driven copy.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
