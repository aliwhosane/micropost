import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;

    const routes = [
        "",
        "/login",
        "/pricing",
        "/tools",
        "/tools/bio-optimizer",
        "/tools/buzzword-killer",
        "/tools/cold-dm-writer",
        "/tools/content-pillar-generator",
        "/tools/feature-to-benefit",
        "/tools/linkedin-previewer",
        "/tools/professional-translator",
        "/tools/tweet-to-linkedin-expander",
        "/tools/comment-reply-assistant",
        "/tools/youtube-summarizer",
        "/tools/viral-hooks",
        "/tools/youtube-thumbnail-title",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    return routes;
}
