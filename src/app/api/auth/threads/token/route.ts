import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type");
        let body: URLSearchParams;

        if (contentType?.includes("application/x-www-form-urlencoded")) {
            const text = await request.text();
            body = new URLSearchParams(text);
        } else {
            // Should be form-urlencoded from NextAuth, but handle json just in case
            const json = await request.json();
            body = new URLSearchParams(json);
        }

        // threads requires client_id/secret in body? NextAuth sends it based on client settings.
        // We will ensure they are present.
        if (!body.has("client_id")) {
            body.append("client_id", process.env.AUTH_THREADS_ID!);
        }
        if (!body.has("client_secret")) {
            body.append("client_secret", process.env.AUTH_THREADS_SECRET!);
        }

        // Log for debugging
        console.log("[Token Proxy] Forwarding request to Threads", {
            redirect_uri: body.get("redirect_uri"),
            code_preview: body.get("code")?.slice(0, 5) + "...",
            has_client_id: body.has("client_id"),
            has_client_secret: body.has("client_secret"),
            grant_type: body.get("grant_type")
        });

        const threadsResponse = await fetch("https://graph.threads.net/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        });

        const data = await threadsResponse.json();

        console.log("[Token Proxy] Received response from Threads", {
            status: threadsResponse.status,
            data_keys: Object.keys(data),
            has_error: !!data.error
        });

        if (!threadsResponse.ok) {
            return NextResponse.json(data, { status: threadsResponse.status });
        }

        // Fix missing token_type
        if (!data.token_type) {
            data.token_type = "Bearer";
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Token Proxy] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
