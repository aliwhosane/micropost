"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  Languages,
  Layers,
  Youtube,
  Magnet,
  UserCog,
  Eraser,
  Send,
  Wand2,
  Maximize2,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "create" | "optimize" | "grow";
  href: string;
  badge?: string;
}

const TOOLS: Tool[] = [
  {
    id: "linkedin-previewer",
    name: "LinkedIn Previewer",
    description:
      "See exactly where your post gets cut off. Optimize your hook before you hit publish.",
    icon: Eye,
    category: "optimize",
    href: "/tools/linkedin-previewer",
    badge: "Popular",
  },
  {
    id: "professional-translator",
    name: "Professional Translator",
    description:
      "Turn your raw thoughts into office-safe corporate speak. Powered by AI.",
    icon: Languages,
    category: "create",
    href: "/tools/professional-translator",
  },
  {
    id: "content-pillar-generator",
    name: "Content Pillar Generator",
    description:
      "Get 5 unique content pillars and topic ideas for any niche in seconds.",
    icon: Layers,
    category: "create",
    badge: "Popular",
    href: "/tools/content-pillar-generator",
  },
  {
    id: "youtube-summarizer",
    name: "YouTube to Thread",
    description:
      "Turn long videos into viral Twitter threads. Paste a URL, get a thread.",
    icon: Youtube,
    category: "create",
    href: "/tools/youtube-summarizer",
  },
  {
    id: "viral-hooks",
    name: "Viral Hook Generator",
    description:
      "Stop the scroll. Generate 10+ psychologically triggered hooks for any topic.",
    icon: Magnet,
    category: "grow",
    badge: "Popular",
    href: "/tools/viral-hooks",
  },
  {
    id: "bio-optimizer",
    name: "AI Bio Optimizer",
    description:
      "Craft the perfect social media bio for Twitter, LinkedIn, and Instagram.",
    icon: UserCog,
    category: "optimize",
    href: "/tools/bio-optimizer",
  },
  {
    id: "buzzword-killer",
    name: "Buzzword Killer",
    description:
      "Identify toxic corporate jargon and replace it with punchy, human alternatives.",
    icon: Eraser,
    category: "optimize",
    href: "/tools/buzzword-killer",
  },
  {
    id: "cold-dm-writer",
    name: "Cold DM Writer",
    description:
      "Generate 3 high-response cold outreach scripts to pitch your services.",
    icon: Send,
    category: "grow",
    href: "/tools/cold-dm-writer",
    badge: "New",
  },
  {
    id: "feature-to-benefit",
    name: "Feature to Benefit",
    description:
      "Turn boring technical specs into irresistible emotional marketing copy.",
    icon: Wand2,
    category: "optimize",
    href: "/tools/feature-to-benefit",
  },
  {
    id: "tweet-to-linkedin",
    name: "Tweet to LinkedIn",
    description:
      "Expand short tweets into high-performing, formatted LinkedIn posts.",
    icon: Maximize2,
    category: "create",
    href: "/tools/tweet-to-linkedin-expander",
  },
  {
    id: "reply-assistant",
    name: "Reply Assistant",
    description:
      "Engagement is key. Generate funny, grateful, or engaging replies instantly.",
    icon: MessageCircle,
    category: "grow",
    href: "/tools/comment-reply-assistant",
  },
  {
    id: "thumbnail-text",
    name: "Thumbnail Text",
    description:
      "Get more clicks. Generate short, punchy text overlays for your video thumbnails.",
    icon: ImageIcon,
    category: "grow",
    href: "/tools/youtube-thumbnail-title",
    badge: "New",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "create", label: "Create" },
  { id: "optimize", label: "Optimize" },
  { id: "grow", label: "Grow" },
] as const;

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        href={tool.href}
        className="group block p-6 rounded-2xl border border-outline-variant/20 bg-surface-container/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <tool.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-on-surface">{tool.name}</h3>
              {tool.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
              {tool.description}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Try it free <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools =
    activeCategory === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-on-surface">
          Free AI Tools
        </h2>
        <p className="text-lg text-on-surface-variant text-center mt-3 mb-10">
          Power up your content workflow
        </p>

        <div className="flex justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
