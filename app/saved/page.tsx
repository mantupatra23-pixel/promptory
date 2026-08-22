'use client';

import React from 'react';
import Link from 'next/link';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import { Bookmark, Sparkles, ArrowRight, Trash2, BookOpen } from 'lucide-react';

export default function SavedPromptsPage() {
  const { savedList, toggleSave, mounted } = useSavedPrompts();

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse text-xs text-slate-400">Loading your saved prompts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header Banner */}
      <div className="border border-slate-700/70 bg-[#1e2330] rounded-2xl p-6 md:p-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Bookmark className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Personal Library</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prompts</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl">
          Quick access to all your bookmarked battle-tested system prompts stored directly in your browser.
        </p>
      </div>

      {/* Empty State vs List Grid */}
      {savedList.length === 0 ? (
        <div className="border border-slate-800 bg-[#1e2330]/50 rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No saved prompts yet</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
            Browse the directory and tap the bookmark icon on any prompt card to save it for quick access.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition"
          >
            <span>Explore Prompt Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((p) => (
            <div
              key={p.id}
              className="group bg-[#1e2330] border border-slate-700/70 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.model && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                        {p.model}
                      </span>
                    )}
                    {p.role && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 capitalize">
                        {p.role.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  {p.qualityScore && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{p.qualityScore}/100</span>
                    </span>
                  )}
                </div>

                <Link href={`/prompts/${p.model || 'chatgpt'}/${p.role || 'developer'}/${p.slug}`}>
                  <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5">
                    {p.title}
                  </h2>
                </Link>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {p.description || 'Customizable system prompt.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/60">
                <Link
                  href={`/prompts/${p.model || 'chatgpt'}/${p.role || 'developer'}/${p.slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black text-xs font-bold transition border border-emerald-500/20"
                >
                  <span>Open Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => toggleSave(p)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 text-slate-400 border border-slate-700/70 transition"
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
