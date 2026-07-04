"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function switchWorkspace(clientId: string | null) {
    console.log("Switching Workspace to:", clientId);
    const cookieStore = await cookies();

    if (clientId) {
        cookieStore.set("micropost_active_client_id", clientId, { path: "/" });
    } else {
        cookieStore.delete("micropost_active_client_id");
    }

    revalidatePath("/dashboard");
}
