import { useMemo, useState } from "react";
import type { OnChainPost } from "../types/tipPost";
import { type FeedPeriod, getOrderedFeedPosts } from "../utils/feedOrdering";
import { PostCard } from "./PostCard";

type Props = {
  posts: OnChainPost[];
  liked: Record<string, boolean>;
  viewer: string | null;
  viewerLower: string | null;
  canTransact: boolean;
  wrongNetwork: boolean;
  loading: boolean;
  error: string | null;
  likeBusyId: string | null;
  onLike: (postId: bigint) => void;
};

export function PostFeed({
  posts,
  liked,
  viewer,
  viewerLower,
  canTransact,
  wrongNetwork,
  loading,
  error,
  likeBusyId,
  onLike,
}: Props) {
  const [period, setPeriod] = useState<FeedPeriod>("all");

  const displayedPosts = useMemo(
    () => getOrderedFeedPosts(posts, period),
    [posts, period]
  );

  if (loading && posts.length === 0) {
    return <p className="muted">Loading feed…</p>;
  }
  if (error) {
    return <p className="banner error">{error}</p>;
  }
  if (posts.length === 0) {
    return <p className="muted">No posts yet. Be the first to create one.</p>;
  }

  return (
    <section className="feed">
      <h2>Feed</h2>
      <div className="feed-toolbar">
        <label className="feed-toolbar-label">
          <span>Show</span>
          <select
            className="feed-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as FeedPeriod)}
            aria-label="Filter posts by creation time"
          >
            <option value="all">All time — most liked</option>
            <option value="week">This week — most liked</option>
            <option value="today">Today (UTC) — most liked</option>
          </select>
        </label>
        <p className="feed-toolbar-hint muted">
          Week and today filter by <strong>when the post was created</strong> on-chain, then sort by total likes.
        </p>
      </div>
      {displayedPosts.length === 0 ? (
        <p className="muted">No posts in this time range. Try &ldquo;All time&rdquo; or post something new.</p>
      ) : null}
      <div className="post-list">
        {displayedPosts.map((p) => {
          const idKey = p.id.toString();
          const isOwn = viewerLower != null && p.creator.toLowerCase() === viewerLower;
          return (
            <PostCard
              key={idKey}
              post={p}
              viewer={viewer}
              liked={Boolean(liked[idKey])}
              isOwn={isOwn}
              canTransact={canTransact}
              wrongNetwork={wrongNetwork}
              likeBusy={likeBusyId === idKey}
              onLike={onLike}
            />
          );
        })}
      </div>
    </section>
  );
}
