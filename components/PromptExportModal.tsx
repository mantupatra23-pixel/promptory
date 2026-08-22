'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  compiledPrompt: string;
  modelName: string;
}

type TabType = 'cursor' | 'openai' | 'claude' | 'python';

export default function PromptExportModal({
  isOpen,
  onClose,
  promptTitle,
  compiledPrompt,
  modelName,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('cursor');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 1. .cursorrules content
  const cursorRulesContent = `# Cursor System Rules: ${promptTitle}
# Generated automatically via Promptory.xyz

${compiledPrompt}

# Operational Directives:
- Adhere strictly to the requested schema, constraints, and architecture.
- Do not emit unnecessary conversational prelude.
`;

  // 2. OpenAI API JSON Payload
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

  // 3. Anthropic Claude API JSON Payload
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

  // 4. Python LangChain / API Integration Snippet
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
    try {
      await navigator.clipboard.writeText(getActiveContent());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export for Developers & IDEs</h3>
              <p className="text-[11px] text-slate-400">Export as .cursorrules, API payload, or Python script</p>
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
        <div className="flex items-center gap-1.5 bg-[#0D1117] p-1 rounded-xl border border-[#30363D]">
          {[
            { id: 'cursor', label: '.cursorrules (IDE)', icon: Terminal },
            { id: 'openai', label: 'OpenAI API JSON', icon: FileCode },
            { id: 'claude', label: 'Claude API JSON', icon: FileCode },
            { id: 'python', label: 'Python Script', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B22]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Box */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 font-mono leading-relaxed overflow-x-auto max-h-72 select-all">
            {getActiveContent()}
          </pre>
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
          ) : (
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready for production API payload</span>
            </div>
          )}

          <div className="flex items-center gap-2">
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
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
