import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#30363D] bg-[#0D1117] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Promptory Logo"
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Prompt<span className="text-emerald-400">ory</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-access curated prompt library and multi-step AI workflow synthesizer. Tested for production systems.
            </p>
          </div>

          {/* Col 2: AI Models */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Models</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/directory?model=chatgpt" className="hover:text-emerald-400 transition">
                  ChatGPT Prompts
                </Link>
              </li>
              <li>
                <Link href="/directory?model=claude" className="hover:text-emerald-400 transition">
                  Claude Code Prompts
                </Link>
              </li>
              <li>
                <Link href="/directory?model=gemini" className="hover:text-emerald-400 transition">
                  Gemini Prompts
                </Link>
              </li>
              <li>
                <Link href="/directory?model=deepseek" className="hover:text-emerald-400 transition">
                  DeepSeek Reasoning
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Roles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Roles & Domains</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/directory?role=developer" className="hover:text-emerald-400 transition">
                  Software Developers
                </Link>
              </li>
              <li>
                <Link href="/directory?role=seo-specialist" className="hover:text-emerald-400 transition">
                  SEO Strategists
                </Link>
              </li>
              <li>
                <Link href="/directory?role=founder" className="hover:text-emerald-400 transition">
                  SaaS Founders
                </Link>
              </li>
              <li>
                <Link href="/directory?role=digital-marketer" className="hover:text-emerald-400 transition">
                  Digital Marketers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Promptory. All prompts verified under open developer licensing.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>for AI Engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
