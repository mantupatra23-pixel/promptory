'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://www.promptory.xyz');
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Promptory`,
          text: `Check out this tested AI prompt: "${title}" on Promptory`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was dismissed or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A0D12] hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-zinc-100 transition"
      title="Share Prompt"
    >
      {shared ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
