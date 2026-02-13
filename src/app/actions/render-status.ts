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
                error: progress.errors[0]?.message || "Render failed",
                fatalErrorEncountered: true,
                done: false
            };
        }

        if (progress.done) {
            return {
                success: true,
                status: "done",
                outputFile: progress.outputFile,
                url: progress.outputFile,
                done: true,
                fatalErrorEncountered: false
            };
        }

        return {
            success: true,
            status: "rendering",
            progress: progress.overallProgress,
            done: false,
            fatalErrorEncountered: false
        };

    } catch (error: any) {
        console.error("Render Status Error:", error);
        return {
            success: false,
            status: "error",
            error: error.message,
            done: false,
            fatalErrorEncountered: true
        };
    }
}
