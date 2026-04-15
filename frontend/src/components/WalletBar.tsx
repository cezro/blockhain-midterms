import { shortenAddress } from "../utils/formatAddress";

type Props = {
  account: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  earningsEth: string;
  earningsLoading: boolean;
};

export function WalletBar({
  account,
  isConnecting,
  onConnect,
  onDisconnect,
  earningsEth,
  earningsLoading,
}: Props) {
  return (
    <header className="wallet-bar">
      <div className="brand">TipPost</div>
      <div className="wallet-actions">
        {account ? (
          <>
            <span className="pill" title={account}>
              {shortenAddress(account, 6)}
            </span>
            <button type="button" className="btn secondary wallet-disconnect" onClick={onDisconnect}>
              Disconnect
            </button>
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
