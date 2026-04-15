import type { Contract } from "ethers";
import { useCallback, useEffect, useState } from "react";
import type { OnChainPost } from "../types/tipPost";

type LikedMap = Record<string, boolean>;

function normalizePost(raw: {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
}): OnChainPost {
  return {
    id: raw.id,
    creator: raw.creator,
    imageUrl: raw.imageUrl,
    caption: raw.caption,
    likes: raw.likes,
    totalEarned: raw.totalEarned,
    timestamp: raw.timestamp,
  };
}

export function usePostsFeed(contract: Contract | null, viewer: string | null) {
  const [posts, setPosts] = useState<OnChainPost[]>([]);
  const [liked, setLiked] = useState<LikedMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const listUnknown = await contract.getAllPosts();
      const list = listUnknown as OnChainPost[];
      const normalized = list.map((p) => normalizePost(p));

      let likedNext: LikedMap = {};
      if (viewer && normalized.length > 0) {
        const flags = await Promise.all(
          normalized.map(async (p) => {
            const ok = (await contract.checkLiked(p.id, viewer)) as boolean;
            return [p.id.toString(), ok] as const;
          })
        );
        likedNext = Object.fromEntries(flags);
      }

      setPosts(normalized);
      setLiked(likedNext);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load posts.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [contract, viewer]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!contract) return;

    const onChange = () => {
      void refresh();
    };

    contract.on("PostCreated", onChange);
    contract.on("PostLiked", onChange);

    return () => {
      contract.off("PostCreated", onChange);
      contract.off("PostLiked", onChange);
    };
  }, [contract, refresh]);

  return { posts, liked, loading, error, refresh };
}
