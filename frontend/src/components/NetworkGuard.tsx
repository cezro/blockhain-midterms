import type { Eip1193Provider } from "ethers";
import { getTargetChainId } from "../config";
import { switchToSepolia } from "../utils/switchToSepolia";

type Props = {
  ethereum: Eip1193Provider | null;
  chainId: bigint | null;
  busy: boolean;
  onBusy: (v: boolean) => void;
  error: string | null;
  onError: (msg: string | null) => void;
};

export function NetworkGuard({ ethereum, chainId, busy, onBusy, error, onError }: Props) {
  const target = getTargetChainId();
  const wrong = chainId != null && chainId !== target;

  if (!wrong) {
    return error ? <p className="banner error">{error}</p> : null;
  }

  if (!ethereum) {
    return (
      <div className="banner warn">
        <p>Install an injected wallet (for example MetaMask) to switch to Sepolia.</p>
        {error ? <p className="inline-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="banner warn">
      <p>
        Please switch MetaMask to <strong>Sepolia</strong> (chain ID {target.toString()}) to use
        TipPost.
      </p>
      <button
        type="button"
        className="btn secondary"
        disabled={busy}
        onClick={async () => {
          onError(null);
          onBusy(true);
          try {
            await switchToSepolia(ethereum);
          } catch (e) {
            onError(e instanceof Error ? e.message : "Could not switch network.");
          } finally {
            onBusy(false);
          }
        }}
      >
        {busy ? "Switching…" : "Switch to Sepolia"}
      </button>
      {error ? <p className="inline-error">{error}</p> : null}
    </div>
  );
}
