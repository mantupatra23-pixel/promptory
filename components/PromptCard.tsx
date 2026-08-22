'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import QualityScoreModal from './QualityScoreModal';
import { calculateQualityScore } from '@/lib/qualityScore';

interface PromptCardProps {
  prompt: any;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isSaved, toggleSave } = useSavedPrompts();

  const modelSlug = (prompt.model?.slug || prompt.model || 'chatgpt').toLowerCase();
  const professionSlug = (prompt.profession?.slug || prompt.role || prompt.profession || 'developer')
    .toLowerCase()
    .replace(/\s+/g, '-');
  const taskSlug = (prompt.slug || prompt.task || prompt.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'prompt');

  const modelName = prompt.model?.name || prompt.model || 'ChatGPT';
  const roleName = prompt.profession?.name || prompt.profession || 'Developer';
  const promptText = prompt.prompt_template || prompt.prompt || prompt.content || '';

  const scoreBreakdown = calculateQualityScore(promptText, prompt.quality_score || 95);
  const saved = isSaved(prompt.id);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({
      id: String(prompt.id),
      title: prompt.title || 'Untitled Prompt',
      slug: taskSlug,
      description: prompt.description || '',
      model: modelSlug,
      role: professionSlug,
      qualityScore: scoreBreakdown.total,
    });
  };

  const handleScoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="group relative bg-[#1e2330] border border-slate-700/70 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20">
        <div>
          {/* Badges & Save Action */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {modelName}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300">
                {roleName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScoreClick}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-bold text-emerald-400 hover:bg-emerald-900/40 transition"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{scoreBreakdown.total}/100</span>
              </button>

              <button
                onClick={handleToggleSave}
                aria-label="Save prompt"
                className={`p-1.5 rounded-lg border transition ${
                  saved
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title */}
          <Link href={`/prompts/${modelSlug}/${professionSlug}/${taskSlug}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5">
              {prompt.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {prompt.description || promptText}
          </p>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/60">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition border border-slate-700/70"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <Link
            href={`/prompts/${modelSlug}/${professionSlug}/${taskSlug}`}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black text-xs font-bold transition border border-emerald-500/20"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {showModal && (
        <QualityScoreModal
          title={prompt.title}
          breakdown={scoreBreakdown}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
