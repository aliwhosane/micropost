import Parser from 'rss-parser';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    source?: string;
    guid?: string;
}

const parser = new Parser();

export async function fetchTrendingNews(topic: string): Promise<NewsItem[]> {
    try {
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(feedUrl);

        return feed.items.map(item => ({
            title: item.title || "No Title",
            link: item.link || "",
            pubDate: item.pubDate || "",
            contentSnippet: item.contentSnippet || item.content || "",
            source: item.creator || "Google News", // RSS parser sometimes puts source in creator or we parse title
            guid: item.guid
        })).slice(0, 10); // Limit to top 10 per topic
    } catch (error) {
        console.error(`Error fetching news for topic ${topic}:`, error);
        return [];
    }
}

export async function aggregateNews(topics: string[]): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    // Fetch in parallel
    const results = await Promise.all(topics.map(topic => fetchTrendingNews(topic)));

    results.forEach(items => {
        allNews.push(...items);
    });

    // Deduplicate by link or title
    const uniqueNews = Array.from(new Map(allNews.map(item => [item.title, item])).values());

    // Sort by date descending
    return uniqueNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
