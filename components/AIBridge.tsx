'use client';

import React, { useState } from 'react';
import { ExternalLink, Sparkles, Check, Copy } from 'lucide-react';

interface AIBridgeProps {
  promptText: string;
  modelName?: string;
}

export default function AIBridge({ promptText }: AIBridgeProps) {
  const [copiedApp, setCopiedApp] = useState<string | null>(null);

  const encodedPrompt = encodeURIComponent(promptText || '');

  const aiApps = [
    {
      name: 'ChatGPT',
      provider: 'OpenAI GPT-4o',
      url: `https://chatgpt.com/?q=${encodedPrompt}`,
      borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-950/40',
      iconColor: 'text-emerald-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.597 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.145-2.068a1.4428 1.4428 0 1 1 2.0407-2.0407 1.4428 1.4428 0 0 1-2.0407 2.0407z" />
        </svg>
      ),
    },
    {
      name: 'Claude',
      provider: 'Anthropic 3.5',
      url: `https://claude.ai/new`,
      borderHover: 'hover:border-amber-500/60 hover:shadow-amber-950/40',
      iconColor: 'text-amber-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
      ),
    },
    {
      name: 'Google Gemini',
      provider: 'Gemini 1.5 Pro',
      url: `https://gemini.google.com/app`,
      borderHover: 'hover:border-blue-500/60 hover:shadow-blue-950/40',
      iconColor: 'text-blue-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z" />
        </svg>
      ),
    },
    {
      name: 'DeepSeek',
      provider: 'R1 Reasoning',
      url: `https://chat.deepseek.com/`,
      borderHover: 'hover:border-cyan-500/60 hover:shadow-cyan-950/40',
      iconColor: 'text-cyan-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C7.03 3 3 7.03 3 12c0 3.98 2.59 7.35 6.19 8.52.45.08.61-.2.61-.43v-1.68c-2.51.55-3.04-1.07-3.04-1.07-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.91.06 1.39.93 1.39.93.81 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.21-2-.23-4.11-1-4.11-4.46 0-.99.35-1.79.93-2.42-.09-.23-.4-1.15.09-2.39 0 0 .76-.24 2.48.93.72-.2 1.5-.3 2.27-.3.77 0 1.55.1 2.27.3 1.72-1.17 2.48-.93 2.48-.93.49 1.24.18 2.16.09 2.39.58.63.93 1.43.93 2.42 0 3.47-2.11 4.23-4.12 4.45.33.28.62.84.62 1.7v2.52c0 .24.16.52.62.43C18.41 19.35 21 15.98 21 12c0-4.97-4.03-9-9-9z" />
        </svg>
      ),
    },
    {
      name: 'Perplexity',
      provider: 'Web Search',
      url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,
      borderHover: 'hover:border-teal-500/60 hover:shadow-teal-950/40',
      iconColor: 'text-teal-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15 8H9L12 2ZM4 10L10 12L4 14V10ZM20 10V14L14 12L20 10ZM9 16H15L12 22L9 16Z" />
        </svg>
      ),
    },
    {
      name: 'MS Copilot',
      provider: 'Bing / GPT-4',
      url: `https://copilot.microsoft.com/`,
      borderHover: 'hover:border-indigo-500/60 hover:shadow-indigo-950/40',
      iconColor: 'text-indigo-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.5 3C6.8 3 3 6.8 3 11.5S6.8 20 11.5 20s8.5-3.8 8.5-8.5S16.2 3 11.5 3zm0 15c-3.6 0-6.5-2.9-6.5-6.5S7.9 5 11.5 5 18 7.9 18 11.5 15.1 18 11.5 18z" />
        </svg>
      ),
    },
    {
      name: 'Grok',
      provider: 'xAI Model',
      url: `https://grok.com/`,
      borderHover: 'hover:border-zinc-400/60 hover:shadow-zinc-900/60',
      iconColor: 'text-zinc-200',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Mistral AI',
      provider: 'Le Chat',
      url: `https://chat.mistral.ai/chat`,
      borderHover: 'hover:border-orange-500/60 hover:shadow-orange-950/40',
      iconColor: 'text-orange-400',
      logo: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h4v4H3V3zm14 0h4v4h-4V3zM3 17h4v4H3v-4zm14 0h4v4h-4v-4zM7 7h10v10H7V7z" />
        </svg>
      ),
    },
  ];

  const handleLaunch = async (e: React.MouseEvent, app: (typeof aiApps)[0]) => {
    e.preventDefault();

    // 1. Auto-copy generated prompt to clipboard
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedApp(app.name);
      setTimeout(() => setCopiedApp(null), 3000);
    } catch {}

    // 2. Open AI app in new tab
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#12161F] border border-zinc-800/90 rounded-2xl p-5 md:p-6 mt-6">
      
      {/* Header with smart auto-copy banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-zinc-100">Open Directly in AI App</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
          <Copy className="w-3 h-3" />
          <span>Auto-copies prompt to clipboard on click</span>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copiedApp && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            Prompt copied! Just press <b className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">Paste</b> in {copiedApp}.
          </span>
        </div>
      )}

      {/* AI Platform Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {aiApps.map((app) => (
          <button
            key={app.name}
            type="button"
            onClick={(e) => handleLaunch(e, app)}
            className={`w-full text-left flex items-center justify-between p-3 rounded-xl border border-zinc-800/90 bg-[#0A0D12] text-xs transition-all duration-200 ${app.borderHover} hover:shadow-lg group cursor-pointer`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`shrink-0 ${app.iconColor}`}>
                {app.logo}
              </div>
              <div className="truncate">
                <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                  {app.name}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {app.provider}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0 ml-1" />
          </button>
        ))}
      </div>

    </div>
  );
}
