import type { Contract, Signer } from "ethers";
import { useCallback, useState } from "react";
import type { TxState } from "../types/tipPost";
import { getUserFriendlyError } from "../utils/errors";

const idle: TxState = { phase: "idle", message: "" };

export function useLikePost(
  contract: Contract | null,
  signer: Signer | null,
  likeCost: bigint | null
) {
  const [tx, setTx] = useState<TxState>(idle);

  const likePost = useCallback(
    async (postId: bigint): Promise<void> => {
      if (!contract || !signer || likeCost == null) {
        setTx({ phase: "error", message: "Wallet or like cost not ready." });
        return;
      }
      setTx({ phase: "pending", message: "Confirm the 0.0001 ETH like in your wallet…" });
      try {
        const c = contract.connect(signer) as Contract;
        const txResp = await c.likePost(postId, { value: likeCost });
        setTx({ phase: "pending", message: "Waiting for confirmation…" });
        await txResp.wait();
        setTx({ phase: "success", message: "Like recorded and tip sent." });
      } catch (e) {
        setTx({ phase: "error", message: getUserFriendlyError(e) });
      }
    },
    [contract, signer, likeCost]
  );

  const reset = useCallback(() => setTx(idle), []);

  return { tx, likePost, reset };
}
