'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  GitFork, 
  Copy, 
  Check, 
  Play, 
  Loader2, 
  Sparkles, 
  ShieldAlert, 
  Send,
  FileDown
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  promptTitle: string;
  modelName: string;
}

export default function PromptRemixModal({
  isOpen,
  onClose,
  initialPrompt,
  promptTitle,
  modelName,
}: Props) {
  const router = useRouter();
  const [editedPrompt, setEditedPrompt] = useState(initialPrompt);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [previewOutput, setPreviewOutput] = useState<string | null>(null);

  useEffect(() => {
    setEditedPrompt(initialPrompt);
    setPreviewOutput(null);
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadCursor = () => {
    const blob = new Blob([editedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.cursorrules';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulate = async () => {
    if (!editedPrompt.trim() || simulating) return;
    setSimulating(true);
    setPreviewOutput(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: editedPrompt,
          model: 'openai/gpt-oss-20b'
        }),
      });
      const data = await res.json();
      setPreviewOutput(data.output || data.error || 'Execution finished with no output.');
    } catch {
      setPreviewOutput('Failed to reach simulation gateway.');
    } finally {
      setSimulating(false);
    }
  };

  const handleInjectNegativeGuard = () => {
    const guard = `\n\n### STRICT NEGATIVE CONSTRAINTS\n- Do NOT hallucinate unverified metrics.\n- Reject vague enterprise buzzwords.\n- Output deterministic, actionable steps only.`;
    setEditedPrompt((prev) => prev + guard);
  };

  const handlePublishFork = () => {
    const params = new URLSearchParams({
      fork_title: `[Remix] ${promptTitle}`,
      fork_template: editedPrompt,
      fork_model: modelName.toLowerCase(),
    });
    router.push(`/submit?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D] bg-[#0D1117]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Remix &amp; Fork Playground</span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                  Sandbox Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Customize prompt rules, inject constraints, and test before deploying.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#161B22] border-b border-[#30363D] text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleInjectNegativeGuard}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-300 hover:text-white border border-[#30363D] transition text-[11px]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Inject Negative Guard</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition text-[11px] disabled:opacity-50"
            >
              {simulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>Test Fork</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-200 border border-[#30363D] transition text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadCursor}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-200 border border-[#30363D] transition text-[11px]"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>.cursorrules</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Live Editable Prompt Definition:
            </label>
            <textarea
              rows={12}
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] focus:border-cyan-500 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none transition resize-y"
            />
          </div>

          {/* Test Sandbox Output */}
          {previewOutput && (
            <div className="space-y-2 pt-2 border-t border-[#30363D] animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulation Verification (GPT-OSS 20B):</span>
              </div>
              <div className="p-3.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                {previewOutput}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#30363D] bg-[#0D1117]">
          <span className="text-[11px] text-slate-500">
            {editedPrompt.length} chars &bull; ~{Math.round(editedPrompt.length / 4)} tokens
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePublishFork}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Fork to Directory &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
