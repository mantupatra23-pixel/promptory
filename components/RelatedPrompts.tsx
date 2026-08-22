import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from './PromptCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { searchPrompts } from '@/lib/searchEngine';

interface Props {
  currentId: string | number;
  modelSlug?: string;
  professionSlug?: string;
}

export default async function RelatedPrompts({ currentId, modelSlug = 'all', professionSlug = 'all' }: Props) {
  const { data: allPrompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .limit(100);

  if (!allPrompts || allPrompts.length === 0) return null;

  // Filter out the active prompt
  const otherPrompts = allPrompts.filter((p: any) => String(p.id) !== String(currentId));

  // Score candidate prompts using current context (model & role)
  const searchQuery = `${modelSlug} ${professionSlug.replace('-', ' ')}`;
  const { results } = searchPrompts(otherPrompts, searchQuery);

  const relatedList = results.slice(0, 3).length > 0 ? results.slice(0, 3) : otherPrompts.slice(0, 3);

  if (relatedList.length === 0) return null;

  return (
    <div className="mt-14 pt-10 border-t border-[#30363D]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Similar Workflows</span>
          </div>
          <h2 className="text-xl font-bold text-white">Related Prompts & Workflows</h2>
        </div>

        <Link
          href="/directory"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedList.map((prompt: any) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
