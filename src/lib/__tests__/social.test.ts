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
const mockRefreshOAuth2Token = vi.fn()

vi.mock('twitter-api-v2', () => ({
    TwitterApi: vi.fn().mockImplementation(() => ({
        v1: { uploadMedia: mockUploadMedia },
        v2: { tweet: mockTweet },
        refreshOAuth2Token: mockRefreshOAuth2Token,
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
                expires_at: Math.floor(Date.now() / 1000) + 100000, // > 24 hours
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
                expires_at: Math.floor(Date.now() / 1000) + 100000,
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

        it('should return error if Twitter token is expired', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-tw-token',
                expires_at: Math.floor(Date.now() / 1000) - 3600,
                provider: 'twitter',
                providerAccountId: 'user-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-expired-tw',
                userId: 'user-expired-tw',
                content: 'Should fail',
                platform: 'TWITTER',
            })

            expect(result.success).toBe(false)
            const errorMsg = result.error instanceof Error ? result.error.message : String(result.error)
            expect(errorMsg).toContain('Twitter session expired')
        })

        it('should attempt refresh if Twitter token is within 24 hours of expiry', async () => {
            const nearExpiry = Math.floor(Date.now() / 1000) + 3600 // 1 hour left (< 24h)

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'old-tw-token',
                refresh_token: 'refresh-token-val',
                expires_at: nearExpiry,
                provider: 'twitter',
                providerAccountId: 'user-id',
            } as any)

            mockRefreshOAuth2Token.mockResolvedValue({
                accessToken: 'new-tw-token',
                refreshToken: 'new-refresh-token',
                expiresIn: 7200,
                client: {} // mocked client return
            })

            await publishToSocials({
                id: 'post-refresh-tw',
                userId: 'user-refresh-tw',
                content: 'Refreshed Twitter',
                platform: 'TWITTER',
            })

            // Verify refresh called
            expect(mockRefreshOAuth2Token).toHaveBeenCalledWith('refresh-token-val')

            // Verify DB upate
            expect(prisma.account.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    access_token: 'new-tw-token',
                    refresh_token: 'new-refresh-token',
                })
            }))
        })
    })

    describe('LinkedIn', () => {
        it('should post to LinkedIn via Axios', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'linkedin-token',
                providerAccountId: 'urn:li:person:123',
                // Add valid expiry to pass new checks
                expires_at: Math.floor(Date.now() / 1000) + 100000,
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

        it('should return error if LinkedIn token is expired', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-li-token',
                expires_at: Math.floor(Date.now() / 1000) - 3600,
                provider: 'linkedin',
                providerAccountId: 'user-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-expired-li',
                userId: 'user-expired-li',
                content: 'Should fail',
                platform: 'LINKEDIN',
            })

            expect(result.success).toBe(false)
            const errorMsg = result.error instanceof Error ? result.error.message : String(result.error)
            expect(errorMsg).toContain('LinkedIn session expired')
        })

        it('should attempt refresh if LinkedIn token is within 7 days of expiry', async () => {
            const nearExpiry = Math.floor(Date.now() / 1000) + 100000 // < 604800 (7 days)

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'old-li-token',
                refresh_token: 'refresh-token-val',
                expires_at: nearExpiry,
                provider: 'linkedin',
                providerAccountId: 'user-id',
            } as any)

            // Mock refresh call
            vi.mocked(axios.post).mockResolvedValueOnce({
                data: {
                    access_token: 'new-li-token',
                    expires_in: 5184000,
                    refresh_token: 'new-refresh-token'
                }
            })
            // Mock post call
            vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 })

            await publishToSocials({
                id: 'post-refresh-li',
                userId: 'user-refresh-li',
                content: 'Refreshed LI',
                platform: 'LINKEDIN',
            })

            // Verify refresh request
            expect(axios.post).toHaveBeenCalledWith(
                "https://www.linkedin.com/oauth/v2/accessToken",
                expect.any(URLSearchParams),
                expect.anything()
            )

            // Verify DB update
            expect(prisma.account.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    access_token: 'new-li-token',
                    refresh_token: 'new-refresh-token'
                })
            }))
        })
    })

    describe('Threads', () => {
        it('should complete the 2-step publishing flow', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'threads-token',
                expires_at: Math.floor(Date.now() / 1000) + 100000,
                providerAccountId: 'user-id',
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

        it('should return error if Threads token is expired', async () => {
            const expiredTime = Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-token',
                expires_at: expiredTime,
                provider: 'threads',
                providerAccountId: 'user-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-expired',
                userId: 'user-expired',
                content: 'Should fail',
                platform: 'THREADS',
            })

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
            // The error object might be wrapped or the error string itself
            const errorMsg = result.error instanceof Error ? result.error.message : String(result.error)
            expect(errorMsg).toContain('Threads session expired')
        })

        it('should attempt refresh if token is within 30 days of expiry', async () => {
            // 20 days left = 20 * 86400 = 1728000s. 
            // 30 days limit = 2592000s.
            // So this should trigger refresh.
            const nearExpiryTime = Math.floor(Date.now() / 1000) + 1728000

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'old-token',
                expires_at: nearExpiryTime,
                provider: 'threads',
                providerAccountId: 'user-id',
            } as any)

            // 1. Refresh call
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { access_token: 'new-token-refreshed', expires_in: 5184000 }
            })
            // 2. Status check call (for the posting flow)
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { status: 'FINISHED' }
            })

            // Mocks for posting
            vi.mocked(axios.post)
                .mockResolvedValueOnce({ data: { id: 'container-123' } })
                .mockResolvedValueOnce({ data: { id: 'published-id' } })

            await publishToSocials({
                id: 'post-refresh',
                userId: 'user-refresh',
                content: 'Refreshed Post',
                platform: 'THREADS',
            })

            // Verify refresh happened
            expect(prisma.account.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ access_token: 'new-token-refreshed' })
            }))
        })
    })
})
