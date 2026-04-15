import { formatEther } from "ethers";
import { useState } from "react";
import type { OnChainPost } from "../types/tipPost";
import { shortenAddress } from "../utils/formatAddress";

type Props = {
  post: OnChainPost;
  viewer: string | null;
  liked: boolean;
  isOwn: boolean;
  canTransact: boolean;
  wrongNetwork: boolean;
  likeBusy: boolean;
  onLike: (postId: bigint) => void;
};

export function PostCard({ post, viewer, liked, isOwn, canTransact, wrongNetwork, likeBusy, onLike }: Props) {
  const [imgBroken, setImgBroken] = useState(false);

  return (
    <article className="post-card">
      <div className="post-media">
        {imgBroken ? (
          <div className="image-fallback">Image could not be loaded</div>
        ) : (
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
        )}
      </div>
      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        <div className="post-meta">
          <span title={post.creator}>Creator: {shortenAddress(post.creator, 6)}</span>
          <span>Likes: {post.likes.toString()}</span>
          <span>Tips on post: {formatEther(post.totalEarned)} ETH</span>
        </div>
        <div className="post-actions">
          {!viewer ? (
            <span className="muted">Connect wallet to like</span>
          ) : (
            <span
              className="like-button-wrap"
              title={
                isOwn
                  ? "You cannot like your own post. The TipPost contract blocks self-likes—use another MetaMask account to tip this post."
                  : wrongNetwork
                    ? "Switch to Sepolia in MetaMask to like."
                    : !canTransact
                      ? "Wallet is getting ready — try again in a moment."
                      : liked
                        ? "You already liked this post."
                        : undefined
              }
            >
              <button
                type="button"
                className={`btn like ${liked ? "liked" : ""}`}
                disabled={!canTransact || isOwn || liked || likeBusy}
                title={
                  canTransact && !isOwn && !wrongNetwork && !liked
                    ? "Send 0.0001 ETH tip with your like (plus gas)"
                    : undefined
                }
                onClick={() => onLike(post.id)}
              >
                {liked ? "❤️ Liked" : likeBusy ? "…" : "♡ Like (0.0001 ETH)"}
              </button>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
