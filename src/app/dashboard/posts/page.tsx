import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/dashboard/PostCard";
import { PostsFilterBar } from "@/components/dashboard/PostsFilterBar";
import { ScheduleCalendar } from "@/components/dashboard/ScheduleCalendar";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface PostsPageProps {
  searchParams: Promise<{ platform?: string; status?: string; view?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user?.email) return <div>Please log in</div>;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const activeClientId = cookieStore.get("micropost_active_client_id")?.value;

  // Build where clause based on filters
  const where: any = {
    user: { email: session.user.email },
    clientProfileId: activeClientId || null,
    status: { not: "REJECTED" },
  };

  if (params.platform && params.platform !== "all") {
    where.platform = params.platform;
  }

  if (params.status && params.status !== "all") {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      published: "PUBLISHED",
      approved: "APPROVED",
      failed: "FAILED",
    };
    const mapped = statusMap[params.status];
    if (mapped) {
      if (params.status === "pending") {
        where.status = { in: ["PENDING", "DRAFT"] };
      } else {
        where.status = mapped;
      }
    }
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalCount = await prisma.post.count({
    where: {
      user: { email: session.user.email },
      clientProfileId: activeClientId || null,
      status: { not: "REJECTED" },
    },
  });

  const isCalendarView = params.view === "calendar";

  // Serialize posts for ScheduleCalendar (client component needs plain objects)
  const scheduledPostsForCalendar = isCalendarView
    ? posts
        .filter((p: any) => p.scheduledFor)
        .map((p: any) => ({
          id: p.id,
          content: p.content,
          platform: p.platform || "TWITTER",
          scheduledFor: (p.scheduledFor as Date).toISOString(),
          status: p.status,
        }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
          Posts
        </h2>
        <p className="text-on-surface-variant">
          {totalCount} posts total · Showing {posts.length}
        </p>
      </div>

      <Suspense fallback={null}>
        <PostsFilterBar />
      </Suspense>

      {isCalendarView ? (
        <ScheduleCalendar posts={scheduledPostsForCalendar} />
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              platform={post.platform || "TWITTER"}
              topic={post.topic || "General"}
              createdAt={post.createdAt}
              status={post.status}
              scheduledFor={post.scheduledFor}
              imageUrl={post.imageUrl}
            />
          ))}
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-surface-variant/50">
                <Search className="w-8 h-8 text-on-surface-variant/50" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5 text-on-surface-variant">
                No posts match your filters
              </h3>
              <p className="text-sm text-on-surface-variant/70 max-w-sm leading-relaxed">
                Try changing your filters or create new content to get started.
              </p>
              <div className="mt-5">
                <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors">
                  Create a post
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

