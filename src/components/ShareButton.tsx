"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareButton() {
  const [message, setMessage] = useState("");

  const share = async () => {
    const data = {
      title: "岡本 秀明 | Algion",
      text: "岡本 秀明 - Algion株式会社 代表取締役CEO / Software & Machine Learning Engineer",
      url: "https://algion.co.jp/hideaki",
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setMessage("URLをコピーしました");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("共有できませんでした");
    }
  };

  return (
    <div className="relative">
      <button type="button" onClick={share} className="inline-flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15" aria-label="名刺ページを共有" title="共有">
        <Share2 size={19} />
      </button>
      <span aria-live="polite" className="absolute right-0 top-14 whitespace-nowrap text-xs text-white/70">{message}</span>
    </div>
  );
}
