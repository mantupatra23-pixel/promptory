import Link from 'next/link';
import { Terminal, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0D12]/80 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-100">
            Prompt<span className="text-emerald-400">ory</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 text-xs font-medium text-zinc-400">
          <Link href="/prompts" className="hover:text-zinc-100 transition-colors">
            Directory
          </Link>
          <Link href="/workflows" className="hover:text-zinc-100 transition-colors">
            Workflows
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
