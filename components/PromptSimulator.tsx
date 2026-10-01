'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Sparkles, Check, Copy, Loader2, Zap, Cpu, Columns, Square } from 'lucide-react';

interface Props {
  promptText: string;
}

const AVAILABLE_MODELS = [
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', tag: 'Ultra-Fast' },
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', tag: 'Deep Reasoning' },
  { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', tag: 'Code & Logic' },
];

export default function PromptSimulator({ promptText }: Props) {
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Model A State (or Single Model)
  const [selectedModelA, setSelectedModelA] = useState('openai/gpt-oss-20b');
  const [outputA, setOutputA] = useState<string | null>(null);
  const [latencyA, setLatencyA] = useState<number | null>(null);
  const [copiedA, setCopiedA] = useState(false);

  // Model B State (Comparison Mode)
  const [selectedModelB, setSelectedModelB] = useState('openai/gpt-oss-120b');
  const [outputB, setOutputB] = useState<string | null>(null);
  const [latencyB, setLatencyB] = useState<number | null>(null);
  const [copiedB, setCopiedB] = useState(false);

  const fetchSimulation = async (model: string) => {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText, model }),
    });
    return res.json();
  };

  const handleSimulate = async () => {
    if (!promptText.trim() || loading) return;
    setLoading(true);
    setOutputA(null);
    setOutputB(null);

    try {
      if (compareMode) {
        const [dataA, dataB] = await Promise.all([
          fetchSimulation(selectedModelA),
          fetchSimulation(selectedModelB),
        ]);

        setOutputA(dataA.output || dataA.error || 'No output returned.');
        setLatencyA(dataA.latency_ms || 0);

        setOutputB(dataB.output || dataB.error || 'No output returned.');
        setLatencyB(dataB.latency_ms || 0);
      } else {
        const dataA = await fetchSimulation(selectedModelA);
        setOutputA(dataA.output || dataA.error || 'No output returned.');
        setLatencyA(dataA.latency_ms || 0);
      }
    } catch {
      setOutputA('Failed to execute simulation. Check connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string | null, isB = false) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (isB) {
        setCopiedB(true);
        setTimeout(() => setCopiedB(false), 2000);
      } else {
        setCopiedA(true);
        setTimeout(() => setCopiedA(false), 2000);
      }
    } catch {}
  };

  const renderMarkdownBox = (
    text: string,
    modelName: string,
    latency: number | null,
    copied: boolean,
    isB = false
  ) => (
    <div className="flex-1 space-y-2 min-w-0">
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 truncate">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate">{modelName}</span>
          <span className="text-slate-400">&bull; {latency}ms</span>
        </span>
        <button
          onClick={() => handleCopy(text, isB)}
          className="text-slate-300 hover:text-white flex items-center gap-1 transition px-2 py-0.5 rounded-lg hover:bg-slate-800 shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 leading-relaxed max-h-[480px] overflow-y-auto overflow-x-auto select-all">
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
              <th className="border-b border-slate-700 px-2.5 py-1.5 font-semibold text-cyan-300" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="border-b border-slate-800/80 px-2.5 py-1.5 text-slate-300 align-top" {...props} />
            ),
            h1: ({ ...props }) => <h1 className="text-sm font-bold text-white mt-3 mb-2 pb-1 border-b border-slate-800" {...props} />,
            h2: ({ ...props }) => <h2 className="text-xs font-bold text-cyan-400 mt-2.5 mb-1" {...props} />,
            h3: ({ ...props }) => <h3 className="text-xs font-semibold text-emerald-400 mt-2 mb-1" {...props} />,
            p: ({ ...props }) => <p className="mb-2 leading-relaxed text-slate-300" {...props} />,
            ul: ({ ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-300" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-300" {...props} />,
            li: ({ ...props }) => <li className="pl-0.5" {...props} />,
            strong: ({ ...props }) => <strong className="font-semibold text-slate-100" {...props} />,
            hr: () => <hr className="border-slate-800 my-3" />
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 md:p-6 space-y-4 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#30363D] gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Live AI Output Simulator</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher Toggle */}
          <button
            type="button"
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              compareMode
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-[#0D1117] border-[#30363D] text-slate-400 hover:text-slate-200'
            }`}
          >
            {compareMode ? <Columns className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>{compareMode ? 'Compare: ON' : 'Compare Mode'}</span>
          </button>

          {/* Model Selector A */}
          <div className="relative flex items-center">
            <Cpu className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedModelA}
              onChange={(e) => setSelectedModelA(e.target.value)}
              disabled={loading}
              className="bg-[#0D1117] border border-[#30363D] hover:border-slate-500 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 transition cursor-pointer appearance-none disabled:opacity-50"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#161B22] text-slate-200">
                  {compareMode ? `A: ${m.label}` : `${m.label} (${m.tag})`}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector B (when Compare Mode is active) */}
          {compareMode && (
            <div className="relative flex items-center animate-in fade-in duration-150">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedModelB}
                onChange={(e) => setSelectedModelB(e.target.value)}
                disabled={loading}
                className="bg-[#0D1117] border border-emerald-500/30 hover:border-emerald-500 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer appearance-none disabled:opacity-50"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#161B22] text-slate-200">
                    B: {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Execution Button */}
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
                <span>{compareMode ? 'Run Comparison' : 'Run Live Preview'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {compareMode
          ? 'Execute both models concurrently to evaluate reasoning density, speed tradeoffs, and structural alignment.'
          : 'Test this compiled prompt instantly across frontier open-weights models to verify response fidelity.'}
      </p>

      {/* Results Section */}
      {(outputA || outputB) && (
        <div
          className={`pt-2 animate-in fade-in duration-200 ${
            compareMode ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'block'
          }`}
        >
          {outputA && renderMarkdownBox(outputA, selectedModelA, latencyA, copiedA, false)}
          {compareMode && outputB && renderMarkdownBox(outputB, selectedModelB, latencyB, copiedB, true)}
        </div>
      )}
    </div>
  );
}
