export const siteConfig = {
    name: "Micropost AI",
    description: "The AI ghostwriter that learns your voice, fills your content calendar in minutes, and posts for you. Stop writing, start growing.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://micropost.ai",
    ogImage: "https://micropost.ai/og-image.png",
    links: {
        twitter: "https://twitter.com/micropostai",
        github: "https://github.com/micropostai",
    },
    creator: "Micropost AI Team",
};

export type SiteConfig = typeof siteConfig;
