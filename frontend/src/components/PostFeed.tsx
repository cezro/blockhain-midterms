import type { OnChainPost } from "../types/tipPost";
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
      <div className="post-list">
        {posts.map((p) => {
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
