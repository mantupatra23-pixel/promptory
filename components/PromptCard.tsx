'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Sparkles, Check, ArrowRight, Copy } from 'lucide-react';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import { calculateQualityScore } from '@/lib/qualityScore';
import QualityScoreModal from './QualityScoreModal';

export interface PromptCardData {
  id: string | number;
  title: string;
  description?: string;
  prompt?: string;
  prompt_template?: string;
  promptTemplate?: string;
  content?: string;
  quality_score?: number;
  qualityScore?: number;
  model?: any;
  profession?: any;
  role?: string;
  task?: string;
  slug?: string;
  status?: string;
  example_input?: any;
  exampleInput?: any;
  example_output?: any;
  exampleOutput?: any;
  [key: string]: any;
}

export default function PromptCard({ prompt }: { prompt: PromptCardData }) {
  const { isSaved, toggleSave } = useSavedPrompts();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Normalize Model
  const modelName = typeof prompt.model === 'object' 
    ? prompt.model?.name || 'AI' 
    : prompt.model || 'AI';
  const modelSlug = (typeof prompt.model === 'object' 
    ? prompt.model?.slug 
    : String(prompt.model || 'chatgpt')).toLowerCase();

  // Normalize Profession / Role
  const roleName = typeof prompt.profession === 'object' 
    ? prompt.profession?.name || 'Developer' 
    : prompt.role || prompt.profession || 'Developer';
  const roleSlug = (typeof prompt.profession === 'object' 
    ? prompt.profession?.slug 
    : String(roleName).toLowerCase().replace(/\s+/g, '-'));

  // Normalize Prompt Template Text & Score
  const promptText = prompt.prompt_template || prompt.promptTemplate || prompt.prompt || prompt.content || '';
  const rawScore = prompt.quality_score || prompt.qualityScore || 96;
  const scoreBreakdown = calculateQualityScore(promptText, rawScore);
  const saved = isSaved(prompt.id);

  // Clean Navigation Route
  const taskSlug = prompt.slug || prompt.task || prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const detailUrl = `/prompts/${modelSlug}/${roleSlug}/${taskSlug}`;

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
    toggleSave(prompt.id);
  };

  return (
    <>
      <div className="group relative bg-[#12161F]/90 border border-zinc-800/90 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/20">
        <div>
          {/* Top Badges & Actions */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {modelName}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300">
                {roleName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Quality Score Trigger Modal */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(true);
                }}
                title="View Quality Audit"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/60 transition"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{scoreBreakdown.total}/100</span>
              </button>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleToggleSave}
                title={saved ? 'Remove from Saved' : 'Save Prompt'}
                className={`p-1.5 rounded-lg border transition ${
                  saved
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'border-zinc-800 bg-[#0A0D12] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title */}
          <Link href={detailUrl}>
            <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
              {prompt.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-5">
            {prompt.description || (promptText ? promptText.slice(0, 120) + '...' : '')}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/60">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-[#0A0D12] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <Link
            href={detailUrl}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Score Modal */}
      <QualityScoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        breakdown={scoreBreakdown}
        title={prompt.title}
      />
    </>
  );
}
