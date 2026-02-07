import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderVideoAction } from '../render-video'

// Mock AWS S3 using Vitest's import mocking
// Need to mock the whole module structure
const mockSend = vi.fn()
const mockGetSignedUrl = vi.fn()

vi.mock('@aws-sdk/client-s3', () => ({
    S3Client: class {
        send = mockSend
    },
    PutObjectCommand: class { },
    GetObjectCommand: class { },
}))

vi.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: mockGetSignedUrl,
}))

vi.mock('@remotion/lambda/client', () => ({
    renderMediaOnLambda: vi.fn().mockResolvedValue({
        renderId: 'render-123',
        bucketName: 'test-bucket',
    }),
}))

describe('Render Video Action', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
        process.env.REMOTION_AWS_ACCESS_KEY_ID = 'test-key'
        process.env.REMOTION_AWS_SECRET_ACCESS_KEY = 'test-secret'
    })

    it('should upload assets and trigger lambda render', async () => {
        mockGetSignedUrl.mockResolvedValue('https://signed-url.com/asset.png')

        const scenes = [
            { imageUrl: 'data:image/png;base64,image data', text: 'Scene 1' },
            { imageUrl: 'https://already-url.com/img.png', text: 'Scene 2' },
        ]
        const audioUrl = 'data:audio/wav;base64,audio data'

        const result = await renderVideoAction(scenes, audioUrl)

        // Should upload 1 image (scene 1)
        // Should upload 1 audio
        expect(mockSend).toHaveBeenCalledTimes(2)
        expect(mockGetSignedUrl).toHaveBeenCalledTimes(2)

        // Verify Remotion call is implicitly checked by the success return (mocked resolved value)
        expect(result).toEqual({
            success: true,
            renderId: 'render-123',
            bucketName: 'test-bucket',
            region: expect.any(String),
        })
    })

    it('should handle missing credentials', async () => {
        delete process.env.REMOTION_AWS_ACCESS_KEY_ID
        const result = await renderVideoAction([], undefined)
        expect(result).toEqual({ success: false, error: 'AWS Credentials missing' })
    })
})
