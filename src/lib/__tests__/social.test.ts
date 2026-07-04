import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publishToSocials } from '../social'
import { prisma } from '@/lib/db'
import axios from 'axios'
import { TwitterApi } from 'twitter-api-v2'

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

// Mock Twitter API Module
vi.mock('twitter-api-v2', () => {
    return {
        TwitterApi: vi.fn()
    }
})

describe('Social Publishing', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default Mock Implementation for Twitter
        vi.mocked(TwitterApi).mockImplementation(() => ({
            v1: {
                uploadMedia: vi.fn().mockResolvedValue('media-id-default')
            },
            v2: {
                tweet: vi.fn().mockResolvedValue({ data: { id: 'tweet-id' } })
            },
            refreshOAuth2Token: vi.fn().mockResolvedValue({
                accessToken: 'default-new-token',
                refreshToken: 'default-new-refresh',
                expiresIn: 7200,
                client: {}
            })
        } as any))
    })

    describe.skip('Twitter', () => {
        it('should post text to Twitter if account exists', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'valid-token',
                expires_at: Math.floor(Date.now() / 1000) + 100000,
                providerAccountId: 'twitter-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Hello Twitter',
                platform: 'TWITTER',
            })

            expect(result.success).toBe(true)
        })

        it('should upload media if image provided', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'valid-token',
                expires_at: Math.floor(Date.now() / 1000) + 100000,
                providerAccountId: 'twitter-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Image Post',
                platform: 'TWITTER',
                imageUrl: 'data:image/png;base64,abcdef',
            })

            expect(result.success).toBe(true)
        })

        it('should attempt refresh and fail if Twitter token is expired and refresh fails', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-tw-token',
                expires_at: Math.floor(Date.now() / 1000) - 3600,
                refresh_token: 'refresh-token-val',
                provider: 'twitter',
                providerAccountId: 'user-id',
            } as any)

            // Override mock for failure
            vi.mocked(TwitterApi).mockImplementation(() => ({
                v1: { uploadMedia: vi.fn() },
                v2: { tweet: vi.fn() },
                refreshOAuth2Token: vi.fn().mockRejectedValue(new Error('Refresh failed'))
            } as any))

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

        it('should attempt refresh and succeed if Twitter token is expired', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-tw-token',
                expires_at: Math.floor(Date.now() / 1000) - 3600,
                refresh_token: 'refresh-token-val',
                provider: 'twitter',
                providerAccountId: 'user-id',
            } as any)

            // Override mock for specific success return if needed, but default is fine.
            // Just verifying side effects.

            const result = await publishToSocials({
                id: 'post-revived-tw',
                userId: 'user-revived-tw',
                content: 'Revived Twitter',
                platform: 'TWITTER',
            })

            expect(prisma.account.update).toHaveBeenCalled()
            expect(result.success).toBe(true)
        })

        it('should attempt refresh if Twitter token is within 24 hours of expiry', async () => {
            const nearExpiry = Math.floor(Date.now() / 1000) + 3600

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'old-tw-token',
                refresh_token: 'refresh-token-val',
                expires_at: nearExpiry,
                provider: 'twitter',
                providerAccountId: 'user-id',
            } as any)

            const result = await publishToSocials({
                id: 'post-refresh-tw',
                userId: 'user-refresh-tw',
                content: 'Refreshed Twitter',
                platform: 'TWITTER',
            })

            expect(prisma.account.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    access_token: 'default-new-token',
                })
            }))
            expect(result.success).toBe(true)
        })
    })

    describe('LinkedIn', () => {
        it('should post to LinkedIn via Axios', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'linkedin-token',
                providerAccountId: 'urn:li:person:123',
                // Add valid expiry
                expires_at: Math.floor(Date.now() / 1000) + 100000,
            } as any)

            vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 })

            const result = await publishToSocials({
                id: 'post-1',
                userId: 'user-1',
                content: 'Hello LinkedIn',
                platform: 'LINKEDIN',
            })

            expect(result.success).toBe(true)
            expect(axios.post).toHaveBeenCalledWith(
                'https://api.linkedin.com/v2/ugcPosts',
                expect.anything(),
                expect.anything()
            )
        })

        it('should post image to LinkedIn', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'linkedin-token',
                providerAccountId: 'urn:li:person:123',
                expires_at: Math.floor(Date.now() / 1000) + 100000,
            } as any)

            // 1. Register Upload Mock
            vi.mocked(axios.post).mockResolvedValueOnce({
                data: {
                    value: {
                        uploadMechanism: {
                            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": {
                                uploadUrl: "https://upload.linkedin.com/image"
                            }
                        },
                        asset: "urn:li:digitalmediaAsset:123"
                    }
                }
            })

            // 2. Upload Binary Mock
            vi.mocked(axios.put).mockResolvedValueOnce({ status: 201 })

            // 3. Publish Post Mock
            vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 })

            const result = await publishToSocials({
                id: 'post-img-li',
                userId: 'user-1',
                content: 'Image LI',
                platform: 'LINKEDIN',
                imageUrl: 'data:image/png;base64,abcdef',
            })

            expect(result.success).toBe(true)

            // Verify Register called
            expect(axios.post).toHaveBeenNthCalledWith(1,
                "https://api.linkedin.com/v2/assets?action=registerUpload",
                expect.anything(),
                expect.anything()
            )
        })

        it('should attempt refresh and fail if LinkedIn token is expired and refresh fails', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-li-token',
                refresh_token: 'refresh-token',
                expires_at: Math.floor(Date.now() / 1000) - 3600,
                provider: 'linkedin',
                providerAccountId: 'user-id',
            } as any)

            vi.mocked(axios.post).mockRejectedValueOnce(new Error('Refresh failed'))

            const result = await publishToSocials({
                id: 'post-expired-li',
                userId: 'user-expired-li',
                content: 'Should fail',
                platform: 'LINKEDIN',
            })

            expect(result.success).toBe(false)
            expect(axios.post).toHaveBeenCalledWith(
                "https://www.linkedin.com/oauth/v2/accessToken",
                expect.anything(),
                expect.anything()
            )
        })

        it('should attempt refresh if LinkedIn token is within 7 days of expiry', async () => {
            const nearExpiry = Math.floor(Date.now() / 1000) + 100000

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

            const result = await publishToSocials({
                id: 'post-refresh-li',
                userId: 'user-refresh-li',
                content: 'Refreshed LI',
                platform: 'LINKEDIN',
            })

            expect(result.success).toBe(true)
            expect(prisma.account.update).toHaveBeenCalled()
        })
    })

    describe('Threads', () => {
        it('should complete the 2-step publishing flow', async () => {
            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'threads-token',
                expires_at: Math.floor(Date.now() / 1000) + 3000000,
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

        it('should return error if Threads token is expired and refresh fails', async () => {
            const expiredTime = Math.floor(Date.now() / 1000) - 3600

            vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
                access_token: 'expired-token',
                expires_at: expiredTime,
                provider: 'threads',
                providerAccountId: 'user-id',
            } as any)

            vi.mocked(axios.get).mockRejectedValueOnce(new Error('Refresh failed'))

            const result = await publishToSocials({
                id: 'post-expired',
                userId: 'user-expired',
                content: 'Should fail',
                platform: 'THREADS',
            })

            expect(result.success).toBe(false)
            expect(axios.get).toHaveBeenCalledWith(
                "https://graph.threads.net/refresh_access_token",
                expect.anything()
            )
        })

        it('should attempt refresh if token is within 30 days of expiry', async () => {
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
            // 2. Status check call
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: { status: 'FINISHED' }
            })

            // Mocks for posting
            vi.mocked(axios.post)
                .mockResolvedValueOnce({ data: { id: 'container-123' } })
                .mockResolvedValueOnce({ data: { id: 'published-id' } })

            const result = await publishToSocials({
                id: 'post-refresh',
                userId: 'user-refresh',
                content: 'Refreshed Post',
                platform: 'THREADS',
            })

            expect(result.success).toBe(true)
            expect(prisma.account.update).toHaveBeenCalled()
        })
    })
})
