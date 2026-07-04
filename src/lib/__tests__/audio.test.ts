import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist the mock function so it's available in the factory
const { mockGenerateContent } = vi.hoisted(() => {
    return { mockGenerateContent: vi.fn() }
})

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent,
            }
        },
    }
})

// Import after mock setup
import { generateSpeech } from '../audio'

describe('generateSpeech', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should call Gemini API with correct parameters and return base64 audio', async () => {
        const mockAudioData = Buffer.from('RIFF_MOCK_WAV_DATA').toString('base64')

        mockGenerateContent.mockResolvedValueOnce({
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                inlineData: {
                                    data: mockAudioData,
                                },
                            },
                        ],
                    },
                },
            ],
        })

        const text = 'Hello world'
        const result = await generateSpeech(text)

        expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
            config: expect.objectContaining({
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            }),
        }))

        expect(result).toBe(mockAudioData)
    })

    it('should handle MP3 data correctly (pass through)', async () => {
        // Mock MP3 header (ID3)
        const mp3Buffer = Buffer.from('ID3_MOCK_MP3_DATA')
        const mockAudioData = mp3Buffer.toString('base64')

        mockGenerateContent.mockResolvedValueOnce({
            candidates: [{ content: { parts: [{ inlineData: { data: mockAudioData } }] } }],
        })

        const result = await generateSpeech('test')
        expect(result).toBe(mockAudioData)
    })

    it('should throw error when no data is returned', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            candidates: [], // Empty candidates
        })

        await expect(generateSpeech('test')).rejects.toThrow('Failed to generate speech.')
    })

    it('should throw error when API call fails', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('API Error'))
        await expect(generateSpeech('test')).rejects.toThrow('Failed to generate speech.')
    })
})
