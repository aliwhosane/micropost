"use server";

import { approvePost } from "@/lib/actions";

export async function batchApproveAction(postIds: string[]) {
    const results = await Promise.allSettled(
        postIds.map((id) => approvePost(id))
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    return { succeeded, failed };
}
