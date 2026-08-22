import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Promptory',
  description: 'Privacy Policy and Cookie Disclosures for Promptory.xyz',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-[#30363D] pb-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            Promptory does not collect personally identifiable information unless explicitly provided by you when submitting a prompt or contacting us. We utilize browser local storage to save your prompt bookmarks locally on your device.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">2. Google AdSense & Cookies</h2>
          <p>
            We may partner with third-party advertising partners, including Google AdSense. Third-party vendors use cookies to serve ads based on prior visits to this website or other websites.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to Promptory and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">3. Third-Party Links & AI Launchers</h2>
          <p>
            Our website provides 1-click launcher links to external third-party artificial intelligence services (such as OpenAI, Anthropic, Google, and DeepSeek). We are not responsible for the privacy practices or terms of these external platforms.
          </p>
        </section>

        <section className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">4. Contact Information</h2>
          <p>
            If you have questions or inquiries regarding this Privacy Policy, contact us directly at:
          </p>
          <p className="font-mono text-emerald-400 font-semibold">
            mantupatra23@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
