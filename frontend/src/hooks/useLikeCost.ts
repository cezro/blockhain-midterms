import type { Contract } from "ethers";
import { startTransition, useCallback, useEffect, useState } from "react";

export function useLikeCost(contract: Contract | null) {
  const [likeCost, setLikeCost] = useState<bigint | null>(null);

  const refresh = useCallback(async () => {
    if (!contract) return;
    const v = (await contract.likeCost()) as bigint;
    setLikeCost(v);
  }, [contract]);

  useEffect(() => {
    startTransition(() => {
      void refresh();
    });
  }, [refresh]);

  return { likeCost, refreshLikeCost: refresh };
}
