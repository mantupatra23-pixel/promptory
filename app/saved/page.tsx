'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useFavorites } from '@/hooks/useFavorites';
import PromptCard from '@/components/PromptCard';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SavedPromptsPage() {
  const { favorites, isLoaded } = useFavorites();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      if (!isLoaded) return;
      if (favorites.length === 0) {
        setPrompts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          model:models(*),
          profession:professions(*),
          task:tasks(*)
        `)
        .in('id', favorites);

      if (!error && data) {
        setPrompts(data);
      }
      setLoading(false);
    }
    loadSaved();
  }, [favorites, isLoaded]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Local Library</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-100 mb-2">Saved Prompts</h1>
        <p className="text-sm text-zinc-400">
          Your bookmarked prompts and custom templates saved locally in your browser.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 font-mono">Loading saved prompts...</div>
      ) : prompts.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0F141C] border border-zinc-800 max-w-md mx-auto">
          <Bookmark className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">No saved prompts yet</h3>
          <p className="text-xs text-zinc-500 mb-6">
            Click the "Save" button on any prompt to keep it here for quick access.
          </p>
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs"
          >
            Browse Prompts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((p) => (
            <PromptCard
              key={p.id}
              prompt={{
                id: p.id,
                title: p.title,
                slug: p.slug,
                model: p.model,
                profession: p.profession,
                task: p.task,
                description: p.description,
                promptTemplate: p.prompt_template,
                exampleInput: p.example_input,
                exampleOutput: p.example_output,
                qualityScore: p.quality_score,
                status: p.status,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
