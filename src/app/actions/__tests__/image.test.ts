import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateVisionAction, savePostImageAction, removePostImageAction } from '../image'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { generateSocialCard, generateAiImage } from '@/lib/image-gen'

// Mock dependencies
vi.mock('@/lib/db', () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        post: { findUnique: vi.fn(), update: vi.fn() }
    }
}))

vi.mock('@/auth', () => ({
    auth: vi.fn()
}))

vi.mock('@/lib/image-gen', () => ({
    generateSocialCard: vi.fn(),
    generateAiImage: vi.fn()
}))

// Mock Gemini SDK for quote extraction
const mockGenerateContent = vi.fn()
const mockGetGenerativeModel = vi.fn(() => ({
    generateContent: mockGenerateContent
}))

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}))

describe('image actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default auth mock
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any)
    })

    describe('generateVisionAction', () => {
        it('generates SNAP visual', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ name: 'User', image: 'avatar.png' } as any)
            vi.mocked(generateSocialCard).mockResolvedValue(Buffer.from('fake-image'))

            const result = await generateVisionAction('SNAP', 'Content', 'TWITTER')

            expect(generateSocialCard).toHaveBeenCalledWith('Content', 'SNAP', '@User', 'TWITTER', 'avatar.png')
            expect(result).toContain('data:image/png;base64,')
        })

        it('extracts quote for QUOTE type', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ name: 'User' } as any)
            mockGenerateContent.mockResolvedValue({
                response: { text: () => 'Punchy Quote' }
            })
            vi.mocked(generateSocialCard).mockResolvedValue(Buffer.from('fake-image'))

            await generateVisionAction('QUOTE', 'Long content here', 'LINKEDIN')

            // Verify Gemini called
            expect(mockGetGenerativeModel).toHaveBeenCalled()
            // Verify card generated with extracted quote, not original content
            expect(generateSocialCard).toHaveBeenCalledWith('Punchy Quote', 'QUOTE', expect.any(String), 'LINKEDIN', undefined)
        })

        it('generates HOOK using AI image', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ name: 'User' } as any)
            vi.mocked(generateAiImage).mockResolvedValue('https://generated-hook.png')

            const result = await generateVisionAction('HOOK', 'Concept', 'THREADS')

            expect(generateAiImage).toHaveBeenCalledWith('Concept', 'THREADS')
            expect(result).toBe('https://generated-hook.png')
        })
    })

    describe('savePostImageAction', () => {
        it('updates post with image url', async () => {
            vi.mocked(prisma.post.findUnique).mockResolvedValue({ platform: 'TWITTER', content: 'Tweet' } as any)

            await savePostImageAction('post-1', 'https://img.com')

            expect(prisma.post.update).toHaveBeenCalledWith({
                where: { id: 'post-1', userId: 'user-1' },
                data: expect.objectContaining({ imageUrl: 'https://img.com' })
            })
        })

        it('appends credit for LinkedIn posts if missing', async () => {
            vi.mocked(prisma.post.findUnique).mockResolvedValue({ platform: 'LINKEDIN', content: 'LinkedIn Post' } as any)

            const result = await savePostImageAction('post-1', 'https://img.com')

            expect(result.newContent).toContain('credit: micropost-ai')
            expect(prisma.post.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ content: expect.stringContaining('credit: micropost-ai') })
            }))
        })
    })

    describe('removePostImageAction', () => {
        it('removes image from post', async () => {
            await removePostImageAction('post-1')
            expect(prisma.post.update).toHaveBeenCalledWith({
                where: { id: 'post-1', userId: 'user-1' },
                data: { imageUrl: null }
            })
        })
    })
})
