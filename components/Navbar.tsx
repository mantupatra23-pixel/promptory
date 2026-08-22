'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, PlusCircle, Bookmark, Workflow } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#4F4F51]/60 bg-[#2C2B30]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#F58F7C]/15 border border-[#F58F7C]/30 flex items-center justify-center text-[#F58F7C] group-hover:bg-[#F58F7C] group-hover:text-black transition-all duration-200 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Prompt<span className="text-[#F58F7C]">ory</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/directory"
            className="text-xs font-semibold text-[#D6D6D6] hover:text-[#F58F7C] px-3 py-1.5 rounded-lg hover:bg-[#4F4F51]/40 transition"
          >
            Directory
          </Link>
          <Link
            href="/workflows"
            className="text-xs font-semibold text-[#D6D6D6] hover:text-[#F58F7C] px-3 py-1.5 rounded-lg hover:bg-[#4F4F51]/40 transition flex items-center gap-1.5"
          >
            <Workflow className="w-3.5 h-3.5 text-[#D6D6D6]/70" />
            <span>Workflows</span>
          </Link>
          <Link
            href="/saved"
            className="text-xs font-semibold text-[#D6D6D6] hover:text-[#F58F7C] px-3 py-1.5 rounded-lg hover:bg-[#4F4F51]/40 transition flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D6D6D6]/70" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F58F7C] hover:bg-[#F58F7C]/90 text-black text-xs font-bold transition shadow-sm shadow-[#F58F7C]/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
