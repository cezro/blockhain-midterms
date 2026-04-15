import type { Contract } from "ethers";
import { formatEther } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function useCreatorEarnings(contract: Contract | null, account: string | null) {
  const [wei, setWei] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!contract || !account) {
      setWei(0n);
      return;
    }
    setLoading(true);
    try {
      const v = (await contract.totalEarnedByUser(account)) as bigint;
      setWei(v);
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!contract) return;
    const onLiked = () => {
      void refresh();
    };
    contract.on("PostLiked", onLiked);
    return () => {
      contract.off("PostLiked", onLiked);
    };
  }, [contract, refresh]);

  return {
    wei,
    formatted: formatEther(wei),
    loading,
    refresh,
  };
}
