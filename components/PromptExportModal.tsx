'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Code, Terminal, FileCode, CheckCircle2, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL ||
  'https://promptory-ai.lemonsqueezy.com/checkout/buy/750e2a22-3cc6-45fe-9b40-b4549cd38f8c';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  compiledPrompt: string;
  modelName: string;
  slug?: string;
  isProUser?: boolean;
}

type TabType = 'cli' | 'cursor' | 'openai' | 'claude' | 'python';

export default function PromptExportModal({
  isOpen,
  onClose,
  promptTitle,
  compiledPrompt,
  modelName,
  slug,
  isProUser: isProProp,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('cli');
  const [copied, setCopied] = useState(false);
  const [isProUser, setIsProUser] = useState(isProProp ?? false);

  useEffect(() => {
    if (isProProp !== undefined) {
      setIsProUser(isProProp);
      return;
    }

    async function checkPro() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setIsProUser(false);
        return;
      }

      const email = user.email.toLowerCase().trim();

      // Owner/Admin Free VIP
      if (email === 'mantupatra23@gmail.com') {
        setIsProUser(true);
        return;
      }

      // Supabase verification
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_email', email)
        .maybeSingle();

      if (sub && (sub.status === 'active' || sub.status === 'paid')) {
        setIsProUser(true);
      } else {
        const active = typeof window !== 'undefined' && localStorage.getItem('promptory_pro_active') === 'true';
        setIsProUser(active);
      }
    }

    checkPro();
  }, [isProProp]);

  if (!isOpen) return null;

  const derivedSlug = (
    slug || 
    promptTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  );

  const cliSnippet = `# Pull directly into your local project root as .cursorrules
npx promptory-cli add ${derivedSlug} --cursor

# Or pull as a standalone Markdown prompt file
npx promptory-cli add ${derivedSlug} --raw`;

  const cursorRulesContent = `# Cursor System Rules: ${promptTitle}
# Generated automatically via Promptory.xyz

${compiledPrompt}

# Operational Directives:
- Adhere strictly to the requested schema, constraints, and architecture.
- Do not emit unnecessary conversational prelude.
`;

  const openAIPayload = JSON.stringify(
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: compiledPrompt,
        },
        {
          role: 'user',
          content: 'Execute task using the system instructions above.',
        },
      ],
      temperature: 0.2,
    },
    null,
    2
  );

  const claudePayload = JSON.stringify(
    {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: compiledPrompt,
      messages: [
        {
          role: 'user',
          content: 'Begin execution according to system guidelines.',
        },
      ],
    },
    null,
    2
  );

  const pythonSnippet = `from openai import OpenAI

client = OpenAI()

system_prompt = """${compiledPrompt.replace(/"""/g, '\\"\\"\\"')}"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Execute according to configuration"}
    ],
    temperature=0.2
)

print(response.choices[0].message.content)
`;

  const getActiveContent = () => {
    switch (activeTab) {
      case 'cli':
        return cliSnippet;
      case 'cursor':
        return cursorRulesContent;
      case 'openai':
        return openAIPayload;
      case 'claude':
        return claudePayload;
      case 'python':
        return pythonSnippet;
    }
  };

  const handleCopy = async () => {
    if (activeTab === 'cli' && !isProUser) return;
    try {
      const textToCopy = activeTab === 'cli' 
        ? `npx promptory-cli add ${derivedSlug} --cursor` 
        : getActiveContent();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadCursorRules = () => {
    const blob = new Blob([cursorRulesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.cursorrules';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export for Developers & IDEs</h3>
              <p className="text-[11px] text-slate-400">Export via CLI, .cursorrules, API payload, or Python</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-[#0D1117] p-1 rounded-xl border border-[#30363D] overflow-x-auto">
          {[
            { id: 'cli', label: 'CLI (npx)', icon: Terminal, isPro: true },
            { id: 'cursor', label: '.cursorrules', icon: FileCode, isPro: false },
            { id: 'openai', label: 'OpenAI JSON', icon: FileCode, isPro: false },
            { id: 'claude', label: 'Claude JSON', icon: FileCode, isPro: false },
            { id: 'python', label: 'Python', icon: Code, isPro: false },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B22]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.isPro && !isProUser && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5 ml-1">
                    <Lock className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Code Content Box or Pro Paywall */}
        <div className="relative">
          {activeTab === 'cli' && !isProUser ? (
            <div className="relative overflow-hidden rounded-xl bg-[#0D1117] border border-emerald-500/30 p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  PRO DEVELOPER FEATURE
                </span>
                <h4 className="text-sm font-bold text-white pt-1">Automated Terminal & IDE Pull</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Direct <code className="text-emerald-300">npx promptory-cli</code> commands to sync prompts directly into your root as <code className="text-cyan-300">.cursorrules</code> are exclusive to Pro subscribers.
                </p>
              </div>
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Unlock CLI Access (₹799/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 font-mono leading-relaxed overflow-x-auto max-h-72 select-all">
              {getActiveContent()}
            </pre>
          )}
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {activeTab === 'cursor' ? (
            <button
              onClick={handleDownloadCursorRules}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-bold transition border border-[#30363D]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download .cursorrules</span>
            </button>
          ) : activeTab === 'cli' && !isProUser ? (
            <div className="text-[11px] text-amber-400/90 flex items-center gap-1 font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Pro license required for CLI sync</span>
            </div>
          ) : activeTab === 'cli' ? (
            <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-install npm executable</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready for production API payload</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {activeTab === 'cli' && !isProUser ? (
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Upgrade to Pro</span>
              </a>
            ) : (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{activeTab === 'cli' ? 'Copy CLI Command' : 'Copy Configuration'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
