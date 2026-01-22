import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // TODO: Verify request signature from Meta
        // const signature = request.headers.get('x-normalized-request-signed_request');

        console.log("Received Threads Deauthorize Request");

        // This endpoint is called when a user removes the app from their settings.
        // We should ideally remove the Threads access token from the user's account.

        return NextResponse.json({ success: true, message: "Deauthorized" });
    } catch (error) {
        console.error("Threads Deauthorize Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
