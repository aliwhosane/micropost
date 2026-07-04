
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { REGION, BUCKET_NAME } from "./lambda-config";

// Lazy initialize client to avoid errors if env vars missing during build
let client: S3Client | null = null;

function getClient() {
    if (!client) {
        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID || !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            throw new Error("AWS Credentials missing");
        }
        client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: process.env.REMOTION_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REMOTION_AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    return client;
}

/**
 * Uploads a buffer directly to S3 and returns a signed URL.
 */
export async function uploadBufferAndSign(buffer: Buffer, mimeType: string, keyPrefix: string): Promise<string> {
    try {
        const s3 = getClient();
        const key = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Upload
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        }));

        // Sign URL (Read-only, 1 hour validity)
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }), { expiresIn: 3600 });

        return signedUrl;
    } catch (e) {
        console.error("S3 Upload Error:", e);
        throw e;
    }
}

/**
 * Uploads a base64 string to S3 and returns a signed URL.
 * If input is already a URL, returns it as is.
 */
export async function uploadAndSign(base64Data: string, keyPrefix: string): Promise<string> {
    if (!base64Data || !base64Data.startsWith("data:")) return base64Data; // Already a URL or empty

    try {
        // Extract buffer and mime type
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error("Invalid base64 string");
        }
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');

        return await uploadBufferAndSign(buffer, contentType, keyPrefix);
    } catch (e) {
        console.error("S3 Upload Helper Error:", e);
        throw e;
    }
}
