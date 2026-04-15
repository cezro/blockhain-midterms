export type OnChainPost = {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
};

export type TxPhase = "idle" | "pending" | "success" | "error";

export type TxState = {
  phase: TxPhase;
  message: string;
};
