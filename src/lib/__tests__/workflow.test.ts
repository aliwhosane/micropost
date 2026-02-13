import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runDailyGeneration } from '../workflow'
import { prisma } from '@/lib/db'
import * as aiLib from '@/lib/ai'
import * as emailLib from '@/lib/email'

// Mock dependencies
vi.mock('@/lib/db', () => ({
    prisma: {
        user: { findMany: vi.fn() },
        post: { create: vi.fn() },
    },
}))

vi.mock('@/lib/ai', () => ({
    generateSocialPost: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
    sendDailyDigest: vi.fn(),
}))

describe('Daily Workflow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should generate posts for eligible users', async () => {
        const mockUser = {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Test User',
            preferences: {
                postsPerDay: 1, // field might be deprecated? logic uses platform specific counts
                twitterPostsPerDay: 1,
                linkedinPostsPerDay: 1,
                styleSample: 'Professional',
            },
            topics: [{ name: 'Tech', enabled: true, notes: '', stance: '' }],
            accounts: [
                { provider: 'twitter' },
                { provider: 'linkedin' },
            ],
        }

        vi.mocked(prisma.user.findMany).mockResolvedValueOnce([mockUser] as any)

        vi.mocked(aiLib.generateSocialPost).mockResolvedValue({
            content: 'Generated Post',
            topic: 'Tech',
        })

        vi.mocked(prisma.post.create).mockResolvedValue({
            id: 'post-123',
            content: 'Generated Post',
            platform: 'TWITTER',
            topic: 'Tech',
        } as any)

        const results = await runDailyGeneration()

        // 1 Twitter post + 1 LinkedIn post expected
        expect(aiLib.generateSocialPost).toHaveBeenCalledTimes(2)

        expect(prisma.post.create).toHaveBeenCalledTimes(2)

        // Should send email
        expect(emailLib.sendDailyDigest).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test@example.com',
            posts: expect.arrayContaining([expect.objectContaining({ content: 'Generated Post' })]),
        }))

        expect(results[0].success).toBe(true)
    })

    it('should skip users with no preferences', async () => {
        vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
            { id: 'user-2', preferences: null } // Invalid user
        ] as any)

        const results = await runDailyGeneration()
        expect(results).toHaveLength(0)
        expect(aiLib.generateSocialPost).not.toHaveBeenCalled()
    })
})
