import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { imageUrl: true }
        }) as any;

        if (!post || !post.imageUrl) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Check if it's a data URI (base64)
        if (post.imageUrl.startsWith("data:")) {
            const matches = post.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                return new NextResponse("Invalid image data", { status: 500 });
            }

            const contentType = matches[1];
            const buffer = Buffer.from(matches[2], "base64");

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": contentType,
                    "Content-Length": buffer.length.toString(),
                    "Cache-Control": "public, max-age=31536000, immutable",
                },
            });
        }

        // If it's already a URL (future proofing), redirect to it
        return NextResponse.redirect(post.imageUrl);

    } catch (error) {
        console.error("Error serving image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
