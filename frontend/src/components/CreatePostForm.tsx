import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { TxState } from "../types/tipPost";

const CAPTION_MAX_HEIGHT_PX = 320;

type Props = {
  disabled: boolean;
  tx: TxState;
  onSubmit: (imageUrl: string, caption: string) => void;
  onResetTx: () => void;
};

export function CreatePostForm({ disabled, tx, onSubmit, onResetTx }: Props) {
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/600/400");
  const [caption, setCaption] = useState("");
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const syncCaptionHeight = useCallback(() => {
    const el = captionRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, CAPTION_MAX_HEIGHT_PX);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > CAPTION_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    syncCaptionHeight();
  }, [caption, syncCaptionHeight]);

  useLayoutEffect(() => {
    window.addEventListener("resize", syncCaptionHeight);
    return () => window.removeEventListener("resize", syncCaptionHeight);
  }, [syncCaptionHeight]);

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
            ref={captionRef}
            className="form-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something on-chain"
            rows={1}
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
