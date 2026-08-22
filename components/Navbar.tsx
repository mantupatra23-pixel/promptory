'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, PlusCircle, Bookmark, Workflow } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-[#1e2330]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-200 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Prompt<span className="text-emerald-400">ory</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/directory"
            className="text-xs font-semibold text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            Directory
          </Link>
          <Link
            href="/workflows"
            className="text-xs font-semibold text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Workflow className="w-3.5 h-3.5 text-slate-400" />
            <span>Workflows</span>
          </Link>
          <Link
            href="/saved"
            className="text-xs font-semibold text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm shadow-emerald-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
