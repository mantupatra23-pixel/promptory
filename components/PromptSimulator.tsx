'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Sparkles, Check, Copy, Loader2, Zap, Cpu } from 'lucide-react';

interface Props {
  promptText: string;
}

const AVAILABLE_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', tag: 'Deep Reasoning' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', tag: 'Ultra-Fast' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', tag: 'Balanced 32k' },
];

export default function PromptSimulator({ promptText }: Props) {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSimulate = async () => {
    if (!promptText.trim() || loading) return;
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText,
          model: selectedModel 
        }),
      });

      const data = await res.json();
      if (data && data.output) {
        setOutput(data.output);
        setModelUsed(data.modelUsed || selectedModel);
        setLatency(data.latency_ms || 95);
      } else {
        setOutput(data.error || 'Execution finished with no output returned.');
      }
    } catch (err) {
      setOutput('Unable to reach simulator engine. Please try again.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#30363D] gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Live AI Output Simulator</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center">
            <Cpu className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
              className="bg-[#0D1117] border border-[#30363D] hover:border-slate-500 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 transition cursor-pointer appearance-none disabled:opacity-50"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#161B22] text-slate-200">
                  {m.label} ({m.tag})
                </option>
              ))}
            </select>
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
      </div>

      <p className="text-xs text-slate-400">
        Test this compiled prompt instantly across frontier open-weights models to verify response fidelity.
      </p>

      {output && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              {modelUsed} &bull; {latency}ms
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-slate-800"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 leading-relaxed max-h-96 overflow-y-auto overflow-x-auto select-all">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className="my-3 overflow-x-auto rounded-lg border border-slate-700/60">
                    <table className="w-full text-left border-collapse text-[11px]" {...props} />
                  </div>
                ),
                thead: ({ ...props }) => <thead className="bg-[#161B22] text-slate-200" {...props} />,
                th: ({ ...props }) => (
                  <th className="border-b border-slate-700 px-3 py-2 font-semibold text-cyan-300" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="border-b border-slate-800/80 px-3 py-2 text-slate-300 align-top" {...props} />
                ),
                h1: ({ ...props }) => <h1 className="text-sm font-bold text-white mt-4 mb-2 pb-1 border-b border-slate-800" {...props} />,
                h2: ({ ...props }) => <h2 className="text-xs font-bold text-cyan-400 mt-3 mb-1.5" {...props} />,
                h3: ({ ...props }) => <h3 className="text-xs font-semibold text-emerald-400 mt-2 mb-1" {...props} />,
                p: ({ ...props }) => <p className="mb-2 leading-relaxed text-slate-300" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-300" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-300" {...props} />,
                li: ({ ...props }) => <li className="pl-0.5" {...props} />,
                strong: ({ ...props }) => <strong className="font-semibold text-slate-100" {...props} />,
                hr: () => <hr className="border-slate-800 my-3" />
              }}
            >
              {output}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
