"use server";

import { signIn } from "@/auth";
import { cookies } from "next/headers";

export async function connectClientAccount(provider: string, clientId: string) {
    const cookieStore = await cookies();
    // Set cookie to identify which client this connection is for
    cookieStore.set("micropost_connecting_client_id", clientId, { path: "/", maxAge: 60 * 5 }); // 5 mins

    // Trigger sign in
    await signIn(provider, { redirectTo: "/dashboard/settings" });
}
