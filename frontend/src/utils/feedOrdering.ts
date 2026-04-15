import type { OnChainPost } from "../types/tipPost";

export type FeedPeriod = "all" | "week" | "today";

const SECONDS_PER_DAY = 86400;
const DAYS_PER_WEEK = 7;

/** Current UTC calendar day start, in seconds since epoch (matches `block.timestamp` scale). */
export function getTodayStartUtcSec(nowMs: number = Date.now()): number {
  const d = new Date(nowMs);
  return Math.floor(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000
  );
}

/** Rolling 7×24h window start in seconds. */
export function getWeekStartSec(nowMs: number = Date.now()): number {
  return Math.floor(nowMs / 1000) - DAYS_PER_WEEK * SECONDS_PER_DAY;
}

export function filterPostsByPeriod(
  posts: OnChainPost[],
  period: FeedPeriod,
  nowMs: number = Date.now()
): OnChainPost[] {
  if (period === "all") {
    return [...posts];
  }
  const nowSec = BigInt(Math.floor(nowMs / 1000));
  if (period === "week") {
    const cutoff = BigInt(getWeekStartSec(nowMs));
    return posts.filter((p) => p.timestamp >= cutoff && p.timestamp <= nowSec);
  }
  const start = BigInt(getTodayStartUtcSec(nowMs));
  return posts.filter((p) => p.timestamp >= start && p.timestamp <= nowSec);
}

export function sortPostsByLikesDesc(posts: OnChainPost[]): OnChainPost[] {
  return [...posts].sort((a, b) => {
    const likeDiff = b.likes - a.likes;
    if (likeDiff !== 0n) return likeDiff > 0n ? 1 : -1;
    const idDiff = b.id - a.id;
    if (idDiff !== 0n) return idDiff > 0n ? 1 : -1;
    return 0;
  });
}

export function getOrderedFeedPosts(
  posts: OnChainPost[],
  period: FeedPeriod,
  nowMs?: number
): OnChainPost[] {
  const filtered = filterPostsByPeriod(posts, period, nowMs);
  return sortPostsByLikesDesc(filtered);
}
