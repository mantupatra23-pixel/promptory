import Link from 'next/link';
import { Terminal, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#080B10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-100">
            Prompt<span className="text-emerald-400">ory</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/prompts" className="hover:text-zinc-100 transition-colors">Directory</Link>
          <Link href="/models" className="hover:text-zinc-100 transition-colors">Models</Link>
          <Link href="/professions" className="hover:text-zinc-100 transition-colors">Professions</Link>
          <Link href="/workflows" className="hover:text-zinc-100 transition-colors">Workflows</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="/prompts" 
            className="px-4 py-2 text-xs font-medium bg-emerald-500 text-zinc-950 rounded-lg hover:bg-emerald-400 transition-all font-semibold"
          >
            Explore Library
          </Link>
        </div>
      </div>
    </header>
  );
}
