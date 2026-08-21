import Link from 'next/link';
import { Terminal, Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#070A0E] text-zinc-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* BRAND COL */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-100">
              Prompt<span className="text-emerald-400">ory</span>
            </span>
          </Link>
          <p className="text-zinc-500 leading-relaxed text-[11px]">
            Open-access curated prompt library and multi-step AI workflow synthesizer. Tested for production systems.
          </p>
        </div>

        {/* MODELS */}
        <div>
          <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">AI Models</h4>
          <ul className="space-y-2">
            <li><Link href="/prompts/chatgpt" className="hover:text-emerald-400 transition-colors">ChatGPT Prompts</Link></li>
            <li><Link href="/prompts/claude" className="hover:text-emerald-400 transition-colors">Claude Code Prompts</Link></li>
            <li><Link href="/prompts/gemini" className="hover:text-emerald-400 transition-colors">Gemini Prompts</Link></li>
            <li><Link href="/prompts/deepseek" className="hover:text-emerald-400 transition-colors">DeepSeek Reasoning</Link></li>
          </ul>
        </div>

        {/* PROFESSIONS */}
        <div>
          <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">Roles & Domains</h4>
          <ul className="space-y-2">
            <li><Link href="/prompts/role/developer" className="hover:text-emerald-400 transition-colors">Software Developers</Link></li>
            <li><Link href="/prompts/role/seo-specialist" className="hover:text-emerald-400 transition-colors">SEO Strategists</Link></li>
            <li><Link href="/prompts/role/founder" className="hover:text-emerald-400 transition-colors">SaaS Founders</Link></li>
            <li><Link href="/prompts/role/marketer" className="hover:text-emerald-400 transition-colors">Digital Marketers</Link></li>
          </ul>
        </div>

        {/* PLATFORM & AUTOMATION */}
        <div>
          <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">Platform</h4>
          <ul className="space-y-2">
            <li><Link href="/workflows" className="hover:text-emerald-400 transition-colors">Chained AI Workflows</Link></li>
            <li><Link href="/saved" className="hover:text-emerald-400 transition-colors">Saved Prompts Hub</Link></li>
            <li><Link href="/submit" className="hover:text-emerald-400 transition-colors">Submit a Prompt</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-emerald-400 transition-colors">Sitemap XML</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800/60 max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
        <div>
          © 2026 Promptory. All prompts verified under open developer licensing.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">Built with <Heart className="w-3 h-3 text-emerald-400 fill-current" /> for AI Engineers</span>
        </div>
      </div>
    </footer>
  );
}
