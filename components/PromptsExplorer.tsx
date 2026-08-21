'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PromptCard from './PromptCard';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

interface Props {
  models: any[];
  professions: any[];
  initialPrompts: any[];
}

function ExplorerContent({ models, professions, initialPrompts }: Props) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const filteredPrompts = useMemo(() => {
    return initialPrompts.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.prompt_template?.toLowerCase().includes(q);

      const matchesModel =
        selectedModel === 'all' || p.model?.slug === selectedModel;

      const matchesProfession =
        selectedProfession === 'all' || p.profession?.slug === selectedProfession;

      return matchesSearch && matchesModel && matchesProfession;
    });
  }, [searchQuery, selectedModel, selectedProfession, initialPrompts]);

  const hasActiveFilters = searchQuery !== '' || selectedModel !== 'all' || selectedProfession !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedModel('all');
    setSelectedProfession('all');
  };

  return (
    <div className="space-y-8">
      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Filter prompts by title, keywords, or variable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[#0F141C] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-zinc-400 hover:text-emerald-400 whitespace-nowrap px-3 py-3 rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* FILTER PILLS */}
      <div className="space-y-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto pb-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-zinc-300 shrink-0">Model:</span>
          <div className="flex gap-1.5 flex-nowrap sm:flex-wrap">
            <button
              onClick={() => setSelectedModel('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedModel === 'all'
                  ? 'bg-emerald-500 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              All Models
            </button>
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.slug)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  selectedModel === m.slug
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto pb-1">
          <span className="font-semibold text-zinc-300 ml-5 shrink-0">Role:</span>
          <div className="flex gap-1.5 flex-nowrap sm:flex-wrap">
            <button
              onClick={() => setSelectedProfession('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedProfession === 'all'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              All Roles
            </button>
            {professions.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfession(p.slug)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  selectedProfession === p.slug
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PROMPTS GRID */}
      {filteredPrompts.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0F141C] border border-zinc-800">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">No matching prompts found</h3>
          <p className="text-xs text-zinc-500">Try searching for keywords like "Python", "SEO", or "FastAPI".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((p: any) => (
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
                status: p.status
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PromptsExplorer(props: Props) {
  return (
    <Suspense fallback={<div className="text-xs text-zinc-500 font-mono py-8">Loading explorer...</div>}>
      <ExplorerContent {...props} />
    </Suspense>
  );
}
