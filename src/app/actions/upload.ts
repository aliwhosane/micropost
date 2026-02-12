"use server";

import { uploadBufferAndSign } from "@/lib/s3-helper";

export async function uploadImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        if (!file.type.startsWith("image/")) {
            return { success: false, error: "Invalid file type. Please upload an image." };
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return { success: false, error: "File too large. Max 5MB." };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadBufferAndSign(buffer, file.type, "uploads");

        return { success: true, url };
    } catch (error) {
        console.error("Upload Action Error:", error);
        return { success: false, error: "Upload failed." };
    }
}
