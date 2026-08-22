'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import QualityScoreModal from './QualityScoreModal';
import { calculateQualityScore } from '@/lib/qualityScore';

export interface PromptCardData {
  id: string | number;
  title: string;
  slug?: string;
  task?: string;
  description?: string;
  prompt_template?: string;
  prompt?: string;
  content?: string;
  model?: any;
  profession?: any;
  role?: any;
  quality_score?: number;
  [key: string]: any;
}

export interface PromptCardProps {
  prompt: PromptCardData;
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
      <div className="group relative bg-[#4F4F51]/30 hover:bg-[#4F4F51]/60 border border-[#4F4F51] hover:border-[#F58F7C]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl backdrop-blur">
        <div>
          {/* Badges & Save Action */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F58F7C]/15 text-[#F58F7C] border border-[#F58F7C]/30">
                {modelName}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#2C2B30] text-[#D6D6D6]">
                {roleName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScoreClick}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2C2B30] border border-[#F58F7C]/30 text-[11px] font-bold text-[#F58F7C] hover:bg-[#F58F7C]/20 transition"
              >
                <Sparkles className="w-3 h-3 text-[#F58F7C]" />
                <span>{scoreBreakdown.total}/100</span>
              </button>

              <button
                onClick={handleToggleSave}
                aria-label="Save prompt"
                className={`p-1.5 rounded-lg border transition ${
                  saved
                    ? 'bg-[#F58F7C]/20 border-[#F58F7C]/40 text-[#F58F7C]'
                    : 'bg-[#2C2B30] border-[#4F4F51] text-[#D6D6D6]/70 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#F58F7C]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title */}
          <Link href={`/prompts/${modelSlug}/${professionSlug}/${taskSlug}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F58F7C] transition-colors line-clamp-1 mb-1.5">
              {prompt.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#D6D6D6]/80 line-clamp-2 leading-relaxed mb-4">
            {prompt.description || promptText}
          </p>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#4F4F51]/60">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#2C2B30] hover:bg-[#2C2B30]/80 text-xs font-semibold text-[#D6D6D6] transition border border-[#4F4F51]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F58F7C]" />
                <span className="text-[#F58F7C]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#D6D6D6]/70" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <Link
            href={`/prompts/${modelSlug}/${professionSlug}/${taskSlug}`}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#F58F7C]/15 hover:bg-[#F58F7C] text-[#F58F7C] hover:text-black text-xs font-bold transition border border-[#F58F7C]/30"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {showModal && (
        <QualityScoreModal
          isOpen={showModal}
          title={prompt.title || 'Prompt Quality Audit'}
          breakdown={scoreBreakdown}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
