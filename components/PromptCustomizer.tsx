'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Copy, Check, RotateCcw, Sliders, FileCode } from 'lucide-react';
import { parsePromptVariables, replacePromptVariables } from '@/lib/variableParser';
import AIBridge from './AIBridge';

interface Props {
  initialPrompt?: string;
  template?: string;
  prompt?: string;
  promptTitle?: string;
  title?: string;
  promptId?: string | number;
  modelName?: string;
  exampleInput?: any;
  [key: string]: any;
}

const TONES = ['Default', 'Professional', 'Persuasive', 'Concise', 'Technical', 'Friendly', 'Casual', 'Urgent', 'Creative'];
const FORMATS = ['Default', 'Markdown', 'Bullet Points', 'Table', 'JSON', 'Step-by-Step', 'Plain Text'];
const LENGTHS = ['Default', 'Short', 'Medium', 'Detailed'];

export default function PromptCustomizer({
  initialPrompt,
  template,
  prompt,
  promptTitle,
  title,
  modelName,
  exampleInput,
}: Props) {
  const baseTemplate = initialPrompt || template || prompt || '';
  const detectedVariables = useMemo(() => parsePromptVariables(baseTemplate), [baseTemplate]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState('Default');
  const [selectedFormat, setSelectedFormat] = useState('Default');
  const [selectedLength, setSelectedLength] = useState('Default');
  const [copied, setCopied] = useState(false);

  // Auto-fill example inputs if provided by workflows
  useEffect(() => {
    if (exampleInput && typeof exampleInput === 'object') {
      setValues(exampleInput);
    }
  }, [exampleInput]);

  const handleInputChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setValues(exampleInput && typeof exampleInput === 'object' ? exampleInput : {});
    setSelectedTone('Default');
    setSelectedFormat('Default');
    setSelectedLength('Default');
  };

  const generatedPrompt = useMemo(() => {
    return replacePromptVariables(baseTemplate, values, {
      tone: selectedTone,
      format: selectedFormat,
      length: selectedLength,
    });
  }, [baseTemplate, values, selectedTone, selectedFormat, selectedLength]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6">
      
      {/* VARIABLE INPUTS SECTION */}
      {detectedVariables.length > 0 && (
        <div className="bg-[#12161F] border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100">
                {promptTitle || title ? `Customize: ${promptTitle || title}` : 'Customize Template Variables'}
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {detectedVariables.map((v) => {
              const currentVal = values[v.key] || '';
              return (
                <div key={v.key} className={v.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {v.label}
                  </label>
                  {v.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={`Enter ${v.label.toLowerCase()}...`}
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition font-mono"
                    />
                  ) : v.type === 'select' && v.options ? (
                    <select
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
                    >
                      <option value="">Select {v.label}</option>
                      {v.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${v.label.toLowerCase()}...`}
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OUTPUT CONTROLS (Tone, Format, Length) */}
      <div className="bg-[#12161F]/70 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Output Tone</label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Output Format</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Output Length</label>
          <select
            value={selectedLength}
            onChange={(e) => setSelectedLength(e.target.value)}
            className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* LIVE GENERATED PROMPT PREVIEW */}
      <div className="bg-[#12161F] border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">Live Generated Prompt</h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Final Prompt</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0D12] border border-zinc-800 text-xs md:text-sm text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap select-all max-h-96 overflow-y-auto">
          {generatedPrompt}
        </div>
      </div>

      {/* 1-CLICK AI BRIDGE */}
      <AIBridge promptText={generatedPrompt} modelName={modelName} />

    </div>
  );
}
