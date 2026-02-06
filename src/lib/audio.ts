import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Generates speech from text using Gemini 2.5 Flash TTS.
 * Returns a Base64 string of the audio (WAV/Linear16).
 */
export async function generateSpeech(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'
                    },
                },
            },
        });

        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!data) {
            throw new Error("No audio data returned from Gemini.");
        }

        const audioBuffer = Buffer.from(data, 'base64');

        // Check if it already has a RIFF header (WAV)
        if (audioBuffer.subarray(0, 4).toString('ascii') === 'RIFF') {
            console.log("Gemini returned a valid WAV file. Returning as is.");
            return audioBuffer.toString('base64');
        }

        // Check for MP3 sync word (rough check: FF FB or ID3)
        if (audioBuffer.subarray(0, 3).toString('ascii') === 'ID3' || (audioBuffer[0] === 0xFF && (audioBuffer[1] & 0xE0) === 0xE0)) {
            console.log("Gemini returned MP3 data. Returning as is.");
            return audioBuffer.toString('base64');
        }

        console.log("Gemini returned raw PCM. Adding WAV header.");
        const wavBuffer = addWavHeader(audioBuffer, 24000, 1, 16);
        return wavBuffer.toString('base64');

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        throw new Error("Failed to generate speech.");
    }
}

/**
 * Adds a standard WAV header to raw PCM data.
 * @param pcmData Raw PCM buffer.
 * @param sampleRate Sample rate in Hz (Gemini 2.5 TTS default is 24000).
 * @param numChannels Number of channels (Gemini default is 1).
 * @param bitDepth Bit depth (Gemini default is 16).
 */
function addWavHeader(pcmData: Buffer, sampleRate: number, numChannels: number, bitDepth: number): Buffer {
    const header = Buffer.alloc(44);
    const byteRate = (sampleRate * numChannels * bitDepth) / 8;
    const blockAlign = (numChannels * bitDepth) / 8;
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;

    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(fileSize, 4);
    header.write('WAVE', 8);

    // fmt sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitDepth, 34);

    // data sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmData]);
}
