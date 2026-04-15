import { shortenAddress } from "../utils/formatAddress";

type Props = {
  account: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  earningsEth: string;
  earningsLoading: boolean;
};

export function WalletBar({ account, isConnecting, onConnect, earningsEth, earningsLoading }: Props) {
  return (
    <header className="wallet-bar">
      <div className="brand">TipPost</div>
      <div className="wallet-actions">
        {account ? (
          <>
            <span className="pill" title={account}>
              {shortenAddress(account, 6)}
            </span>
            <span className="earnings" title="Total ETH received from tips on your posts">
              Earnings:{" "}
              {earningsLoading ? "…" : <strong>{earningsEth} ETH</strong>}
            </span>
          </>
        ) : (
          <button type="button" className="btn primary" disabled={isConnecting} onClick={onConnect}>
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
