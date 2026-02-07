import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publishToSocials } from '../social'
import { prisma } from '@/lib/db'
import axios from 'axios'

// Mock Prisma
vi.mock('@/lib/db', () => ({
    prisma: {
        account: {
            findFirst: vi.fn(),
            update: vi.fn(),
        },
    },
}))

// Mock Axios
vi.mock('axios')

// Mock Twitter API
const mockTweet = vi.fn()
const mockUploadMedia = vi.fn()

vi.mock('twitter-api-v2', () => ({
    TwitterApi: vi.fn().mockImplementation(() => ({
        v1: { uploadMedia: mockUploadMedia },
        v2: { tweet: mockTweet },
        refreshOAuth2Token: vi.fn(),
    })),
}))

describe('Social Publishing', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    describe('Twitter', () => {
        it('should post text to Twitter if account exists', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'valid-token',
                expires_at: Date.now() / 1000 + 3600,
                providerAccountId: 'twitter-id',
            } as any)

            await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Hello Twitter',
                platform: 'TWITTER',
            })

            // The implementation calls client.v2.tweet(post.content) which is a string
            // Just verify it was called at all successfully
            expect(mockTweet).toHaveBeenCalledTimes(1)
            expect(mockTweet).toHaveBeenCalledWith('Hello Twitter')
        })

        it('should upload media if image provided', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'valid-token',
                expires_at: Date.now() / 1000 + 3600,
                providerAccountId: 'twitter-id',
            } as any)

            mockUploadMedia.mockResolvedValue('media-id-123')

            await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Image Post',
                platform: 'TWITTER',
                imageUrl: 'data:image/png;base64,abcdef',
            })

            expect(mockUploadMedia).toHaveBeenCalled()

            // Implementation: await client.v2.tweet({ text: ..., media: ... })
            expect(mockTweet).toHaveBeenCalledWith(expect.objectContaining({
                text: 'Image Post',
                media: { media_ids: ['media-id-123'] },
            }))
        })
    })

    describe('LinkedIn', () => {
        it('should post to LinkedIn via Axios', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'linkedin-token',
                providerAccountId: 'urn:li:person:123',
            } as any)

            vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 })

            await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Hello LinkedIn',
                platform: 'LINKEDIN',
            })

            expect(axios.post).toHaveBeenCalledWith(
                'https://api.linkedin.com/v2/ugcPosts',
                expect.anything(),
                expect.anything()
            )
        })
    })

    describe('Threads', () => {
        it('should complete the 2-step publishing flow', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'threads-token',
                expires_at: Date.now() / 1000 + 100000,
            } as any)

            vi.mocked(axios.post)
                .mockResolvedValueOnce({ data: { id: 'container-123' } })
                .mockResolvedValueOnce({ data: { id: 'published-id' } })

            vi.mocked(axios.get).mockResolvedValueOnce({ data: { status: 'FINISHED' } })

            const result = await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Hello Threads',
                platform: 'THREADS',
            })

            expect(result.success).toBe(true)
            expect(axios.post).toHaveBeenCalledTimes(2)
        })
    })
})
