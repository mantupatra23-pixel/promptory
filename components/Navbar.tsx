'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PlusCircle, Bookmark, Workflow, Compass, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#30363D]/80 bg-[#161B22]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Promptory Logo"
              width={32}
              height={32}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight text-white">
            Prompt<span className="text-emerald-400">ory</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/directory"
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${
              pathname === '/directory'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            Directory
          </Link>
          <Link
            href="/workflows"
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              pathname === '/workflows'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflows</span>
          </Link>
          <Link
            href="/saved"
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
              pathname === '/saved'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
          </Link>
        </nav>

        {/* Right Actions: Pinned Submit CTA & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-[#21262D] border border-[#30363D] transition shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#30363D] bg-[#161B22] px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          <Link
            href="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              pathname === '/directory'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-[#21262D] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Browse Directory</span>
          </Link>

          <Link
            href="/workflows"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              pathname === '/workflows'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-[#21262D] hover:text-white'
            }`}
          >
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>AI Workflows</span>
          </Link>

          <Link
            href="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              pathname === '/saved'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-[#21262D] hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Saved Prompts</span>
          </Link>
        </div>
      )}
    </header>
  );
}
