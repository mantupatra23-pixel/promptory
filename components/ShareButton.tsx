'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export default function ShareButton({ title, description }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Promptory`,
          text: description || 'Check out this battle-tested AI system prompt on Promptory',
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User canceled or failed, fall back to clipboard
      }
    }

    // Fallback: Copy URL to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold transition border border-[#30363D] shadow-sm"
      title="Share this prompt"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
