import { BrowserProvider, type Eip1193Provider } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUserFriendlyError } from "../utils/errors";

type InjectedProvider = Eip1193Provider & {
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function getEthereum(): InjectedProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { ethereum?: InjectedProvider };
  return w.ethereum ?? null;
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  /** MetaMask has no standard disconnect; we hide the session until user clicks Connect again. */
  const manuallyDisconnected = useRef(false);

  // Recreate when `chainId` changes so we never keep a BrowserProvider tied to a stale network
  // after MetaMask switches chains (avoids ethers v6 NETWORK_ERROR "network changed: X => Y").
  const provider = useMemo(() => {
    void chainId;
    const eth = getEthereum();
    if (!eth) return null;
    return new BrowserProvider(eth);
  }, [chainId]);

  const refreshChain = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) return;
    const cid = await eth.request({ method: "eth_chainId" });
    setChainId(BigInt(cid as string));
  }, []);

  const refreshAccounts = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) return;
    if (manuallyDisconnected.current) {
      setAccount(null);
      return;
    }
    const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
    setAccount(accounts[0] ?? null);
  }, []);

  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    void refreshChain();
    void refreshAccounts();

    const onAccounts = (...args: unknown[]) => {
      if (manuallyDisconnected.current) {
        setAccount(null);
        return;
      }
      const accs = args[0] as string[];
      setAccount(accs[0] ?? null);
    };
    const onChain = (...args: unknown[]) => {
      const hexChainId = args[0] as string;
      setChainId(BigInt(hexChainId));
    };

    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);

    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [refreshAccounts, refreshChain]);

  const connect = useCallback(async () => {
    setError(null);
    manuallyDisconnected.current = false;
    const eth = getEthereum();
    if (!eth) {
      setError("MetaMask (or an injected wallet) was not found.");
      return;
    }
    setIsConnecting(true);
    try {
      await eth.request({ method: "eth_requestAccounts" });
      await refreshAccounts();
      await refreshChain();
    } catch (e) {
      setError(getUserFriendlyError(e));
    } finally {
      setIsConnecting(false);
    }
  }, [refreshAccounts, refreshChain]);

  const disconnect = useCallback(() => {
    manuallyDisconnected.current = true;
    setAccount(null);
    setError(null);
  }, []);

  return {
    ethereum: getEthereum(),
    provider,
    account,
    chainId,
    error,
    isConnecting,
    connect,
    disconnect,
    refreshChain,
  };
}
