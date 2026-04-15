import type { BrowserProvider, JsonRpcSigner } from "ethers";
import { startTransition, useEffect, useState } from "react";

export function useSigner(provider: BrowserProvider | null, account: string | null) {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    if (!provider || !account) {
      startTransition(() => setSigner(null));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const s = await provider.getSigner();
        if (!cancelled) setSigner(s);
      } catch {
        if (!cancelled) setSigner(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provider, account]);

  return signer;
}
