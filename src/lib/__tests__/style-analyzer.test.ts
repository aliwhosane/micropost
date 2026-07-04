import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeTwitterStyle } from '../style-analyzer'
import { prisma } from '@/lib/db'
import { TwitterApi } from 'twitter-api-v2'
import { generateStyleDescription } from '@/lib/ai'

vi.mock('@/lib/db', () => ({
    prisma: {
        account: { findFirst: vi.fn() },
        preferences: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() }
    }
}))

vi.mock('twitter-api-v2', () => ({
    TwitterApi: vi.fn()
}))

vi.mock('@/lib/ai', () => ({
    generateStyleDescription: vi.fn()
}))

describe('style-analyzer', () => {
    const mockTwitterClient = {
        v2: {
            me: vi.fn(),
            userTimeline: vi.fn()
        }
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(TwitterApi).mockReturnValue(mockTwitterClient as any)
    })

    it('analyzes style successfully', async () => {
        // Mock DB
        vi.mocked(prisma.account.findFirst).mockResolvedValue({ access_token: 'token' } as any)
        vi.mocked(prisma.preferences.findUnique).mockResolvedValue({ id: 'pref-1' } as any)

        // Mock Twitter
        mockTwitterClient.v2.me.mockResolvedValue({ data: { id: 'twitter-id' } })
        mockTwitterClient.v2.userTimeline.mockResolvedValue({
            data: {
                data: [
                    { text: 'Tweet 1 is long enough to be analyzed for style.' },
                    { text: 'Tweet 2 is also reasonable length.' },
                    { text: 'Tweet 3 must be sufficient.' },
                    { text: 'Tweet 4 requires some substance.' },
                    { text: 'Tweet 5 ensures we hit the minimum limit.' }
                ]
            }
        })

        // Mock AI
        vi.mocked(generateStyleDescription).mockResolvedValue('Witty and tech-focused')

        const result = await analyzeTwitterStyle('user-1')

        expect(result).toBe('Witty and tech-focused')
        expect(prisma.preferences.update).toHaveBeenCalledWith({
            where: { userId: 'user-1' },
            data: { styleSample: 'Witty and tech-focused' }
        })
    })

    it('throws if no connected account', async () => {
        vi.mocked(prisma.account.findFirst).mockResolvedValue(null)
        await expect(analyzeTwitterStyle('user-1')).rejects.toThrow('Twitter account not connected')
    })

    it('throws if not enough tweets', async () => {
        vi.mocked(prisma.account.findFirst).mockResolvedValue({ access_token: 'token' } as any)
        mockTwitterClient.v2.me.mockResolvedValue({ data: { id: 'twitter-id' } })
        mockTwitterClient.v2.userTimeline.mockResolvedValue({
            data: {
                data: [
                    { text: 'Short' } // Only 1 valid tweet (or 0 if < 20 chars)
                ]
            }
        })

        await expect(analyzeTwitterStyle('user-1')).rejects.toThrow('Not enough tweets')
    })
})
