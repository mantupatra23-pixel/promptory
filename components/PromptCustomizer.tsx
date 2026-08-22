'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, RotateCcw, Sliders, FileCode, ChevronDown, GitFork, Download } from 'lucide-react';
import { parsePromptVariables, replacePromptVariables } from '@/lib/variableParser';
import AIBridge from './AIBridge';
import PromptExportModal from './PromptExportModal';
import PromptSimulator from './PromptSimulator';

interface Props {
  initialPrompt?: string;
  template?: string;
  prompt?: string;
  promptTitle?: string;
  title?: string;
  modelName?: string;
  exampleInput?: any;
}

const TONES = ['Default', 'Professional', 'Persuasive', 'Concise', 'Technical', 'Friendly', 'Casual', 'Urgent', 'Creative'];
const FORMATS = ['Default', 'Markdown', 'Bullet Points', 'Table', 'JSON', 'Step-by-Step', 'Plain Text'];
const LENGTHS = ['Default', 'Short', 'Medium', 'Detailed'];

function CustomSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 flex items-center justify-between transition focus:outline-none focus:border-emerald-500"
      >
        <span className={value !== 'Default' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
          {value}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-[#161B22] border border-[#30363D] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-[#0D1117] hover:text-white'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PromptCustomizer({
  initialPrompt,
  template,
  prompt,
  promptTitle,
  title,
  modelName = 'ChatGPT',
  exampleInput,
}: Props) {
  const router = useRouter();
  const baseTemplate = initialPrompt || template || prompt || '';
  const effectiveTitle = promptTitle || title || 'Custom System Prompt';
  const detectedVariables = useMemo(() => parsePromptVariables(baseTemplate), [baseTemplate]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState('Default');
  const [selectedFormat, setSelectedFormat] = useState('Default');
  const [selectedLength, setSelectedLength] = useState('Default');
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (exampleInput && typeof exampleInput === 'object') {
      setValues(exampleInput);
    }
  }, [exampleInput]);

  const handleInputChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
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

  const handleRemix = () => {
    const params = new URLSearchParams({
      fork_title: `[Remix] ${effectiveTitle}`,
      fork_template: baseTemplate,
      fork_model: modelName.toLowerCase(),
    });
    router.push(`/submit?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* VARIABLE INPUTS SECTION */}
      {detectedVariables.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 md:p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Customize Template Variables</h3>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{v.label}</label>
                  {v.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={`Enter ${v.label.toLowerCase()}...`}
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${v.label.toLowerCase()}...`}
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OUTPUT CONSTRAINTS */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-md">
        <CustomSelect label="Output Tone" options={TONES} value={selectedTone} onChange={setSelectedTone} />
        <CustomSelect label="Output Format" options={FORMATS} value={selectedFormat} onChange={setSelectedFormat} />
        <CustomSelect label="Output Length" options={LENGTHS} value={selectedLength} onChange={setSelectedLength} />
      </div>

      {/* LIVE GENERATED PROMPT PREVIEW */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 md:p-6 space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Live Generated Prompt</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRemix}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold transition border border-[#30363D]"
            >
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              <span>Remix / Fork</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold transition border border-[#30363D]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export API / IDE</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Final Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs md:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap select-all max-h-96 overflow-y-auto">
          {generatedPrompt}
        </div>
      </div>

      {/* LIVE AI OUTPUT SIMULATOR */}
      <PromptSimulator promptText={generatedPrompt} />

      {/* 1-CLICK AI BRIDGE */}
      <AIBridge promptText={generatedPrompt} modelName={modelName} />

      {/* DEVELOPER EXPORT MODAL */}
      <PromptExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        promptTitle={effectiveTitle}
        compiledPrompt={generatedPrompt}
        modelName={modelName}
      />

    </div>
  );
}
