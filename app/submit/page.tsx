import SubmitGuideAndFaq from "./SubmitGuideAndFaq";
'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import { calculateQualityScore } from '@/lib/qualityScore';
import { parsePromptVariables } from '@/lib/variableParser';
import { 
  PlusCircle, 
  Target, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Eye, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  ChevronDown,
  GitFork,
  Sparkles,
  Loader2,
  Code,
  LayoutTemplate
} from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

function CustomDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
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

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/50 rounded-xl px-3.5 py-3 text-xs text-slate-100 flex items-center justify-between transition focus:outline-none focus:border-emerald-500"
      >
        <span className="text-emerald-400 font-semibold">{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto bg-[#161B22] border border-[#30363D] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-[#0D1117] hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const MODEL_OPTIONS: Option[] = [
  { value: 'chatgpt', label: 'ChatGPT (GPT-4o)' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'deepseek', label: 'DeepSeek (R1/V3)' },
  { value: 'gemini', label: 'Google Gemini 1.5 Pro' },
  { value: 'midjourney', label: 'Midjourney v6' },
  { value: 'perplexity', label: 'Perplexity AI' },
];

const PROFESSION_OPTIONS: Option[] = [
  { value: 'developer', label: 'Developer' },
  { value: 'digital-marketer', label: 'Digital Marketer' },
  { value: 'founder', label: 'Founder / Executive' },
  { value: 'seo-specialist', label: 'SEO Specialist' },
  { value: 'real-estate-agent', label: 'Real Estate Agent' },
];

const QUICK_VARIABLES = [
  '[TARGET_GOAL]',
  '[CODE_SNIPPET]',
  '[INPUT_DATA]',
  '[INDUSTRY]',
  '[OUTPUT_FORMAT]'
];

function SubmitFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState('');
  const [model, setModel] = useState('chatgpt');
  const [profession, setProfession] = useState('developer');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [aiRefining, setAiRefining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFork, setIsFork] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setCurrentUserEmail(user.email);
    }
    getAuth();
  }, []);

  useEffect(() => {
    const forkTitle = searchParams.get('fork_title');
    const forkTemplate = searchParams.get('fork_template');
    const forkModel = searchParams.get('fork_model');

    if (forkTitle || forkTemplate) {
      setIsFork(true);
      if (forkTitle) setTitle(forkTitle);
      if (forkTemplate) setPromptTemplate(forkTemplate);
      if (forkModel && MODEL_OPTIONS.some((m) => m.value === forkModel)) {
        setModel(forkModel);
      }
    }
  }, [searchParams]);

  const scoreBreakdown = useMemo(() => {
    return calculateQualityScore(promptTemplate);
  }, [promptTemplate]);

  const detectedVariables = useMemo(() => {
    return parsePromptVariables(promptTemplate);
  }, [promptTemplate]);

  const insertVariableAtCursor = (varTag: string) => {
    if (!textareaRef.current) {
      setPromptTemplate((prev) => `${prev} ${varTag}`);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = promptTemplate;
    const newText = text.substring(0, start) + varTag + text.substring(end);
    setPromptTemplate(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + varTag.length, start + varTag.length);
      }
    }, 50);
  };

  const handleInsertStarterBlueprint = () => {
    const blueprint = `### ROLE
You are an expert [ROLE] specializing in high-performance [DOMAIN] solutions.

### GUIDELINES
1. **Context-Driven Execution**: Analyze [INPUT_DATA] thoroughly before generating recommendations.
2. **Deterministic Clarity**: Enforce strict actionable steps without conversational preamble.
3. **Target Optimization**: Align all outputs to achieve [TARGET_GOAL].

### NEGATIVE CONSTRAINTS
- Never provide generic unverified assumptions.
- Avoid deprecated syntax or outdated industry patterns.
- Do not exceed specified output length parameters.

### INPUT CONTEXT
- Primary Data: [INPUT_DATA]
- Goal: [TARGET_GOAL]
- Format Constraint: [OUTPUT_FORMAT]

### OUTPUT FORMAT
Provide a clean Markdown deliverable with executive summary, implementation breakdown, and risk matrix.`;
    setPromptTemplate(blueprint);
  };

  const handleAiRefine = async () => {
    if (!promptTemplate.trim() && !title.trim()) {
      setErrorMsg('Please enter at least a title or a draft prompt to refine.');
      return;
    }

    setAiRefining(true);
    setErrorMsg('');

    try {
      const draft = promptTemplate.trim() || `Design a system prompt for: ${title}`;
      const refinementPrompt = `Act as an Elite Principal Prompt Engineer. Transform the following raw prompt draft into a production-grade, battle-tested system prompt template with quality score 100/100.
Enforce standard architecture:
### ROLE
### GUIDELINES (numbered with clear objectives)
### NEGATIVE CONSTRAINTS (strict boundary conditions)
### INPUT CONTEXT (use [SQUARE_BRACKETS] for all dynamic parameters)
### OUTPUT FORMAT (exact structure required)

Return ONLY the compiled template text. No introductory remarks, explanations, or quotes.

Raw Draft:
${draft}`;

      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: refinementPrompt,
          model: 'openai/gpt-oss-120b',
          email: currentUserEmail || 'mantupatra23@gmail.com'
        })
      });

      const data = await res.json();
      if (data.output) {
        setPromptTemplate(data.output.trim());
      } else {
        throw new Error(data.error || 'Failed to refine template.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI refinement failed. Please try again.');
    } finally {
      setAiRefining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptTemplate.trim()) {
      setErrorMsg('Please fill in both Title and Prompt Template.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const [modelRes, profRes, sampleStatusRes] = await Promise.all([
        supabase.from('models').select('id').eq('slug', model).maybeSingle(),
        supabase.from('professions').select('id').eq('slug', profession).maybeSingle(),
        supabase.from('prompts').select('status').limit(1).maybeSingle(),
      ]);

      const modelId = modelRes.data?.id;
      const professionId = profRes.data?.id;
      const validStatus = sampleStatusRes.data?.status || 'published';

      const insertPayload: Record<string, any> = {
        title: title.trim(),
        slug,
        description: description.trim() || promptTemplate.slice(0, 140) + '...',
        prompt_template: promptTemplate.trim(),
        quality_score: scoreBreakdown.total,
        status: validStatus,
      };

      if (modelId) insertPayload.model_id = modelId;
      if (professionId) insertPayload.profession_id = professionId;

      const { error } = await supabase.from('prompts').insert([insertPayload]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/prompts/${model}/${profession}/${slug}`);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap mb-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            {isFork ? <GitFork className="w-3 h-3 text-cyan-400" /> : <Sparkles className="w-3 h-3 text-emerald-400" />}
            <span>{isFork ? 'Remix / Fork Mode' : 'Community Submission'}</span>
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          {isFork ? 'Remix this ' : 'Submit a '}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Battle-Tested Blueprint
          </span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
          Contribute high-fidelity AI prompt engineering architectures. Define dynamic input variables inside square brackets like <code className="text-emerald-400 font-mono">[TARGET_GOAL]</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 flex-wrap sm:flex-nowrap shadow-lg shadow-emerald-500/10">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Blueprint published successfully! Redirecting to live page...</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prompt Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Rust Performance & Memory Profiler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomDropdown
              label="Optimized Frontier Model"
              options={MODEL_OPTIONS}
              value={model}
              onChange={setModel}
            />
            <CustomDropdown
              label="Target Role / Domain"
              options={PROFESSION_OPTIONS}
              value={profession}
              onChange={setProfession}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Executive Summary (Optional)</label>
            <input
              type="text"
              placeholder="Brief overview of operational objective and expected output..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Prompt Body with Tabs & AI Enhancer */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1 bg-[#161B22] p-1 rounded-xl border border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'write' ? 'bg-[#21262D] text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'preview' ? 'bg-[#21262D] text-cyan-400 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={handleInsertStarterBlueprint}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 bg-[#161B22] border border-[#30363D] hover:border-slate-500 transition"
                >
                  <LayoutTemplate className="w-3 h-3 text-cyan-400" />
                  <span>Starter Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={handleAiRefine}
                  disabled={aiRefining}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition shadow-sm disabled:opacity-50"
                >
                  {aiRefining ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-black" />
                      <span>Refining...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 fill-black text-black" />
                      <span>Auto-Refine with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Variable Inserter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-400">
              <span className="font-mono text-[10px] uppercase text-slate-500">Insert Tag:</span>
              {QUICK_VARIABLES.map((vTag) => (
                <button
                  key={vTag}
                  type="button"
                  onClick={() => insertVariableAtCursor(vTag)}
                  className="px-2 py-0.5 rounded-md bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] hover:border-emerald-500/50 text-emerald-400 font-mono text-[10px] transition"
                >
                  + {vTag}
                </button>
              ))}
            </div>

            {/* Content Field */}
            {activeTab === 'write' ? (
              <textarea
                ref={textareaRef}
                required
                rows={11}
                placeholder="Act as a senior [ROLE]. Review the following [CODE_SNIPPET] and optimize for [GOAL]..."
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed transition"
              />
            ) : (
              <div className="w-full min-h-[220px] max-h-[380px] overflow-y-auto bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs md:text-sm text-slate-200 font-mono leading-relaxed select-all">
                {promptTemplate.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {promptTemplate}
                  </ReactMarkdown>
                ) : (
                  <span className="text-slate-600 italic">No prompt content entered yet.</span>
                )}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading || aiRefining}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-sm font-bold transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Auditing &amp; Publishing Blueprint...</span>
              </div>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>{isFork ? 'Publish Remixed Blueprint' : 'Publish Blueprint to Directory'}</span>
              </>
            )}
          </button>
        </form>

        {/* Live Quality Audit Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D] mb-4">
              <span className="text-xs font-bold text-slate-200">Production Quality Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-black ${scoreBreakdown.total >= 80 ? 'text-emerald-400' : scoreBreakdown.total >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {scoreBreakdown.total}
                </span>
                <span className="text-xs text-slate-500 font-bold">/100</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Specificity', val: scoreBreakdown.specificity, icon: Target },
                { label: 'Context', val: scoreBreakdown.context, icon: ShieldCheck },
                { label: 'Structure', val: scoreBreakdown.structure, icon: FileText },
                { label: 'Actionability', val: scoreBreakdown.actionability, icon: Zap },
                { label: 'Clarity', val: scoreBreakdown.clarity, icon: Eye },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        {f.label}
                      </span>
                      <span className="font-semibold text-slate-300">{f.val} / 20</span>
                    </div>
                    <div className="w-full h-1 bg-[#0D1117] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${f.val >= 16 ? 'bg-emerald-500' : f.val >= 10 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${(f.val / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tactical Recommendations for Score Improvement */}
            <div className="mt-5 pt-4 border-t border-[#30363D] space-y-1.5 text-[11px] text-slate-400">
              <span className="text-slate-300 font-bold block mb-1">Architecture Checklist:</span>
              <div className="flex items-center gap-1.5">
                <span className={promptTemplate.includes('### ROLE') || promptTemplate.includes('Act as') ? 'text-emerald-400' : 'text-slate-600'}>
                  {promptTemplate.includes('### ROLE') || promptTemplate.includes('Act as') ? '✓' : '○'}
                </span>
                <span>Role definition established</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={detectedVariables.length >= 2 ? 'text-emerald-400' : 'text-slate-600'}>
                  {detectedVariables.length >= 2 ? '✓' : '○'}
                </span>
                <span>2+ Dynamic variables defined</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={promptTemplate.includes('### NEGATIVE CONSTRAINTS') ? 'text-emerald-400' : 'text-slate-600'}>
                  {promptTemplate.includes('### NEGATIVE CONSTRAINTS') ? '✓' : '○'}
                </span>
                <span>Anti-hallucination guardrails</span>
              </div>
            </div>
          </div>

          {/* Detected Variables Box */}
          {detectedVariables.length > 0 && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-200">Detected Dynamic Variables</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {detectedVariables.length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedVariables.map((v) => (
                  <span
                    key={v.key}
                    className="px-2 py-1 rounded bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-emerald-400"
                  >
                    [{v.key}]
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubmitPromptPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400 font-mono">Loading submission portal...
        <SubmitGuideAndFaq />
      </div>}>
      <SubmitFormContent />
    </Suspense>
  );
}
