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
        <div className="absolute left-4 text-[#D6D6D6]/60 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='What do you want AI to do? Try "Review my Python API code"...'
          className="w-full pl-11 pr-28 py-3.5 bg-[#4F4F51]/30 border border-[#4F4F51] focus:border-[#F58F7C] rounded-2xl text-xs sm:text-sm text-white placeholder-[#D6D6D6]/50 focus:outline-none transition backdrop-blur shadow-lg"
        />

        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-[#F58F7C] hover:bg-[#F58F7C]/90 text-black text-xs font-bold rounded-xl transition shadow-md"
        >
          Search
        </button>
      </form>

      {/* Suggestion Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3.5">
        <span className="text-[11px] font-semibold text-[#D6D6D6]/60 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#F58F7C]" /> Popular:
        </span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSuggestionClick(tag)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#4F4F51]/40 border border-[#4F4F51] text-[#D6D6D6] hover:text-white hover:border-[#F58F7C]/50 hover:bg-[#4F4F51]/70 transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
