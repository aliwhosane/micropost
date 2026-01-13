import { Metadata } from "next";

export const metadata: Metadata = {
    title: "YouTube to Twitter Thread Converter | Micropost AI",
    description: "Turn any YouTube video into a viral Twitter thread in seconds. AI-powered summarization tool for content creators.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
