import { useState } from "react";
import type { TxState } from "../types/tipPost";

type Props = {
  disabled: boolean;
  tx: TxState;
  onSubmit: (imageUrl: string, caption: string) => void;
  onResetTx: () => void;
};

export function CreatePostForm({ disabled, tx, onSubmit, onResetTx }: Props) {
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/600/400");
  const [caption, setCaption] = useState("");

  return (
    <section className="card">
      <h2>Create post</h2>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(imageUrl, caption);
        }}
      >
        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            disabled={disabled || tx.phase === "pending"}
            required
          />
        </label>
        <label>
          Caption
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something on-chain"
            rows={3}
            disabled={disabled || tx.phase === "pending"}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={disabled || tx.phase === "pending"}>
            {tx.phase === "pending" ? "Submitting…" : "Create post"}
          </button>
          {tx.phase !== "idle" && tx.phase !== "pending" ? (
            <button type="button" className="btn ghost" onClick={onResetTx}>
              Dismiss
            </button>
          ) : null}
        </div>
      </form>
      {tx.message ? (
        <p className={tx.phase === "error" ? "form-status error" : "form-status success"}>{tx.message}</p>
      ) : null}
    </section>
  );
}
