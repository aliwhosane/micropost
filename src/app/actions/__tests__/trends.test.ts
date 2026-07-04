import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTrendsAction, getUserTopicsAction, generateTrendPostAction } from '../trends'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { fetchTrendingNews, aggregateNews } from '@/lib/news'
import { analyzeTrends, generateSocialPost } from '@/lib/ai'

vi.mock('@/lib/db', () => ({
    prisma: {
        topic: { findMany: vi.fn() },
        user: { findUnique: vi.fn() },
        post: { create: vi.fn() }
    }
}))

vi.mock('@/auth', () => ({
    auth: vi.fn()
}))

vi.mock('@/lib/news', () => ({
    fetchTrendingNews: vi.fn(),
    aggregateNews: vi.fn()
}))

vi.mock('@/lib/ai', () => ({
    analyzeTrends: vi.fn(),
    generateSocialPost: vi.fn()
}))

describe('trends actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any)
    })

    describe('fetchTrendsAction', () => {
        it('fetches specific topic trends', async () => {
            const mockNews = [{ title: 'News 1' }]
            vi.mocked(fetchTrendingNews).mockResolvedValue(mockNews as any)
            vi.mocked(analyzeTrends).mockResolvedValue(['Trend 1'] as any)

            const result = await fetchTrendsAction('AI')

            expect(fetchTrendingNews).toHaveBeenCalledWith('AI')
            expect(analyzeTrends).toHaveBeenCalledWith(mockNews)
            expect(result).toEqual(['Trend 1'])
        })

        it('fetches user topic trends if no topic provided', async () => {
            vi.mocked(prisma.topic.findMany).mockResolvedValue([{ name: 'Coding' }, { name: 'Design' }] as any)
            vi.mocked(aggregateNews).mockResolvedValue([{ title: 'Tech News' }] as any)

            await fetchTrendsAction()

            expect(prisma.topic.findMany).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }))
            expect(aggregateNews).toHaveBeenCalledWith(['Coding', 'Design'])
        })

        it('fetches default topics if user has none', async () => {
            vi.mocked(prisma.topic.findMany).mockResolvedValue([] as any)

            await fetchTrendsAction()

            expect(aggregateNews).toHaveBeenCalledWith(["Technology", "Business", "Health"])
        })
    })

    describe('getUserTopicsAction', () => {
        it('returns user topic names', async () => {
            vi.mocked(prisma.topic.findMany).mockResolvedValue([{ name: 'T1' }, { name: 'T2' }] as any)
            const result = await getUserTopicsAction()
            expect(result).toEqual(['T1', 'T2'])
        })

        it('returns empty array if unauthenticated', async () => {
            vi.mocked(auth).mockResolvedValue(null)
            const result = await getUserTopicsAction()
            expect(result).toEqual([])
        })
    })

    describe('generateTrendPostAction', () => {
        const mockTrend = { title: 'T', summary: 'S', link: 'L' }

        it('generates post from trend', async () => {
            const user = { id: 'user-1', topics: [{ name: 'Tech' }], preferences: {} }
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any)
            vi.mocked(generateSocialPost).mockResolvedValue({ content: 'Post', topic: 'Tech' } as any)

            await generateTrendPostAction('TWITTER', mockTrend, 'Make it funny')

            expect(generateSocialPost).toHaveBeenCalledWith(expect.objectContaining({
                newsContext: { title: 'T', summary: 'S', url: 'L' },
                temporaryThoughts: 'Make it funny'
            }))

            expect(prisma.post.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    content: 'Post',
                    platform: 'TWITTER',
                    status: 'DRAFT'
                })
            }))
        })
    })
})
