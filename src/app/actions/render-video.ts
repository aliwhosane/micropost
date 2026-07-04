'use server';

import {
    renderMediaOnLambda,
} from '@remotion/lambda/client';
// Note: We use the client import if running in a serverless env to avoid bundling heavy Node deps,
// but for standard Node server actions, we main imports are fine.
// Actually, for Next.js Server Actions (Node runtime), we can use the main package.

import { REGION, SITE_ID, FUNCTION_NAME, BUCKET_NAME } from '../../lib/lambda-config'; // Correct path to src/lib

export async function renderVideoAction(scenes: any[], audioUrl?: string, durationInFrames?: number) {
    console.log("Starting renderVideoAction...");
    try {
        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID) {
            throw new Error("AWS Credentials missing");
        }

        // Initialize S3 Client
        const { S3Client, PutObjectCommand, GetObjectCommand } = await import("@aws-sdk/client-s3");
        const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

        const client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: process.env.REMOTION_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.REMOTION_AWS_SECRET_ACCESS_KEY!,
            },
        });

        // Helper to upload buffer and get signed URL
        const uploadAndSign = async (base64Data: string, keyPrefix: string): Promise<string> => {
            if (!base64Data.startsWith("data:")) return base64Data; // Already a URL

            try {
                // Extract buffer and mime type
                const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    throw new Error("Invalid base64 string");
                }
                const contentType = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');
                const key = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).substring(7)}`;

                // Upload
                await client.send(new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: contentType,
                }));

                // Sign URL (Read-only, 1 hour validity)
                const signedUrl = await getSignedUrl(client, new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                }), { expiresIn: 3600 });

                return signedUrl;
            } catch (e) {
                console.error("S3 Upload Error:", e);
                throw e;
            }
        };

        // 1. Process Audio
        let finalAudioUrl = audioUrl;
        if (audioUrl) {
            console.log("Uploading audio to S3...");
            finalAudioUrl = await uploadAndSign(audioUrl, "audio-assets");
        }

        // 2. Process Scenes (Parallel Uploads)
        console.log("Uploading scene images to S3...");
        const finalScenes = await Promise.all(scenes.map(async (scene) => {
            if (scene.imageUrl) {
                const s3Url = await uploadAndSign(scene.imageUrl, "image-assets");
                return { ...scene, imageUrl: s3Url };
            }
            return scene;
        }));

        console.log("Assets uploaded. Invoking Lambda...");

        const inputProps = {
            scenes: finalScenes,
            audioUrl: finalAudioUrl,
            durationInFrames: durationInFrames // Explicitly pass total duration
        };

        const { renderId, bucketName } = await renderMediaOnLambda({
            region: REGION,
            functionName: FUNCTION_NAME,
            serveUrl: SITE_ID, // The ID of the deployed site on S3
            // @ts-ignore
            bucketName: BUCKET_NAME,
            composition: "ShortsMaker",
            inputProps,
            codec: "h264",
            framesPerLambda: 450, // Split into ~15s chunks to avoid timeout (single lambda limit 240s)
            privacy: "public",
        });

        console.log("Lambda invoked successfully. Render ID:", renderId);
        return { success: true, renderId, bucketName, region: REGION };

    } catch (error: any) {
        console.error("Lambda Render Error:", error);
        return { success: false, error: error.message };
    }
}
