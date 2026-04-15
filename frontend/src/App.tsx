import { useMemo, useState } from "react";
import "./App.css";
import { CreatePostForm } from "./components/CreatePostForm";
import { NetworkGuard } from "./components/NetworkGuard";
import { PostFeed } from "./components/PostFeed";
import { WalletBar } from "./components/WalletBar";
import { getContractAddress, getTargetChainId } from "./config";
import { useCreatePost } from "./hooks/useCreatePost";
import { useCreatorEarnings } from "./hooks/useCreatorEarnings";
import { useLikeCost } from "./hooks/useLikeCost";
import { useLikePost } from "./hooks/useLikePost";
import { usePostsFeed } from "./hooks/usePostsFeed";
import { useSigner } from "./hooks/useSigner";
import { useTipPostContract } from "./hooks/useTipPostContract";
import { useWallet } from "./hooks/useWallet";

function App() {
  const configured = Boolean(getContractAddress());
  const targetChainId = getTargetChainId();

  const { ethereum, provider, account, chainId, error: walletError, isConnecting, connect } =
    useWallet();
  const signer = useSigner(provider, account);

  const readRunner = provider;
  const readContract = useTipPostContract(readRunner);
  const writeContract = useTipPostContract(signer);

  const { likeCost } = useLikeCost(readContract);
  const { posts, liked, loading: feedLoading, error: feedError } = usePostsFeed(readContract, account);
  const { formatted: earningsEth, loading: earningsLoading, refresh: refreshEarnings } =
    useCreatorEarnings(readContract, account);

  const { tx: createTx, createPost, reset: resetCreate } = useCreatePost(writeContract, signer);
  const { tx: likeTx, likePost, reset: resetLike } = useLikePost(writeContract, signer, likeCost);

  const [netBusy, setNetBusy] = useState(false);
  const [netError, setNetError] = useState<string | null>(null);
  const [likeBusyId, setLikeBusyId] = useState<string | null>(null);

  const wrongNetwork = chainId != null && chainId !== targetChainId;
  const viewerLower = useMemo(() => (account ? account.toLowerCase() : null), [account]);

  const canTransact = Boolean(account && signer && writeContract && !wrongNetwork && configured);

  return (
    <div className="app">
      <WalletBar
        account={account}
        isConnecting={isConnecting}
        onConnect={connect}
        earningsEth={earningsEth}
        earningsLoading={earningsLoading}
      />

      <main className="main">
        {!configured ? (
          <section className="banner error">
            <p>
              Set <code>VITE_CONTRACT_ADDRESS</code> in <code>frontend/.env</code> after deploying the
              contract, then restart the dev server.
            </p>
          </section>
        ) : null}

        {walletError ? <p className="banner error">{walletError}</p> : null}

        <NetworkGuard
          ethereum={ethereum}
          chainId={chainId}
          busy={netBusy}
          onBusy={setNetBusy}
          error={netError}
          onError={setNetError}
        />

        <p className="lede">
          Pay-to-like social posts on <strong>Sepolia</strong>. Likes send <strong>0.0001 ETH</strong>{" "}
          to the creator.
        </p>

        <CreatePostForm
          disabled={!canTransact}
          tx={createTx}
          onResetTx={resetCreate}
          onSubmit={async (imageUrl, caption) => {
            await createPost(imageUrl, caption);
          }}
        />

        {likeTx.phase !== "idle" && likeTx.message ? (
          <p
            className={
              likeTx.phase === "error" ? "banner error" : likeTx.phase === "success" ? "banner success" : "banner info"
            }
          >
            {likeTx.message}
            {likeTx.phase !== "pending" ? (
              <button type="button" className="btn ghost inline" onClick={resetLike}>
                Dismiss
              </button>
            ) : null}
          </p>
        ) : null}

        <PostFeed
          posts={posts}
          liked={liked}
          viewer={account}
          viewerLower={viewerLower}
          canTransact={canTransact}
          wrongNetwork={wrongNetwork}
          loading={feedLoading}
          error={feedError}
          likeBusyId={likeBusyId}
          onLike={async (postId) => {
            resetLike();
            setLikeBusyId(postId.toString());
            try {
              await likePost(postId);
              await refreshEarnings();
            } finally {
              setLikeBusyId(null);
            }
          }}
        />
      </main>
    </div>
  );
}

export default App;
