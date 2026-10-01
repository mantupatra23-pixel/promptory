'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PlusCircle, Bookmark, Workflow, Compass, Menu, X, Zap } from 'lucide-react';

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
          <Link
            href="/pricing"
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border ${
              pathname === '/pricing'
                ? 'text-amber-300 bg-amber-500/15 border-amber-500/40'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-400/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Pricing</span>
          </Link>
        </nav>

        {/* Right Actions: Pinned Submit CTA & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold transition shrink-0"
          >
            <Zap className="w-3 h-3 fill-amber-400" />
            <span>Pro</span>
          </Link>

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
            {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-400" /> : <Menu className="w-4 h-4 text-slate-300" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#30363D] bg-[#161B22] px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition border ${
              pathname === '/pricing'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Pro Subscription (₹799/mo)</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500 text-black">Upgrade</span>
          </Link>

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
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Saved Prompts</span>
          </Link>
        </div>
      )}
    </header>
  );
}
