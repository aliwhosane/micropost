import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist mock
const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn(),
}))

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: mockGenerateContent,
                }
            }
        },
    }
})

// Import after mock
import { generateSocialPost, generateVideoScript } from '../ai'

describe('AI Lib', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('generateSocialPost', () => {
        it('should generate a post for Twitter', async () => {
            mockGenerateContent.mockResolvedValueOnce({
                response: { text: () => 'Generated Tweet #hashtag' },
            })

            const params = {
                topics: ['Tech'],
                platform: 'TWITTER' as const,
                topicAttributes: [{ name: 'Tech', stance: 'Optimistic' }],
            }

            const result = await generateSocialPost(params)

            expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('Platform: TWITTER'))
            expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('User\'s Stance/Perspective: Optimistic'))
            expect(result).toEqual({ content: 'Generated Tweet #hashtag', topic: 'Tech' })
        })

        it('should handle errors gracefully', async () => {
            mockGenerateContent.mockRejectedValueOnce(new Error('AI Error'))

            const result = await generateSocialPost({ topics: ['Tech'], platform: 'TWITTER' })

            expect(result.content).toBe('Error generating content. Please try again later.')
        })
    })

    describe('generateVideoScript', () => {
        it('should parse valid JSON script', async () => {
            const mockScript = {
                title: 'Video 1',
                scenes: [{ id: '1', type: 'HOOK', text: 'Hello', visualCue: 'Wave' }],
            }
            mockGenerateContent.mockResolvedValueOnce({
                response: { text: () => JSON.stringify(mockScript) },
            })

            const result = await generateVideoScript('Topic A')

            expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('expert TikTok/Reels scriptwriter'))
            expect(result).toEqual(mockScript)
        })

        it('should handle markdown code blocks in response', async () => {
            const mockScript = { title: 'Video 1', scenes: [] }
            mockGenerateContent.mockResolvedValueOnce({
                response: { text: () => '```json\n' + JSON.stringify(mockScript) + '\n```' },
            })

            const result = await generateVideoScript('Topic A')
            expect(result).toEqual(mockScript)
        })
    })
})
