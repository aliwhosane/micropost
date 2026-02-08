'use server';

import { getRenderProgress } from '@remotion/lambda/client';
import { REGION, FUNCTION_NAME, BUCKET_NAME } from '../../lib/lambda-config';

export async function getRenderStatusAction(renderId: string, bucketName: string) {
    if (!renderId || !bucketName) {
        return { success: false, error: "Missing renderId or bucketName" };
    }

    try {
        if (!process.env.REMOTION_AWS_ACCESS_KEY_ID) {
            throw new Error("AWS Credentials missing");
        }

        const progress = await getRenderProgress({
            renderId,
            bucketName,
            functionName: FUNCTION_NAME,
            region: REGION,
        });

        if (progress.fatalErrorEncountered) {
            return {
                success: false,
                status: "error",
                error: progress.errors[0]?.message || "Render failed"
            };
        }

        if (progress.done) {
            return {
                success: true,
                status: "done",
                outputFile: progress.outputFile,
                url: progress.outputFile // The presigned URL or direct link depending on config
            };
        }

        return {
            success: true,
            status: "rendering",
            progress: progress.overallProgress
        };

    } catch (error: any) {
        console.error("Render Status Error:", error);
        return { success: false, error: error.message };
    }
}
