import React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Promptory',
  description: 'Get in touch with the Promptory team for inquiries and feedback.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-[#30363D] pb-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" />
          <span>Support & Partnerships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Us</h1>
        <p className="text-xs text-slate-400 mt-1">We respond to all developer and partnership inquiries within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Direct Email Contact</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            For general feedback, prompt takedown requests, advertising partnerships, or bug reports:
          </p>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[11px] text-slate-400">Official Contact Email:</span>
            <a
              href="mailto:mantupatra23@gmail.com"
              className="block text-sm font-bold text-emerald-400 hover:underline font-mono"
            >
              mantupatra23@gmail.com
            </a>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Send a Message</h2>
          <a
            href="mailto:mantupatra23@gmail.com?subject=Promptory%20Inquiry"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Email Client</span>
          </a>
        </div>
      </div>
    </div>
  );
}
