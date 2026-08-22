'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { searchPrompts } from '@/lib/searchEngine';

const SUGGESTIONS = [
  'Python FastAPI Review',
  'SaaS Cold Outreach',
  'SEO Blog Outline',
  'Real Estate Follow-Up',
  'Docker Architecture',
  'React Hook Optimizer',
];

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [prompts, setPrompts] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch prompts list for instant client-side autocomplete
  useEffect(() => {
    async function loadPrompts() {
      const { data } = await supabase
        .from('prompts')
        .select('id, title, slug, model:models(name, slug), profession:professions(name, slug), quality_score')
        .limit(100);
      if (data) setPrompts(data);
    }
    loadPrompts();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live matching suggestions (Top 4)
  const matches = React.useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return searchPrompts(prompts, query).results.slice(0, 4);
  }, [prompts, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setDropdownOpen(false);
      router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectPrompt = (p: any) => {
    const modelSlug = (p.model?.slug || p.model || 'chatgpt').toLowerCase();
    const roleSlug = (p.profession?.slug || p.role || p.profession || 'developer').toLowerCase();
    const taskSlug = p.slug;
    setDropdownOpen(false);
    router.push(`/prompts/${modelSlug}/${roleSlug}/${taskSlug}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/directory?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setDropdownOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setDropdownOpen(true);
          }}
          placeholder='What do you want AI to do? Try "Review my Python API code"...'
          className="w-full pl-11 pr-28 py-3.5 bg-[#161B22] border border-[#30363D] focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-lg focus:ring-1 focus:ring-emerald-500/30"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-24 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {dropdownOpen && matches.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 bg-[#161B22] border border-[#30363D] rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Suggested Prompts
          </div>
          <div className="space-y-1">
            {matches.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPrompt(p)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#21262D] transition flex items-center justify-between group"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="capitalize text-emerald-400/80">{p.model?.name || 'AI'}</span>
                    <span>•</span>
                    <span className="capitalize">{p.profession?.name || 'General'}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3.5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Popular:
        </span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#30363D] text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-[#21262D] transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
