'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PromptCard, { PromptCardData } from './PromptCard';
import { Search, SlidersHorizontal, Sparkles, X, ArrowUpDown, HelpCircle } from 'lucide-react';
import { searchPrompts } from '@/lib/searchEngine';

interface Props {
  initialPrompts: PromptCardData[];
  models?: { id: string; name: string; slug: string }[];
  professions?: { id: string; name: string; slug: string }[];
  selectedModel?: string;
  selectedProfession?: string;
}

function ExplorerContent({
  initialPrompts = [],
  models = [],
  professions = [],
  selectedModel = 'all',
  selectedProfession = 'all',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') || '';
  const urlModel = searchParams.get('model') || selectedModel;
  const urlRole = searchParams.get('role') || selectedProfession;
  const urlSort = (searchParams.get('sort') as any) || 'relevance';

  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [activeModel, setActiveModel] = useState(urlModel);
  const [activeRole, setActiveRole] = useState(urlRole);
  const [sortBy, setSortBy] = useState<'relevance' | 'quality' | 'newest'>(urlSort);

  // Sync internal state when URL parameters change
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    if (searchParams.get('model')) setActiveModel(searchParams.get('model')!);
    if (searchParams.get('role')) setActiveRole(searchParams.get('role')!);
  }, [searchParams]);

  // Debounced URL updates (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (activeModel !== 'all') params.set('model', activeModel);
      if (activeRole !== 'all') params.set('role', activeRole);
      if (sortBy !== 'relevance') params.set('sort', sortBy);

      const qs = params.toString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm, activeModel, activeRole, sortBy, pathname, router]);

  // Execute Search via Search Engine
  const { results, tokens } = useMemo(() => {
    return searchPrompts(initialPrompts, searchTerm, {
      modelFilter: activeModel,
      roleFilter: activeRole,
      sortBy,
    });
  }, [initialPrompts, searchTerm, activeModel, activeRole, sortBy]);

  const handleClear = () => {
    setSearchTerm('');
    setActiveModel('all');
    setActiveRole('all');
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-8">
      
      {/* SEARCH BAR & CONTROLS */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search naturally (e.g. 'I need a prompt to review Python FastAPI code')..."
            className="w-full bg-[#0D1117] border border-[#30363D] focus:border-emerald-500 rounded-xl pl-11 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges & Sort Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Model Filter */}
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-[#0D1117] border border-[#30363D] text-xs font-semibold text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Models</option>
              {models.map((m) => (
                <option key={m.id || m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-[#0D1117] border border-[#30363D] text-xs font-semibold text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Roles</option>
              {professions.map((p) => (
                <option key={p.id || p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {(searchTerm || activeModel !== 'all' || activeRole !== 'all') && (
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Token Feedback */}
        {searchTerm.trim() && tokens.length > 0 && results.length > 0 && (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              Showing relevance matches for: <strong className="text-slate-200">{tokens.join(', ')}</strong> ({results.length} found)
            </span>
          </div>
        )}
      </div>

      {/* RESULTS GRID OR EMPTY STATE */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="bg-[#161B22]/60 border border-[#30363D] rounded-2xl p-10 text-center space-y-4 shadow-md">
          <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white mb-1">No matching prompts found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find an exact match for <span className="text-slate-200 font-mono">"{searchTerm}"</span>.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-slate-500 block mb-2 font-medium">
              Try broader keywords like:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Python', 'FastAPI', 'SEO', 'Cold Email', 'Code Review'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchTerm(keyword)}
                  className="px-3 py-1 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
          >
            Clear Search
          </button>
        </div>
      )}

    </div>
  );
}

export default function PromptsExplorer(props: Props) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading discovery engine...</div>}>
      <ExplorerContent {...props} />
    </Suspense>
  );
}
