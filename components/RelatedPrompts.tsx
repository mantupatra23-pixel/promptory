import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Sparkles, ArrowRight } from 'lucide-react';
import { normalizePrompt } from '@/lib/prompts/normalizePrompt';

export interface RelatedPromptsProps {
  currentId: string;
  modelSlug: string;
  professionSlug: string;
  professionId?: string;
  taskId?: string;
  taskSlug?: string;
  promptTitle?: string;
}

export default async function RelatedPrompts({
  currentId,
  modelSlug,
  professionSlug,
  professionId,
  taskId,
  taskSlug,
  promptTitle = '',
}: RelatedPromptsProps) {
  const isMarketingGrowth =
    ['digital-marketer', 'marketer', 'seo-specialist', 'founder'].includes(professionSlug) ||
    ['content-writing', 'email-outreach', 'seo', 'marketing', 'copywriting', 'client-follow-up'].includes(taskSlug || '') ||
    /\b(marketing|content|email|seo|outreach|copywriting|sales|conversion|lead|client)\b/i.test(promptTitle);

  const { data: candidates } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*), task:tasks(*)')
    .neq('id', currentId)
    .not('status', 'eq', 'rejected')
    .order('quality_score', { ascending: false })
    .limit(40);

  const devKeywordRegex = /\b(rust|postgres|postgresql|graphql|pytest|playwright|docker|apollo|sql|database|axum|debugging|unit test)\b/i;
  const marketingKeywordRegex = /\b(marketing|content|seo|email|outreach|copy|blog|social|sales|conversion)\b/i;

  const filtered = (candidates || []).filter((p: any) => {
    const title = p.title || '';
    const pRole = p.profession?.slug || '';
    const pTask = p.task?.slug || '';

    if (isMarketingGrowth) {
      if (devKeywordRegex.test(title)) return false;
      return (
        ['digital-marketer', 'marketer', 'seo-specialist', 'founder'].includes(pRole) ||
        ['content-writing', 'email-outreach', 'seo', 'marketing', 'client-follow-up'].includes(pTask) ||
        marketingKeywordRegex.test(title)
      );
    } else {
      if (marketingKeywordRegex.test(title) && !devKeywordRegex.test(title)) return false;
      return true;
    }
  });

  const related = filtered.slice(0, 6);
  if (related.length === 0) return null;

  const normalizedRelated = related.map(normalizePrompt);

  return (
    <section className="mt-14 pt-10 border-t border-[#30363D]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Related Technical Workflows</h2>
          <p className="text-xs text-slate-400 mt-0.5">Semantically matched workflows in this domain</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {normalizedRelated.map((p) => (
          <Link
            key={p.id}
            href={`/prompts/${p.model.slug}/${p.profession.slug}/${p.slug}`}
            className="group p-5 bg-[#161B22] border border-[#30363D] hover:border-emerald-500/40 rounded-xl transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-mono text-[11px] text-emerald-400 font-semibold uppercase">
                  {p.model.name}
                </span>
                <span className="text-slate-400 text-xs capitalize bg-[#21262D] px-2 py-0.5 rounded border border-[#30363D]">
                  {p.profession.name}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-1.5">
                {p.seoTitle}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#30363D]/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" />
                Score {p.qualityScore}/100
              </span>
              <span className="text-slate-300 group-hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors">
                View Prompt
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
