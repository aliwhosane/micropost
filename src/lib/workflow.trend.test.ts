
import { vi, describe, it, expect, beforeEach, } from 'vitest';
import { runDailyGeneration } from './workflow';
import { prisma } from './db';
import * as ai from './ai';

// Mock dependencies
vi.mock('./db', () => ({
    prisma: {
        user: { findMany: vi.fn() },
        post: { count: vi.fn(), create: vi.fn() },
        clientProfile: { findUnique: vi.fn() }
    }
}));

vi.mock('./ai', () => ({
    generateSocialPost: vi.fn(),
    analyzeTrends: vi.fn(),
    generatePostContent: vi.fn()
}));

vi.mock('./news', () => ({
    aggregateNews: vi.fn().mockResolvedValue([{ title: "Test News", link: "http://test.com" }])
}));

vi.mock('./email', () => ({
    sendDailyDigest: vi.fn()
}));

describe('runDailyGeneration - Trend Logic', () => {
    const mockUser = {
        id: 'user1',
        email: 'test@test.com',
        preferences: {
            twitterPostsPerDay: 1,
            linkedinPostsPerDay: 1,
            threadsPostsPerDay: 1,
            styleSample: 'Professional'
        },
        topics: [
            { name: 'AI', enabled: true, clientProfileId: null }
        ],
        accounts: [
            { provider: 'twitter' },
            { provider: 'linkedin' },
            { provider: 'threads' }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (prisma.user.findMany as any).mockResolvedValue([mockUser]);
        (ai.analyzeTrends as any).mockResolvedValue([{
            title: "Trending Topic",
            viralScore: 90,
            aiSummary: "Summary",
            link: "url"
        }]);
        (ai.generateSocialPost as any).mockResolvedValue({ content: "Post content", topic: "AI" });
        (prisma.post.create as any).mockResolvedValue({ id: 'post1', content: "Post content", platform: 'TWITTER' });
    });

    it('should NOT use trends for post #1 (count 0)', async () => {
        (prisma.post.count as any).mockResolvedValue(0); // 0 existing posts

        await runDailyGeneration('user1');

        // Check call to generateSocialPost
        expect(ai.generateSocialPost).toHaveBeenCalled();
        const calls = (ai.generateSocialPost as any).mock.calls;

        // We expect 3 calls (1 twitter, 1 linkedin, 1 threads)
        // For count 0, next is 1. 1 % 3 != 0. Expect undefined newsContext.
        calls.forEach((call: any) => {
            const params = call[0];
            expect(params.newsContext).toBeUndefined();
        });
    });

    it('should NOT use trends for post #2 (count 1)', async () => {
        (prisma.post.count as any).mockResolvedValue(1); // 1 existing post

        await runDailyGeneration('user1');

        const calls = (ai.generateSocialPost as any).mock.calls;
        // Next is 2. 2 % 3 != 0.
        calls.forEach((call: any) => {
            expect(call[0].newsContext).toBeUndefined();
        });
    });

    it('should USE trends for post #3 (count 2)', async () => {
        (prisma.post.count as any).mockResolvedValue(2); // 2 existing posts

        await runDailyGeneration('user1');

        const calls = (ai.generateSocialPost as any).mock.calls;
        // Next is 3. 3 % 3 == 0. Expect newsContext to be defined.

        // Note: runDailyGeneration runs for 3 platforms. count is mocked for all.
        // So all 3 should have newsContext if trends are found.
        calls.forEach((call: any) => {
            expect(call[0].newsContext).toBeDefined();
            expect(call[0].newsContext.title).toBe("Trending Topic");
        });
    });

    it('should NOT use trends for post #4 (count 3)', async () => {
        (prisma.post.count as any).mockResolvedValue(3);

        await runDailyGeneration('user1');

        const calls = (ai.generateSocialPost as any).mock.calls;
        // Next is 4.
        calls.forEach((call: any) => {
            expect(call[0].newsContext).toBeUndefined();
        });
    });

    it('should USE trends for post #6 (count 5)', async () => {
        (prisma.post.count as any).mockResolvedValue(5);

        await runDailyGeneration('user1');

        const calls = (ai.generateSocialPost as any).mock.calls;
        // Next is 6.
        calls.forEach((call: any) => {
            expect(call[0].newsContext).toBeDefined();
        });
    });
});
