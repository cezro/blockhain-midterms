import type { Contract, Signer } from "ethers";
import { useCallback, useState } from "react";
import type { TxState } from "../types/tipPost";
import { getUserFriendlyError } from "../utils/errors";

const idle: TxState = { phase: "idle", message: "" };

export function useCreatePost(contract: Contract | null, signer: Signer | null) {
  const [tx, setTx] = useState<TxState>(idle);

  const createPost = useCallback(
    async (imageUrl: string, caption: string): Promise<void> => {
      if (!contract || !signer) {
        setTx({ phase: "error", message: "Connect your wallet first." });
        return;
      }
      setTx({ phase: "pending", message: "Confirm the transaction in your wallet…" });
      try {
        const c = contract.connect(signer) as Contract;
        const txResp = await c.createPost(imageUrl.trim(), caption.trim());
        setTx({ phase: "pending", message: "Waiting for confirmation…" });
        await txResp.wait();
        setTx({ phase: "success", message: "Post created on-chain." });
      } catch (e) {
        setTx({ phase: "error", message: getUserFriendlyError(e) });
      }
    },
    [contract, signer]
  );

  const reset = useCallback(() => setTx(idle), []);

  return { tx, createPost, reset };
}
