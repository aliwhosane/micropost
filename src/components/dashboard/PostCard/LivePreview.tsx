"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ThumbsUp,
  Send,
  Bookmark,
  BarChart2,
} from "lucide-react";

interface LivePreviewProps {
  content: string;
  platform: string;
  imageUrl?: string | null;
  userName?: string;
  userHandle?: string;
  userAvatar?: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Generate consistent fake engagement numbers from content hash
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function fakeEngagement(content: string) {
  const h = hashCode(content);
  return {
    replies: (h % 47) + 3,
    reposts: (h % 128) + 12,
    likes: (h % 892) + 48,
    views: ((h % 9400) + 1200),
    comments: (h % 34) + 5,
    sends: (h % 18) + 2,
  };
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

// Gradient avatar placeholder
function AvatarPlaceholder({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("rounded-full flex-shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    />
  );
}

function Avatar({
  src,
  size = 40,
  className,
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Avatar"
        className={cn("rounded-full flex-shrink-0 object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return <AvatarPlaceholder size={size} className={className} />;
}

// ─── Twitter Preview ──────────────────────────────────────────

function TwitterPreview({
  content,
  imageUrl,
  userName,
  userHandle,
  userAvatar,
}: Omit<LivePreviewProps, "isOpen" | "onToggle" | "platform">) {
  const engagement = fakeEngagement(content);
  const remaining = 280 - content.length;

  return (
    <div
      className="rounded-2xl border border-outline-variant/20 overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Preview badge */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-surface/50 border-b border-outline-variant/10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-on-surface-variant/40">
          𝕏 Preview
        </span>
        {remaining >= 0 ? (
          <span className="text-[10px] text-on-surface-variant/40">
            {remaining} chars left
          </span>
        ) : (
          <span className="text-[10px] text-error font-medium">
            {Math.abs(remaining)} over limit
          </span>
        )}
      </div>

      <div className="p-4 bg-surface">
        <div className="flex gap-3">
          <Avatar src={userAvatar} size={40} />
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-1 text-[15px]">
              <span className="font-bold text-on-surface truncate">
                {userName || "Your Name"}
              </span>
              {/* Verified badge */}
              <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] flex-shrink-0" fill="#1d9bf0">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.894.142.634-.13 1.219-.437 1.69-.883.445-.47.749-1.055.878-1.69.131-.634.084-1.292-.139-1.9.584-.271 1.084-.7 1.438-1.24.354-.54.551-1.169.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
              <span className="text-on-surface-variant/60 text-[15px] truncate">
                @{userHandle || "handle"}
              </span>
              <span className="text-on-surface-variant/40 text-[15px]">·</span>
              <span className="text-on-surface-variant/60 text-[15px]">2m</span>
            </div>

            {/* Content */}
            <div className="mt-1 text-[15px] leading-[20px] text-on-surface whitespace-pre-wrap break-words">
              {content}
            </div>

            {/* Image */}
            {imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-outline-variant/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Post attachment"
                  className="w-full max-h-[280px] object-cover"
                />
              </div>
            )}

            {/* Engagement bar */}
            <div className="flex items-center justify-between mt-3 max-w-[425px] text-on-surface-variant/50">
              <button className="flex items-center gap-1.5 group/btn hover:text-blue-500 transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
                <span className="text-[13px]">{formatCount(engagement.replies)}</span>
              </button>
              <button className="flex items-center gap-1.5 group/btn hover:text-green-500 transition-colors">
                <Repeat2 className="w-[18px] h-[18px]" />
                <span className="text-[13px]">{formatCount(engagement.reposts)}</span>
              </button>
              <button className="flex items-center gap-1.5 group/btn hover:text-pink-500 transition-colors">
                <Heart className="w-[18px] h-[18px]" />
                <span className="text-[13px]">{formatCount(engagement.likes)}</span>
              </button>
              <button className="flex items-center gap-1.5 group/btn hover:text-blue-500 transition-colors">
                <BarChart2 className="w-[18px] h-[18px]" />
                <span className="text-[13px]">{formatCount(engagement.views)}</span>
              </button>
              <div className="flex items-center gap-3">
                <button className="hover:text-blue-500 transition-colors">
                  <Bookmark className="w-[18px] h-[18px]" />
                </button>
                <button className="hover:text-blue-500 transition-colors">
                  <Share className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn Preview ─────────────────────────────────────────

function LinkedInPreview({
  content,
  imageUrl,
  userName,
  userAvatar,
}: Omit<LivePreviewProps, "isOpen" | "onToggle" | "platform" | "userHandle">) {
  const engagement = fakeEngagement(content);
  const truncated = content.length > 300;
  const displayContent = truncated ? content.slice(0, 300) : content;

  return (
    <div
      className="rounded-xl border border-outline-variant/20 overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Preview badge */}
      <div className="px-4 pt-2 pb-1 flex items-center bg-surface/50 border-b border-outline-variant/10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-on-surface-variant/40">
          LinkedIn Preview
        </span>
      </div>

      <div className="p-4 bg-surface">
        {/* Profile row */}
        <div className="flex gap-2.5">
          <Avatar src={userAvatar} size={48} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-on-surface leading-tight">
              {userName || "Your Name"}
            </div>
            <div className="text-xs text-on-surface-variant/60 leading-tight mt-0.5">
              Content Creator · 2nd · 1h
            </div>
            <div className="text-xs text-on-surface-variant/40 leading-tight mt-0.5 flex items-center gap-1">
              🌐 <span>Anyone</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 text-sm leading-[20px] text-on-surface whitespace-pre-wrap break-words">
          {displayContent}
          {truncated && (
            <span className="text-on-surface-variant/60 cursor-pointer hover:text-[#0077B5] transition-colors">
              ...see more
            </span>
          )}
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mt-3 -mx-4 border-y border-outline-variant/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Post attachment"
              className="w-full max-h-[300px] object-cover"
            />
          </div>
        )}

        {/* Reactions bar */}
        <div className="flex items-center gap-1 mt-3 pb-2 border-b border-outline-variant/10">
          <span className="text-sm">👍</span>
          <span className="text-sm">❤️</span>
          <span className="text-sm">💡</span>
          <span className="text-xs text-on-surface-variant/60 ml-1">
            {formatCount(engagement.likes)}
          </span>
          <span className="text-xs text-on-surface-variant/40 ml-auto">
            {engagement.comments} comments · {engagement.reposts} reposts
          </span>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-1 -mx-1">
          {[
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-on-surface-variant/60 hover:bg-surface-variant/40 transition-colors flex-1 justify-center"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Threads Preview ──────────────────────────────────────────

function ThreadsPreview({
  content,
  imageUrl,
  userHandle,
  userAvatar,
}: Omit<LivePreviewProps, "isOpen" | "onToggle" | "platform" | "userName">) {
  const engagement = fakeEngagement(content);

  return (
    <div
      className="rounded-2xl border border-outline-variant/20 overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Preview badge */}
      <div className="px-4 pt-2 pb-1 flex items-center bg-surface/50 border-b border-outline-variant/10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-on-surface-variant/40">
          Threads Preview
        </span>
      </div>

      <div className="p-4 bg-surface">
        <div className="flex gap-3">
          {/* Avatar + thread line */}
          <div className="flex flex-col items-center gap-1.5">
            <Avatar src={userAvatar} size={36} />
            <div className="flex-1 w-0.5 bg-outline-variant/20 rounded-full min-h-[20px]" />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            {/* Header */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-on-surface">
                {userHandle || "username"}
              </span>
              {/* Verified */}
              <svg viewBox="0 0 22 22" className="w-3.5 h-3.5 flex-shrink-0" fill="#0095F6">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.894.142.634-.13 1.219-.437 1.69-.883.445-.47.749-1.055.878-1.69.131-.634.084-1.292-.139-1.9.584-.271 1.084-.7 1.438-1.24.354-.54.551-1.169.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
              <span className="text-on-surface-variant/50 text-xs">2h</span>
            </div>

            {/* Content */}
            <div className="mt-1 text-sm leading-[20px] text-on-surface whitespace-pre-wrap break-words">
              {content}
            </div>

            {/* Image */}
            {imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-outline-variant/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Post attachment"
                  className="w-full max-h-[260px] object-cover"
                />
              </div>
            )}

            {/* Engagement icons */}
            <div className="flex items-center gap-4 mt-3 text-on-surface-variant/50">
              <button className="hover:text-on-surface transition-colors">
                <Heart className="w-[18px] h-[18px]" />
              </button>
              <button className="hover:text-on-surface transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
              </button>
              <button className="hover:text-on-surface transition-colors">
                <Repeat2 className="w-[18px] h-[18px]" />
              </button>
              <button className="hover:text-on-surface transition-colors">
                <Send className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Engagement count */}
            <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-variant/40">
              <span>{engagement.replies} replies</span>
              <span>·</span>
              <span>{formatCount(engagement.likes)} likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main LivePreview Component ───────────────────────────────

export function LivePreview({
  content,
  platform,
  imageUrl,
  userName,
  userHandle,
  userAvatar,
  isOpen,
  onToggle,
}: LivePreviewProps) {
  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          isOpen
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "bg-surface-variant/30 text-on-surface-variant/60 hover:bg-surface-variant/50 hover:text-on-surface-variant"
        )}
      >
        {isOpen ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide preview</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </>
        )}
      </button>

      {/* Animated preview panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {platform === "TWITTER" && (
                <TwitterPreview
                  content={content}
                  imageUrl={imageUrl}
                  userName={userName}
                  userHandle={userHandle}
                  userAvatar={userAvatar}
                />
              )}
              {platform === "LINKEDIN" && (
                <LinkedInPreview
                  content={content}
                  imageUrl={imageUrl}
                  userName={userName}
                  userAvatar={userAvatar}
                />
              )}
              {platform === "THREADS" && (
                <ThreadsPreview
                  content={content}
                  imageUrl={imageUrl}
                  userHandle={userHandle}
                  userAvatar={userAvatar}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
