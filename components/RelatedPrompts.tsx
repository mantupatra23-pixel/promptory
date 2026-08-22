import React from 'react';
import { supabase } from '@/lib/supabase';
import PromptCard from './PromptCard';
import { Layers } from 'lucide-react';

interface RelatedProps {
  currentId: string | number;
  modelSlug?: string;
  professionSlug?: string;
}

export default async function RelatedPrompts({ currentId, modelSlug, professionSlug }: RelatedProps) {
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .neq('id', currentId)
    .limit(3);

  const related = prompts || [];
  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-zinc-800/80">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-zinc-100">Related Prompts & Workflows</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
    </section>
  );
}
