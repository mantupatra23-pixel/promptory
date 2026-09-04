import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Sparkles, ArrowRight } from 'lucide-react';
import { normalizePrompt } from '@/lib/prompts/normalizePrompt';

interface RelatedPromptsProps {
  currentId: string;
  modelSlug: string;
  professionSlug: string;
  taskSlug?: string;
  tags?: string[];
}

export default async function RelatedPrompts({
  currentId,
  modelSlug,
  professionSlug,
  taskSlug,
  tags = [],
}: RelatedPromptsProps) {
  // Query prompts sharing the same task first, excluding the current prompt
  let query = supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*), task:tasks(*)')
    .neq('id', currentId)
    .eq('status', 'published');

  if (taskSlug) {
    query = query.eq('task_slug', taskSlug);
  }

  const { data: primaryBatch } = await query.order('quality_score', { ascending: false }).limit(6);

  let related = primaryBatch || [];

  // If fewer than 6, query by same profession and model to backfill
  if (related.length < 6) {
    const existingIds = [currentId, ...related.map((r) => r.id)];
    const { data: fallbackBatch } = await supabase
      .from('prompts')
      .select('*, model:models(*), profession:professions(*), task:tasks(*)')
      .not('id', 'in', `(${existingIds.join(',')})`)
      .eq('status', 'published')
      .order('quality_score', { ascending: false })
      .limit(6 - related.length);

    if (fallbackBatch) {
      related = [...related, ...fallbackBatch];
    }
  }

  if (related.length === 0) return null;

  const normalizedRelated = related.map(normalizePrompt);

  return (
    <section className="mt-14 pt-10 border-t border-[#30363D]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Related Technical Workflows</h2>
          <p className="text-xs text-slate-400 mt-0.5">Explore semantically matched prompts in this domain</p>
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
                  {p.task.name}
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
