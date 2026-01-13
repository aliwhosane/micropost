import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Professional AI Text Translator | Micropost AI",
    description: "Rewrite informal text into professional corporate speak using AI. Turn your raw thoughts into office-safe communication.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
