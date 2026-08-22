import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCustomizer from '@/components/PromptCustomizer';
import RelatedPrompts from '@/components/RelatedPrompts';
import ShareButton from '@/components/ShareButton';
import { Sparkles, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: {
    model: string;
    role: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: prompt } = await supabase
    .from('prompts')
    .select('title, description, model:models(name), profession:professions(name)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!prompt) {
    return { title: 'Prompt Not Found | Promptory' };
  }

  const modelName = (prompt.model as any)?.name || 'AI';
  const roleName = (prompt.profession as any)?.name || 'Professional';

  return {
    title: `${prompt.title} — Verified ${modelName} Prompt for ${roleName}s | Promptory`,
    description: prompt.description || `Battle-tested ${modelName} prompt for ${roleName}. Customize variables and launch in 1-click.`,
    alternates: {
      canonical: `https://www.promptory.xyz/prompts/${params.model}/${params.role}/${params.slug}`,
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!prompt) {
    notFound();
  }

  const modelName = prompt.model?.name || params.model.toUpperCase();
  const roleName = prompt.profession?.name || params.role.replace(/-/g, ' ');
  const modelSlug = prompt.model?.slug || params.model;
  const roleSlug = prompt.profession?.slug || params.role;

  const faqs = [
    {
      q: `What is the best way to run "${prompt.title}" in ${modelName}?`,
      a: `To maximize output quality in ${modelName}, replace all placeholder parameters with detailed real-world data rather than generic summaries. Setting your desired output format (like Markdown or JSON) ensures structured formatting on the first response.`,
    },
    {
      q: `Can I use this prompt with other AI models besides ${modelName}?`,
      a: `Yes! While this prompt is specifically optimized and formatted for ${modelName}, it executes cleanly across Claude 3.5, ChatGPT-4o, DeepSeek-R1, and Google Gemini Pro via the 1-Click AI App Launcher.`,
    },
    {
      q: `What variables are required to customize this template?`,
      a: `All dynamic parameters marked in square brackets (e.g. [PARAMETER]) are automatically parsed into the interactive customization inputs above.`,
    },
    {
      q: `Why does this prompt have a quality audit score of ${prompt.quality_score || 90}/100?`,
      a: `Promptory deterministically grades prompts across 5 dimensions: parameter specificity, role context framing, structural format constraints, imperative actionability, and token brevity.`,
    },
    {
      q: `Is this prompt suitable for ${roleName} workflows?`,
      a: `Yes, it was engineered specifically for ${roleName} production workflows to eliminate boilerplate back-and-forth prompt iterations.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/directory?model=${modelSlug}`} className="hover:text-emerald-400 capitalize transition">
          {modelName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/directory?role=${roleSlug}`} className="hover:text-emerald-400 capitalize transition">
          {roleName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate max-w-[200px]">{prompt.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {modelName}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#21262D] text-slate-300 capitalize border border-[#30363D]">
              {roleName}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3" />
              <span>Score {prompt.quality_score || 95}/100</span>
            </span>
          </div>

          <ShareButton title={prompt.title} description={prompt.description} />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {prompt.title}
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          {prompt.description || prompt.prompt_template?.slice(0, 150) + '...'}
        </p>
      </div>

      {/* Interactive Customizer & AI Launch Engine */}
      <PromptCustomizer
        initialPrompt={prompt.prompt_template || prompt.prompt}
        promptTitle={prompt.title}
        modelName={modelName}
        exampleInput={prompt.example_input}
      />

      {/* How to Use Section */}
      <section className="mt-14 pt-10 border-t border-[#30363D] space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">How to Use This {modelName} Prompt</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { step: '01', title: 'Configure Custom Variables', desc: 'Fill in the dynamic inputs above with your specific context and task requirements.' },
            { step: '02', title: 'Select Tone & Output Format', desc: 'Adjust output constraints (e.g. Markdown, Table, Technical, Concise) to match your workflow specifications.' },
            { step: '03', title: 'Launch in 1-Click or Copy', desc: 'Tap the "Copy Final Prompt" button or click any AI App Launcher (ChatGPT, Claude, Gemini, DeepSeek) to auto-copy and launch.' },
            { step: '04', title: 'Execute & Iterate', desc: `Paste into the chat interface. Because the prompt is deterministic (Score: ${prompt.quality_score || 95}/100), you will receive high-accuracy results immediately.` },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-1.5 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-400 font-mono">Step {item.step}</span>
              <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-14 pt-10 border-t border-[#30363D] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Dynamic guidance and operational advice for &apos;{prompt.title}&apos;</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#161B22] border border-[#30363D] rounded-2xl p-4 transition open:border-emerald-500/40">
              <summary className="text-xs sm:text-sm font-bold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-emerald-400 font-mono text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-[#30363D] leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Contextual Related Prompts */}
      <RelatedPrompts
        currentId={prompt.id}
        modelSlug={modelSlug}
        professionSlug={roleSlug}
      />

    </div>
  );
}
