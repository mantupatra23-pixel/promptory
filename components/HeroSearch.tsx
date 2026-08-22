'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Python FastAPI Review',
  'SaaS Cold Outreach',
  'SEO Blog Outline',
  'Real Estate Follow-Up',
  'Docker Architecture',
  'React Hook Optimizer',
];

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    router.push(`/directory?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex items-center mb-4">
        <div className="absolute left-4 text-zinc-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='What do you want AI to do? Try "Review my Python API code"...'
          className="w-full bg-[#12161F] border border-zinc-800 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-2xl"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
        >
          Search
        </button>
      </form>

      {/* Popular Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1 text-zinc-400">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Popular:
        </span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleChipClick(item)}
            className="bg-[#12161F] border border-zinc-800/90 hover:border-emerald-500/40 px-2.5 py-1 rounded-lg text-zinc-300 hover:text-emerald-400 transition"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
