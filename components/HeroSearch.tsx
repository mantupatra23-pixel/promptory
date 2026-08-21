'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/prompts?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/prompts');
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/prompts?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="relative group mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want AI to do? (e.g. Python code review, SEO outline...)"
          className="w-full pl-12 pr-28 py-4 bg-[#0F141C] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all text-sm sm:text-base shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2.5 top-2.5 bottom-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-all"
        >
          Search
        </button>
      </form>

      {/* POPULAR SEARCH TAGS */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-zinc-400">
        <span className="text-zinc-500">Popular:</span>
        {['Python Code Review', 'Real Estate Follow-Up', 'SEO Content Outline', 'FastAPI Performance'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
