import { runDailyGeneration } from "@/lib/workflow";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Check for Vercel Cron Secret
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const results = await runDailyGeneration();
        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: "Workflow failed" }, { status: 500 });
    }
}
