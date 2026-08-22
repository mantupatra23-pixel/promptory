'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import PromptCard from '@/components/PromptCard';
import { Bookmark, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function SavedPromptsPage() {
  const { savedIds, isLoaded } = useSavedPrompts();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSaved() {
      if (!isLoaded) return;
      if (savedIds.length === 0) {
        setPrompts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*, model:models(*), profession:professions(*)')
        .in('id', savedIds);

      if (!error && data) {
        setPrompts(data);
      }
      setLoading(false);
    }
    fetchSaved();
  }, [savedIds, isLoaded]);

  const filteredPrompts = prompts.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="border border-zinc-800 bg-[#12161F]/60 backdrop-blur rounded-2xl p-6 md:p-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Bookmark className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Personal Library</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight">
          My Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prompts</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Quickly access and customize your favorite system prompts stored locally in guest storage.
        </p>

        {prompts.length > 0 && (
          <div className="mt-5 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search your saved prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0D12] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Content State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-[#12161F]/50 border border-zinc-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-zinc-800 rounded-2xl bg-[#12161F]/30 p-8">
          <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-200 mb-2">No Saved Prompts Yet</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
            Click the bookmark icon on any prompt card or detail page to build your custom prompt workspace.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <span>Explore Prompts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
