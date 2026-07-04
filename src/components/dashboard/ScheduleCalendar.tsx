"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, Twitter, Linkedin, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledFor: string; // ISO date string
  status: string;
}

interface ScheduleCalendarProps {
  posts: ScheduledPost[];
}

const PLATFORM_CONFIG: Record<string, {
  color: string;
  badge: string;
  badgeColor: string;
  label: string;
  icon: typeof Twitter;
}> = {
  TWITTER: {
    color: "bg-sky-500/10 border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-400",
    badgeColor: "bg-sky-500",
    label: "X",
    icon: Twitter,
  },
  LINKEDIN: {
    color: "bg-blue-600/10 border-blue-600/30",
    badge: "bg-blue-600/20 text-blue-400",
    badgeColor: "bg-blue-600",
    label: "LI",
    icon: Linkedin,
  },
  THREADS: {
    color: "bg-purple-500/10 border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400",
    badgeColor: "bg-purple-500",
    label: "TH",
    icon: AtSign,
  },
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${year}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`;
}

function PostBlock({ post }: { post: ScheduledPost }) {
  const [expanded, setExpanded] = useState(false);
  const time = new Date(post.scheduledFor).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const config = PLATFORM_CONFIG[post.platform] || {
    color: "bg-surface-variant/30 border-outline-variant/20",
    badge: "bg-surface-variant/30 text-on-surface-variant",
    badgeColor: "bg-on-surface-variant",
    label: post.platform?.slice(0, 2) || "??",
    icon: Calendar,
  };

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
        config.color
      )}
    >
      {/* Time + Platform badge row */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <Clock className="w-3 h-3 text-on-surface-variant/50 shrink-0" />
        <span className="text-on-surface-variant/80 font-semibold text-[11px] tracking-wide">
          {time}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider",
            config.badge
          )}
        >
          <Icon className="w-2.5 h-2.5" />
          {config.label}
        </span>
      </div>

      {/* Content */}
      <p
        className={cn(
          "text-on-surface leading-snug font-medium transition-all",
          expanded ? "" : "line-clamp-2"
        )}
      >
        {post.content}
      </p>

      {/* Status badge */}
      {post.status && post.status !== "APPROVED" && (
        <div className="mt-1.5">
          <span
            className={cn(
              "inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide",
              post.status === "PUBLISHED"
                ? "bg-emerald-500/15 text-emerald-500"
                : post.status === "FAILED"
                  ? "bg-red-500/15 text-red-500"
                  : "bg-amber-500/15 text-amber-500"
            )}
          >
            {post.status}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function ScheduleCalendar({ posts }: ScheduleCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate week start (Monday), done immutably
  const weekStart = useMemo(() => {
    const monday = getMonday(new Date());
    monday.setDate(monday.getDate() + weekOffset * 7);
    return monday;
  }, [weekOffset]);

  // Generate 7 days
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStart]);

  // Group posts by day (YYYY-MM-DD key)
  const postsByDay = useMemo(() => {
    const map = new Map<string, ScheduledPost[]>();
    posts.forEach((post) => {
      if (!post.scheduledFor) return;
      const date = new Date(post.scheduledFor);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    });
    // Sort within each day by time
    map.forEach((dayPosts) => {
      dayPosts.sort(
        (a, b) =>
          new Date(a.scheduledFor).getTime() -
          new Date(b.scheduledFor).getTime()
      );
    });
    return map;
  }, [posts]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const toKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // Count total posts in this week
  const weekPostCount = days.reduce((sum, day) => {
    return sum + (postsByDay.get(toKey(day))?.length || 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/10">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="p-2 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-1 text-center min-w-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-on-surface text-sm sm:text-base truncate">
              Week of {formatWeekRange(weekStart)}
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/60 font-medium">
            {weekPostCount} post{weekPostCount !== 1 ? "s" : ""} scheduled
          </span>
        </div>

        <div className="flex items-center gap-2">
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid — Desktop */}
      <div className="hidden md:grid grid-cols-7 gap-2 min-h-[320px]">
        {days.map((date, i) => {
          const key = toKey(date);
          const dayPosts = postsByDay.get(key) || [];
          const today = isToday(date);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex flex-col rounded-2xl border p-3 transition-colors min-h-[200px]",
                today
                  ? "bg-primary/5 border-primary/25 ring-1 ring-primary/15"
                  : "bg-surface border-outline-variant/10 hover:border-outline-variant/25"
              )}
            >
              {/* Day header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/10">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    today ? "text-primary" : "text-on-surface-variant/60"
                  )}
                >
                  {DAY_NAMES[i]}
                </span>
                <span
                  className={cn(
                    "ml-auto inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold",
                    today
                      ? "bg-primary text-on-primary"
                      : "text-on-surface"
                  )}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Posts */}
              <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {dayPosts.length > 0 ? (
                    dayPosts.map((post) => (
                      <PostBlock key={post.id} post={post} />
                    ))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] text-on-surface-variant/40 text-center pt-6 font-medium"
                    >
                      No posts
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Post count indicator */}
              {dayPosts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant/50 font-semibold">
                    {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Calendar — Mobile (horizontal scroll) */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {days.map((date, i) => {
            const key = toKey(date);
            const dayPosts = postsByDay.get(key) || [];
            const today = isToday(date);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex flex-col rounded-2xl border p-3 snap-center",
                  "w-[200px] min-h-[250px] shrink-0",
                  today
                    ? "bg-primary/5 border-primary/25 ring-1 ring-primary/15"
                    : "bg-surface border-outline-variant/10"
                )}
              >
                {/* Day header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/10">
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      today ? "text-primary" : "text-on-surface-variant/60"
                    )}
                  >
                    {DAY_NAMES[i]}
                  </span>
                  <span
                    className={cn(
                      "ml-auto inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold",
                      today
                        ? "bg-primary text-on-primary"
                        : "text-on-surface"
                    )}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Posts */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {dayPosts.length > 0 ? (
                      dayPosts.map((post) => (
                        <PostBlock key={post.id} post={post} />
                      ))
                    ) : (
                      <p className="text-[11px] text-on-surface-variant/40 text-center pt-8 font-medium">
                        No posts
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div
              key={key}
              className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/70"
            >
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  config.badgeColor
                )}
              />
              <Icon className="w-3 h-3" />
              <span className="font-medium capitalize">
                {key === "TWITTER" ? "X / Twitter" : key.charAt(0) + key.slice(1).toLowerCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
