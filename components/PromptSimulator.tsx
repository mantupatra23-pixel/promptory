'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Check, Copy, Loader2, Zap } from 'lucide-react';

interface Props {
  promptText: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://promptory-4bd1.onrender.com';

export default function PromptSimulator({ promptText }: Props) {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSimulate = async () => {
    if (!promptText.trim() || loading) return;
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (data && data.output) {
        setOutput(data.output);
        setProvider(data.provider || 'AI Engine');
        setLatency(data.latency_ms || 120);
      } else {
        setOutput('Error during simulation. Please try again.');
      }
    } catch (err) {
      setOutput('Unable to reach simulator API. Check your backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 md:p-6 space-y-4 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Live AI Output Simulator</h3>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition shadow-md shadow-cyan-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Run Live Preview</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Test this compiled prompt instantly to preview the expected AI output response.
      </p>

      {output && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              {provider} ({latency}ms)
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
