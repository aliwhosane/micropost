import { ScriptWizard } from "@/components/dashboard/ShortsMaker/ScriptWizard";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ShortsMakerPage(props: { searchParams: Promise<{ source_post_id?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) return redirect("/login");

    let initialContent = "";

    if (searchParams.source_post_id) {
        const post = await prisma.post.findUnique({
            where: { id: searchParams.source_post_id },
            select: { content: true, userId: true }
        });

        // Basic security check: ensure user owns post or is admin (if we had admin)
        // Here we just check user ID match if we want strictness, or just let it be open if it's a "team" app?
        // Using session.user.id compared to post.userId is safer.
        if (post && post.userId === session.user.id) {
            initialContent = post.content;
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface">ShortsMaker</h1>
                <p className="text-on-surface-variant">Turn ideas into viral TikTok/Reels scripts and storyboards in seconds.</p>
            </div>

            <ScriptWizard initialContent={initialContent} />
        </div>
    );
}
