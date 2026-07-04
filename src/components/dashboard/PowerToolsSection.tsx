import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tools = [
    {
        icon: "🔥",
        title: "TrendSurfer",
        description: "Find viral angles from today's news",
        href: "/dashboard/trends",
    },
    {
        icon: "🎬",
        title: "ShortsMaker",
        description: "Turn posts into vertical videos",
        href: "/dashboard/shortsmaker",
    },
    {
        icon: "📊",
        title: "Carousel Maker",
        description: "Build LinkedIn carousels",
        href: "/dashboard/carousel",
    },
];

export function PowerToolsSection() {
    return (
        <section>
            <h2 className="text-xl font-semibold text-on-surface mb-4 tracking-tight">
                Power Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group bg-surface border border-outline-variant/10 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                        <div className="text-3xl mb-3">{tool.icon}</div>
                        <h3 className="text-base font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                            {tool.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant mb-4">
                            {tool.description}
                        </p>
                        <span className="inline-flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Open
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
