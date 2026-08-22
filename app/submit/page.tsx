'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calculateQualityScore } from '@/lib/qualityScore';
import { parsePromptVariables } from '@/lib/variableParser';
import { PlusCircle, Sparkles, Target, ShieldCheck, FileText, Zap, Eye, Check, AlertCircle, ArrowLeft } from 'lucide-react';

export default function SubmitPromptPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [model, setModel] = useState('chatgpt');
  const [profession, setProfession] = useState('developer');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time quality audit
  const scoreBreakdown = useMemo(() => {
    return calculateQualityScore(promptTemplate);
  }, [promptTemplate]);

  // Real-time variable detection
  const detectedVariables = useMemo(() => {
    return parsePromptVariables(promptTemplate);
  }, [promptTemplate]);

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

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const { error } = await supabase.from('prompts').insert([
        {
          title: title.trim(),
          slug,
          description: description.trim() || promptTemplate.slice(0, 140) + '...',
          prompt_template: promptTemplate.trim(),
          prompt: promptTemplate.trim(),
          model,
          profession,
          quality_score: scoreBreakdown.total,
          tags,
          status: 'approved',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/prompts/${model}/${profession}/${slug}`);
      }, 1500);
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
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 mb-4 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Submit & Share
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Submit a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Battle-Tested Prompt</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
          Contribute your high-performing system prompts to Promptory. Use square brackets like <code className="text-emerald-400">[TARGET_GOAL]</code> to define dynamic variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Prompt published successfully! Redirecting to live page...</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Prompt Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Python FastAPI Code Reviewer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#12161F] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Model & Role Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Optimized AI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#12161F] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="chatgpt">ChatGPT (GPT-4o)</option>
                <option value="claude">Anthropic Claude</option>
                <option value="deepseek">DeepSeek (R1/V3)</option>
                <option value="gemini">Google Gemini 1.5 Pro</option>
                <option value="midjourney">Midjourney v6</option>
                <option value="perplexity">Perplexity AI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Target Profession / Role</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full bg-[#12161F] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="developer">Developer</option>
                <option value="digital-marketer">Digital Marketer</option>
                <option value="founder">Founder / Executive</option>
                <option value="seo-specialist">SEO Specialist</option>
                <option value="real-estate-agent">Real Estate Agent</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Short Description</label>
            <input
              type="text"
              placeholder="Brief summary of what this prompt accomplishes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#12161F] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Prompt Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Prompt Instructions & Template *</label>
              <span className="text-[11px] text-zinc-500">Variables detected: {detectedVariables.length}</span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="Act as a senior [ROLE]. Review the following [CODE_SNIPPET] and optimize for [GOAL]..."
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="python, fastapi, backend, security"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#12161F] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-sm font-bold transition shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <span>Auditing & Publishing...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Prompt to Directory</span>
              </>
            )}
          </button>
        </form>

        {/* Live Quality Audit Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#12161F] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
              <span className="text-xs font-bold text-zinc-200">Live Quality Audit</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-400">{scoreBreakdown.total}</span>
                <span className="text-xs text-zinc-500 font-bold">/100</span>
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
                      <span className="flex items-center gap-1 text-zinc-400 font-medium">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        {f.label}
                      </span>
                      <span className="font-semibold text-zinc-300">{f.val} / 20</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(f.val / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Variables Box */}
          {detectedVariables.length > 0 && (
            <div className="bg-[#12161F] border border-zinc-800 rounded-2xl p-5">
              <span className="text-xs font-bold text-zinc-200 block mb-3">Detected Variables:</span>
              <div className="flex flex-wrap gap-1.5">
                {detectedVariables.map((v) => (
                  <span key={v.key} className="px-2 py-1 rounded bg-[#0A0D12] border border-zinc-800 text-[11px] font-mono text-emerald-400">
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
