import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Promptory',
  description: 'Terms of Service and Usage Conditions for Promptory.xyz',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-[#30363D] pb-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Promptory.xyz, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue using our services.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">2. AI Prompts & Educational Content</h2>
          <p>
            All prompts and code review templates hosted on Promptory are provided &quot;as is&quot; for educational, developer productivity, and testing purposes. We do not guarantee specific model output deterministic behavior on third-party AI APIs.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">3. Intellectual Property & Submissions</h2>
          <p>
            Prompts submitted under our public directory are made available under open developer licensing terms to allow engineers to freely customize, remix, and integrate into their workflows.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">4. Inquiries & Support</h2>
          <p>
            For legal notices or technical disputes, contact us at: <span className="text-emerald-400 font-mono">mantupatra23@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}
