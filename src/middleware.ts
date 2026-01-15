import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { apiRateLimiter } from "./lib/rate-limit";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    // API Rate Limiting
    if (req.nextUrl.pathname.startsWith("/api")) {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        // Use a simple composite key if detailed trust needed, but IP is standard

        if (!apiRateLimiter.check(ip)) {
            return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
                status: 429,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // UPDATED: Removed 'api' from the exclusion list so middleware runs on API routes
    matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
