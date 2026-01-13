declare module 'yt-transcript-api' {
    export interface TranscriptItem {
        text: string;
        start: number;
        duration: number;
    }

    export class YouTubeTranscriptApi {
        static fetch(videoId: string): Promise<TranscriptItem[]>;
    }
}
