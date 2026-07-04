/**
 * deploy-remotion.ts
 * Run this with `npx tsx src/tools/deploy-remotion.ts`
 */
import {
    deploySite,
    getOrCreateBucket,
    deployFunction,
} from '@remotion/lambda';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { VERSION } from 'remotion/version';

dotenv.config();

const REGION = 'us-east-1';

async function main() {
    console.log('🚀 Deploying Remotion Lambda...');

    // 1. Bucket
    console.log('📦 Checking Bucket...');
    const { bucketName } = await getOrCreateBucket({
        region: REGION,
    });
    console.log(`✅ Bucket: ${bucketName}`);

    // 2. Site
    console.log('🌐 Bundling and Uploading Site...');
    const { serveUrl, siteName } = await deploySite({
        bucketName,
        entryPoint: path.join(process.cwd(), 'src/remotion/index.ts'),
        region: REGION,
        siteName: "shorts-maker-prod"
    });
    console.log(`✅ Site Deployed: ${serveUrl}`);

    // 3. Function
    console.log('λ Checking Lambda Function...');
    let functionName;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const res = await deployFunction({
                region: REGION,
                createCloudWatchLogGroup: true,
                memorySizeInMb: 2048,
                timeoutInSeconds: 240
            });
            functionName = res.functionName;
            break; // Success
        } catch (err: any) {
            if (err.name === 'InvalidParameterValueException' && err.message.includes('role')) {
                const waitTime = (i + 1) * 10000; // 10s, 20s, 30s...
                console.log(`⏳ Role propagation delay detected (Attempt ${i + 1}/${maxRetries}). Retrying in ${waitTime / 1000}s...`);
                await new Promise(r => setTimeout(r, waitTime));
            } else {
                throw err;
            }
        }
    }

    if (!functionName) {
        throw new Error("Failed to deploy function after multiple retries due to IAM Role propagation.");
    }
    console.log(`✅ Function: ${functionName}`);

    // 4. Save Config
    const configContent = `
export const REGION = '${REGION}';
export const SITE_ID = '${serveUrl}';
export const FUNCTION_NAME = '${functionName}';
export const BUCKET_NAME = '${bucketName}';
    `.trim();

    fs.writeFileSync(path.join(process.cwd(), 'src/lib/lambda-config.ts'), configContent);
    console.log('💾 Configuration saved to src/lib/lambda-config.ts');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
