import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#30363D] bg-[#0D1117] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-3">
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
              Curated AI prompt directory and workflow templates for software engineers, founders, and technical operators.
            </p>
          </div>

          {/* AI Tasks */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Tasks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/tasks/coding" className="hover:text-emerald-400 transition">
                  Coding Prompts
                </Link>
              </li>
              <li>
                <Link href="/tasks/debugging" className="hover:text-emerald-400 transition">
                  Debugging Workflows
                </Link>
              </li>
              <li>
                <Link href="/tasks/database" className="hover:text-emerald-400 transition">
                  Database Optimization
                </Link>
              </li>
              <li>
                <Link href="/tasks/testing" className="hover:text-emerald-400 transition">
                  Testing & QA Prompts
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-emerald-400 font-semibold hover:underline">
                  All Tasks →
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Models */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Models</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/models/claude" className="hover:text-emerald-400 transition">
                  Claude 3.5 Sonnet
                </Link>
              </li>
              <li>
                <Link href="/models/deepseek" className="hover:text-emerald-400 transition">
                  DeepSeek-R1 Prompts
                </Link>
              </li>
              <li>
                <Link href="/models/chatgpt" className="hover:text-emerald-400 transition">
                  ChatGPT-4o Prompts
                </Link>
              </li>
              <li>
                <Link href="/models/gemini" className="hover:text-emerald-400 transition">
                  Google Gemini Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles & Disciplines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Engineering Roles</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/roles/software-developer" className="hover:text-emerald-400 transition">
                  Software Developers
                </Link>
              </li>
              <li>
                <Link href="/roles/founder" className="hover:text-emerald-400 transition">
                  SaaS Founders
                </Link>
              </li>
              <li>
                <Link href="/roles/devops" className="hover:text-emerald-400 transition">
                  DevOps & Cloud
                </Link>
              </li>
              <li>
                <Link href="/roles/marketer" className="hover:text-emerald-400 transition">
                  Growth & SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/directory" className="hover:text-emerald-400 transition">
                  Directory
                </Link>
              </li>
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
                <a
                  href="https://github.com/mantupatra23-pixel/promptory"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Promptory. Publishing reusable AI prompt templates and workflows.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>for Developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
