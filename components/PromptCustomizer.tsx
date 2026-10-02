'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Sliders, 
  FileCode, 
  ChevronDown, 
  GitFork, 
  Download, 
  Zap, 
  Lock,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { parsePromptVariables, replacePromptVariables } from '@/lib/variableParser';
import AIBridge from './AIBridge';
import PromptExportModal from './PromptExportModal';
import PromptSimulator from './PromptSimulator';
import PromptRemixModal from './PromptRemixModal';
import ProPaywall from './ProPaywall';

export interface Props {
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
  const baseTemplate = initialPrompt || template || prompt || '';
  const effectiveTitle = promptTitle || title || 'Custom System Prompt';
  const detectedVariables = useMemo(() => parsePromptVariables(baseTemplate), [baseTemplate]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState('Default');
  const [selectedFormat, setSelectedFormat] = useState('Default');
  const [selectedLength, setSelectedLength] = useState('Default');
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);

  // Pro State & Paywall Handling
  const [isProUser, setIsProUser] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState('Unlock Promptory Pro');
  const [paywallDesc, setPaywallDesc] = useState('');

  useEffect(() => {
    async function checkProStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      const localPro = typeof window !== 'undefined' && localStorage.getItem('promptory_pro_active') === 'true';
      
      if (user?.email === 'mantupatra23@gmail.com' || localPro) {
        setIsProUser(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('promptory_pro_active', 'true');
        }
      }
    }
    checkProStatus();
  }, []);

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

  const { publicPart, lockedPart, hasSplit } = useMemo(() => {
    let splitIdx = generatedPrompt.indexOf('### NEGATIVE CONSTRAINTS');
    if (splitIdx === -1) {
      splitIdx = generatedPrompt.indexOf('### OUTPUT FORMAT');
    }
    if (splitIdx === -1 && generatedPrompt.length > 320) {
      splitIdx = Math.floor(generatedPrompt.length * 0.55);
    }

    if (splitIdx > 0) {
      return {
        publicPart: generatedPrompt.slice(0, splitIdx).trimEnd(),
        lockedPart: generatedPrompt.slice(splitIdx).trimStart(),
        hasSplit: true,
      };
    }

    return {
      publicPart: generatedPrompt,
      lockedPart: '',
      hasSplit: false,
    };
  }, [generatedPrompt]);

  const handleCopy = async () => {
    try {
      if (isProUser) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textToCopy = `${publicPart}\n\n# [🔒 Full Production Guardrails & Schemas available on Promptory Pro: https://promptory.xyz/pricing]`;
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleExportClick = () => {
    if (!isProUser) {
      setPaywallTitle('Export API / IDE Snippets (Pro)');
      setPaywallDesc(
        'Exporting ready-to-run Python SDK, TypeScript, cURL, and LangChain snippets directly into your production codebase requires an active Promptory Pro subscription.'
      );
      setShowPaywall(true);
      return;
    }
    setShowExportModal(true);
  };

  const handleUnlockConstraints = () => {
    setPaywallTitle('Unlock Negative Constraints & Output Schemas');
    setPaywallDesc(
      'Full production-grade negative constraints, zero-hallucination guards, and exact JSON formatting schemas are unlocked with Promptory Pro.'
    );
    setShowPaywall(true);
  };

  return (
    <div className="space-y-6">
      {detectedVariables.length > 0 ? (
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
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <span>Direct Execution Mode</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                  Zero-Config Ready
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Yeh prompt pre-structured instructions ke saath ready hai. Isko directly simulate ya copy kar sakte hain.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRemixModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-[#30363D] transition shrink-0"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Remix &amp; Add Variables</span>
          </button>
        </div>
      )}

      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-md">
        <CustomSelect label="Output Tone" options={TONES} value={selectedTone} onChange={setSelectedTone} />
        <CustomSelect label="Output Format" options={FORMATS} value={selectedFormat} onChange={setSelectedFormat} />
        <CustomSelect label="Output Length" options={LENGTHS} value={selectedLength} onChange={setSelectedLength} />
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 md:p-6 space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Live Generated Prompt</h3>
            {!isProUser && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Gated Guardrails
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowRemixModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold transition border border-[#30363D]"
            >
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              <span>Remix / Fork</span>
            </button>

            <button
              onClick={handleExportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold transition border border-[#30363D]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export API / IDE</span>
              {!isProUser && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> PRO
                </span>
              )}
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
                  <span>{isProUser ? 'Copy Final Prompt' : 'Copy Basic Prompt'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isProUser ? (
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs md:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap select-all max-h-96 overflow-y-auto">
            {generatedPrompt}
          </div>
        ) : (
          <div className="rounded-xl bg-[#0D1117] border border-[#30363D] overflow-hidden text-xs md:text-sm font-mono leading-relaxed">
            <div className="p-4 text-slate-200 whitespace-pre-wrap select-all">
              {publicPart}
            </div>

            {hasSplit && (
              <div className="relative border-t border-[#30363D]/60 p-4 bg-[#080B0F]/90 overflow-hidden">
                <div className="filter blur-[4px] select-none pointer-events-none opacity-25 text-slate-400 whitespace-pre-wrap">
                  {lockedPart}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#0D1117]/60 via-[#0D1117]/95 to-[#0D1117] backdrop-blur-[2px]">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Negative Constraints &amp; Schema Locked</span>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center max-w-sm mb-3 font-sans leading-normal">
                    Production guardrails, zero-hallucination rules, and exact JSON output formats are exclusive to Pro subscribers.
                  </p>
                  <button
                    type="button"
                    onClick={handleUnlockConstraints}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>Unlock Full Blueprint (₹799/mo)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <PromptSimulator promptText={generatedPrompt} />
      <AIBridge promptText={generatedPrompt} modelName={modelName} />

      {showPaywall && (
        <ProPaywall
          title={paywallTitle}
          description={paywallDesc}
          price="₹799/mo"
          onClose={() => setShowPaywall(false)}
        />
      )}

      <PromptExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        promptTitle={effectiveTitle}
        compiledPrompt={generatedPrompt}
        modelName={modelName}
      />

      <PromptRemixModal
        isOpen={showRemixModal}
        onClose={() => setShowRemixModal(false)}
        initialPrompt={generatedPrompt}
        promptTitle={effectiveTitle}
        modelName={modelName}
      />
    </div>
  );
}
