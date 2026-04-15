const DEFAULT_CHAIN_ID = 11155111n;

export function getTargetChainId(): bigint {
  const raw = import.meta.env.VITE_CHAIN_ID;
  if (typeof raw === "string" && raw.trim().length > 0) {
    return BigInt(raw.trim());
  }
  return DEFAULT_CHAIN_ID;
}

export function getContractAddress(): string {
  const addr = import.meta.env.VITE_CONTRACT_ADDRESS?.trim() ?? "";
  return addr;
}

export function assertConfiguredAddress(addr: string): asserts addr is string {
  if (!addr) {
    throw new Error(
      "Missing VITE_CONTRACT_ADDRESS. Add it to frontend/.env (see .env.example)."
    );
  }
}
