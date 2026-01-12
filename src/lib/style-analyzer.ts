import { prisma } from "@/lib/db";
import { TwitterApi } from "twitter-api-v2";
import { generateStyleDescription } from "@/lib/ai";

export async function analyzeTwitterStyle(userId: string): Promise<string> {
    // 1. Get Twitter Access Token
    const account = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: "twitter",
        },
    });

    if (!account || !account.access_token) {
        throw new Error("Twitter account not connected.");
    }

    try {
        // 2. Fetch User's Recent Tweets
        const client = new TwitterApi(account.access_token);

        // Get current user details to find their ID
        const me = await client.v2.me();

        // Fetch tweets (exclude retweets/replies if possible or filter later)
        // For v2, we can't easily filter by "exclude_replies" in userTimeline directly without proper fields,
        // but let's fetch a chunk and filter manually.
        const timeline = await client.v2.userTimeline(me.data.id, {
            max_results: 20,
            "tweet.fields": ["text", "referenced_tweets"],
            exclude: ["retweets", "replies"]
        });

        const distinctTweets = timeline.data.data
            .map(t => t.text)
            .filter(text => text.length > 20); // Filter out very short tweets

        if (distinctTweets.length < 5) {
            throw new Error("Not enough tweets to analyze (need at least 5).");
        }

        // 3. Generate Style Description
        const styleDescription = await generateStyleDescription(distinctTweets);

        // 4. Update User Preferences
        // Check if preferences exist
        const preferences = await prisma.preferences.findUnique({
            where: { userId: userId }
        });

        if (preferences) {
            await prisma.preferences.update({
                where: { userId: userId },
                data: { styleSample: styleDescription }
            });
        } else {
            await prisma.preferences.create({
                data: {
                    userId: userId,
                    styleSample: styleDescription
                }
            });
        }

        return styleDescription;

    } catch (error) {
        console.error("Style Analysis Failed:", error);
        throw new Error("Failed to analyze Twitter style. Token might be expired.");
    }
}
