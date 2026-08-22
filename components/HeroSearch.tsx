'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (text: string) => {
    router.push(`/directory?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='What do you want AI to do? Try "Review my Python API code"...'
          className="w-full pl-11 pr-28 py-3.5 bg-[#161B22] border border-[#30363D] focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-lg focus:ring-1 focus:ring-emerald-500/30"
        />

        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20"
        >
          Search
        </button>
      </form>

      {/* Suggestion Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3.5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Popular:
        </span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSuggestionClick(tag)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#30363D] text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-[#21262D] transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
