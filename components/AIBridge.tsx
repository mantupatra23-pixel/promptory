'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AIBridgeProps {
  promptText: string;
  modelName?: string;
}

export default function AIBridge({ promptText, modelName }: AIBridgeProps) {
  const encodedPrompt = encodeURIComponent(promptText || '');

  const aiDestinations = [
    {
      name: 'ChatGPT',
      url: `https://chatgpt.com/?q=${encodedPrompt}`,
      color: 'hover:border-emerald-500 hover:text-emerald-400',
      badge: 'OpenAI',
    },
    {
      name: 'Claude',
      url: `https://claude.ai/new?q=${encodedPrompt}`,
      color: 'hover:border-amber-500 hover:text-amber-400',
      badge: 'Anthropic',
    },
    {
      name: 'Perplexity',
      url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,
      color: 'hover:border-cyan-500 hover:text-cyan-400',
      badge: 'Search',
    },
  ];

  return (
    <div className="bg-[#12161F] border border-zinc-800 rounded-xl p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-semibold text-zinc-200">Open Directly in AI App</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {aiDestinations.map((dest) => (
          <a
            key={dest.name}
            href={dest.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-[#0A0D12] text-xs font-medium text-zinc-300 transition-all ${dest.color} group`}
          >
            <span>{dest.name}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-current transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
