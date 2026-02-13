import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createScriptAction, renderStoryboardAction, generateAudioAction } from '../shorts'
import * as aiLib from '@/lib/ai'
import * as imageGenLib from '@/lib/image-gen'
import * as s3HelperLib from '@/lib/s3-helper'
import * as audioLib from '@/lib/audio'

// Mock dependencies
vi.mock('@/lib/ai', () => ({
    generateVideoScript: vi.fn(),
}))

vi.mock('@/lib/image-gen', () => ({
    generateVerticalStats: vi.fn(),
    generateAiImage: vi.fn(),
}))

vi.mock('@/lib/s3-helper', () => ({
    // Define dummy implementations to match signatures if needed in complex logic, 
    // but for now, simple mocks work.
    uploadBufferAndSign: vi.fn(),
    uploadAndSign: vi.fn(),
}))

vi.mock('@/lib/audio', () => ({
    generateSpeech: vi.fn(),
}))

describe('Server Actions: Shorts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createScriptAction', () => {
        it('should return success and script when generation works', async () => {
            const mockScript = { scenes: [] }
            vi.mocked(aiLib.generateVideoScript).mockResolvedValueOnce(mockScript as any)

            const result = await createScriptAction('test input')

            expect(aiLib.generateVideoScript).toHaveBeenCalledWith('test input')
            expect(result).toEqual({ success: true, script: mockScript })
        })

        it('should return error when generation fails', async () => {
            vi.mocked(aiLib.generateVideoScript).mockRejectedValueOnce(new Error('AI Error'))

            const result = await createScriptAction('test input')

            expect(result).toEqual({ success: false, error: 'Failed to generate script' })
        })
    })

    describe('renderStoryboardAction', () => {
        it('should process scenes and upload to S3 (MINIMAL style)', async () => {
            const scenes = [{ text: 'Scene 1', type: 'BODY' }]
            const mockBuffer = Buffer.from('image')
            const mockS3Url = 'https://s3.url/image.png'

            vi.mocked(imageGenLib.generateVerticalStats).mockResolvedValueOnce(mockBuffer as any)
            vi.mocked(s3HelperLib.uploadBufferAndSign).mockResolvedValueOnce(mockS3Url)

            const result = await renderStoryboardAction(scenes, 'MINIMAL')

            expect(imageGenLib.generateVerticalStats).toHaveBeenCalledWith('Scene 1', 'BODY', undefined)
            expect(s3HelperLib.uploadBufferAndSign).toHaveBeenCalledWith(mockBuffer, 'image/png', 'storyboards')
            expect(result).toEqual({
                success: true,
                scenes: [{ ...scenes[0], imageUrl: mockS3Url }]
            })
        })

        it('should generate AI background for CINEMATIC style', async () => {
            const scenes = [{ text: 'Scene 1', type: 'INTRO' }]
            const mockAiImage = 'data:image/jpeg;base64,xyz'
            const mockBuffer = Buffer.from('image')
            const mockS3Url = 'https://s3.url/image.png'

            vi.mocked(imageGenLib.generateAiImage).mockResolvedValueOnce(mockAiImage)
            vi.mocked(imageGenLib.generateVerticalStats).mockResolvedValueOnce(mockBuffer as any)
            vi.mocked(s3HelperLib.uploadBufferAndSign).mockResolvedValueOnce(mockS3Url)

            const result = await renderStoryboardAction(scenes, 'CINEMATIC')

            expect(imageGenLib.generateAiImage).toHaveBeenCalledWith('Scene 1', 'TIKTOK')
            expect(imageGenLib.generateVerticalStats).toHaveBeenCalledWith('Scene 1', 'INTRO', mockAiImage)
            expect(result.success).toBe(true)
        })
    })

    describe('generateAudioAction', () => {
        it('should generate audio and upload to S3', async () => {
            const mockAudioBase64 = 'audiobase64'
            const mockS3Url = 'https://s3.url/audio.wav'

            vi.mocked(audioLib.generateSpeech).mockResolvedValueOnce(mockAudioBase64)
            vi.mocked(s3HelperLib.uploadAndSign).mockResolvedValueOnce(mockS3Url)

            const result = await generateAudioAction('Hello', 'Voice1')

            expect(audioLib.generateSpeech).toHaveBeenCalledWith('Hello', 'Voice1')
            expect(s3HelperLib.uploadAndSign).toHaveBeenCalledWith(`data:audio/wav;base64,${mockAudioBase64}`, 'voiceovers')
            expect(result).toEqual({ success: true, audio: mockS3Url })
        })

        it('should handle errors', async () => {
            vi.mocked(audioLib.generateSpeech).mockRejectedValueOnce(new Error('TTS Error'))
            const result = await generateAudioAction('Hello')
            expect(result).toEqual({ success: false, error: 'Failed to generate audio' })
        })
    })
})
