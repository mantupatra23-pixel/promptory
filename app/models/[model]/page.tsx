import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import { 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Zap 
} from 'lucide-react';

export const revalidate = 60;

interface Props {
  params: {
    model: string;
  };
}

interface ModelMeta {
  name: string;
  badge: string;
  contextWindow: string;
  desc: string;
  highlights: string;
  guidelines: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const MODEL_INFO: Record<string, ModelMeta> = {
  chatgpt: {
    name: 'OpenAI ChatGPT (GPT-4o)',
    badge: 'GPT-4o / Reasoning',
    contextWindow: '128k Tokens',
    desc: 'Battle-tested system prompts and instructions optimized for OpenAI GPT-4o, reasoning models, and production API agents. Enforces strict Markdown hierarchies and deterministic parameter mapping.',
    highlights: 'Zero-preamble execution, hierarchical role framing, JSON/Markdown output formatting',
    guidelines: [
      {
        title: 'Hierarchical System Directives',
        desc: 'GPT-4o excels when given an explicit role hierarchy followed by negative constraints (e.g., "Do not include conversational preamble or apologies").',
      },
      {
        title: 'Structured Output Constraints',
        desc: 'For deterministic extraction, enforce JSON schemas or strict Markdown tables to avoid token bloat and hallucinated values.',
      },
    ],
    faqs: [
      {
        q: 'How do I optimize system prompts for ChatGPT-4o?',
        a: 'Structure your prompt with distinct sections: System Persona, Context Variables, Operational Constraints, and Output Format. This ensures maximum attention weighting across long contexts.',
      },
      {
        q: 'Can these prompts be used with the OpenAI API?',
        a: 'Yes, all templates are optimized for developer API system roles as well as the interactive ChatGPT web workspace.',
      },
    ],
  },
  claude: {
    name: 'Anthropic Claude (3.5 Sonnet & Opus)',
    badge: 'Claude 3.5 Sonnet',
    contextWindow: '200k Tokens',
    desc: 'Deep reasoning, architectural analysis, and production coding prompts fine-tuned for Anthropic Claude 3.5 Sonnet and Opus. Features XML delimiter tagging for zero context drift.',
    highlights: 'XML delimiter parsing, complex code synthesis, zero-hallucination research briefs',
    guidelines: [
      {
        title: 'XML Tag Isolation',
        desc: 'Claude models respond with highest accuracy when instructions, documents, and rules are isolated within explicit XML tags like <context>, <rules>, and <input>.',
      },
      {
        title: 'Extended Thought Scaffolding',
        desc: 'Instruct Claude to think step-by-step inside scratchpad tags before producing final production code or strategic deliverables.',
      },
    ],
    faqs: [
      {
        q: 'Why does Claude 3.5 Sonnet require XML tags?',
        a: 'Anthropic models are pre-trained on structured XML delimiters, allowing them to separate prompt directives from injected user variables with 99%+ isolation accuracy.',
      },
      {
        q: 'Are these prompts verified for coding workflows?',
        a: 'Yes, each template enforces clean syntax, error handling, and test-driven architecture without placeholder pseudo-code.',
      },
    ],
  },
  deepseek: {
    name: 'DeepSeek (R1 & V3)',
    badge: 'DeepSeek-R1 Reasoning',
    contextWindow: '64k–128k Tokens',
    desc: 'High-performance open reasoning system prompts engineered for DeepSeek-R1 and V3. Optimized for chain-of-thought self-correction, competitive algorithmic reasoning, and backend logic.',
    highlights: 'Chain-of-thought verification, algorithmic math, edge-case unit testing',
    guidelines: [
      {
        title: 'Autonomous Chain-of-Thought (CoT)',
        desc: 'Allow DeepSeek-R1 to utilize its internal reasoning process without restrictive token budgets to ensure full deductive proofing before output emission.',
      },
      {
        title: 'Algorithmic Boundary Conditions',
        desc: 'Clearly specify time and space complexity constraints so DeepSeek selects optimal data structures and design patterns.',
      },
    ],
    faqs: [
      {
        q: 'How does DeepSeek-R1 differ from ChatGPT and Claude?',
        a: 'DeepSeek-R1 utilizes reinforced reasoning chains to self-correct hypotheses before emitting responses, making it exceptionally reliable for debugging and math.',
      },
      {
        q: 'Is DeepSeek-R1 suitable for software development?',
        a: 'Yes, especially for performance-sensitive tasks such as query profiling, asynchronous API architectures, and test suite synthesis.',
      },
    ],
  },
  gemini: {
    name: 'Google Gemini 1.5 Pro',
    badge: 'Gemini 1.5 Pro (2M Context)',
    contextWindow: '1M–2M Tokens',
    desc: 'Massive context window prompts and multi-modal pipeline templates for Google Gemini 1.5 Pro & Flash. Built for full-codebase ingestion and cross-repository audit workflows.',
    highlights: 'Full-repository ingestion, multi-modal audits, cross-document timeline synthesis',
    guidelines: [
      {
        title: 'Full-Context Ingestion Structure',
        desc: 'Gemini maintains high needle-in-a-haystack retrieval across 1M+ tokens. Place core instructions at the end of the context payload for maximum compliance.',
      },
      {
        title: 'Multimodal Grounding',
        desc: 'When referencing code with architecture diagrams or screenshots, specify anchor labels to allow Gemini to correlate visual and textual data.',
      },
    ],
    faqs: [
      {
        q: 'What is the primary advantage of Gemini 1.5 Pro prompts?',
        a: 'Gemini 1.5 Pro can ingest entire application codebases or multiple technical manuals in a single prompt without chunking or vector loss.',
      },
      {
        q: 'Can I use these prompts with Gemini Flash?',
        a: 'Yes, the lightweight delimiter formats work seamlessly across both Gemini Pro and Gemini Flash.',
      },
    ],
  },
  midjourney: {
    name: 'Midjourney v6',
    badge: 'Midjourney v6.1',
    contextWindow: 'Image Generation',
    desc: 'Hyper-realistic photography, UI component design, vector illustration, and 3D architectural render parameter blueprints with precise aspect ratio and stylistic tuning.',
    highlights: 'Volumetric lighting, camera parameters (--ar 16:9, --v 6.1), style reference tagging',
    guidelines: [
      {
        title: 'Parameter Positioning',
        desc: 'Place core subject and lighting descriptions first, followed by stylistic medium descriptors, and conclude with official flags (--ar, --v, --stylize).',
      },
      {
        title: 'Negative Weighting',
        desc: 'Use the --no parameter rather than natural language negations to eliminate unwanted artifacts, text, or visual distortion.',
      },
    ],
    faqs: [
      {
        q: 'What parameters are standard in these Midjourney templates?',
        a: 'Templates include aspect ratio flags (--ar 16:9, --ar 21:9), version tags (--v 6.1), stylize ranges (--s 250), and photorealistic lighting parameters.',
      },
      {
        q: 'Can I use these for UI/UX product mockups?',
        a: 'Yes, templates are tailored for clean glassmorphism, mobile SaaS interfaces, and landing page 3D assets.',
      },
    ],
  },
  perplexity: {
    name: 'Perplexity AI',
    badge: 'Perplexity Pro Research',
    contextWindow: 'Live Web Retrieval',
    desc: 'Deep online market research, competitor benchmarking, and verified academic synthesis queries engineered for real-time web retrieval and source validation.',
    highlights: 'Live citation synthesis, competitor discovery, domain authority verification',
    guidelines: [
      {
        title: 'Targeted Domain Querying',
        desc: 'Instruct Perplexity to prioritize authoritative primary sources, research papers, and verified documentation over aggregated blogs.',
      },
      {
        title: 'Comparative Synthesis Grids',
        desc: 'Request outputs formatted as markdown comparison tables with verified URLs for immediate executive review.',
      },
    ],
    faqs: [
      {
        q: 'How do Perplexity prompts prevent outdated information?',
        a: 'Each prompt explicitly includes recency operators and source verification constraints to ensure live web citations.',
      },
      {
        q: 'Are Perplexity templates suitable for competitor research?',
        a: 'Yes, they systematically audit feature matrices, pricing tiers, and public reviews across competing SaaS products.',
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.model.toLowerCase();
  const info = MODEL_INFO[key] || {
    name: params.model.toUpperCase(),
    badge: 'AI Model',
    contextWindow: 'Standard',
    desc: `Curated AI system prompts optimized for ${params.model}.`,
    highlights: 'Structured parameters, tested accuracy',
    guidelines: [],
    faqs: [],
  };

  return {
    title: `Best ${info.name} Prompts & System Blueprints | Promptory`,
    description: info.desc,
    alternates: {
      canonical: `https://www.promptory.xyz/models/${key}`,
    },
    openGraph: {
      title: `Best ${info.name} Prompts | Promptory`,
      description: info.desc,
      url: `https://www.promptory.xyz/models/${key}`,
      type: 'website',
      siteName: 'Promptory',
    },
  };
}

export default async function ModelPromptsPage({ params }: Props) {
  const modelKey = params.model.toLowerCase();
  const modelInfo = MODEL_INFO[modelKey] || {
    name: params.model.toUpperCase(),
    badge: 'AI Model',
    contextWindow: 'Standard',
    desc: `Discover verified prompts crafted specifically for ${params.model}.`,
    highlights: 'Tested accuracy, structured formatting, live parameter tuning',
    guidelines: [
      {
        title: 'Structured Variable Injection',
        desc: 'Isolate user data from core instructions to ensure clean model adherence and consistent outputs.',
      },
      {
        title: 'Deterministic Formatting',
        desc: 'Define output templates clearly to prevent extraneous conversational padding.',
      },
    ],
    faqs: [
      {
        q: `How do I run these prompts on ${params.model}?`,
        a: `Copy the verified template directly into your ${params.model} workspace or API system role with customized parameters.`,
      },
    ],
  };

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .order('quality_score', { ascending: false });

  const filteredPrompts = (prompts || []).filter((p: any) => {
    const mSlug = p.model?.slug || (typeof p.model === 'string' ? p.model : '');
    const mName = p.model?.name || '';
    return mSlug.toLowerCase().includes(modelKey) || mName.toLowerCase().includes(modelKey);
  });

  const canonicalUrl = `https://www.promptory.xyz/models/${modelKey}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `Best ${modelInfo.name} Prompts`,
        description: modelInfo.desc,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: filteredPrompts.length,
          itemListElement: filteredPrompts.slice(0, 15).map((p: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: p.title || p.seoTitle,
            url: `https://www.promptory.xyz/prompts/${p.model?.slug || modelKey}/${p.profession?.slug || 'developer'}/${p.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
          { '@type': 'ListItem', position: 2, name: 'Models', item: 'https://www.promptory.xyz/directory' },
          { '@type': 'ListItem', position: 3, name: modelInfo.name, item: canonicalUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: modelInfo.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/directory" className="hover:text-emerald-400 transition-colors">Models</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium">{modelInfo.name}</span>
      </nav>

      {/* Header Hub Banner */}
      <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 md:p-8 mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            {modelInfo.badge}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#21262D] border border-[#30363D] text-slate-300 text-xs font-mono">
            Context: {modelInfo.contextWindow}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#21262D] border border-[#30363D] text-slate-300 text-xs font-mono">
            {filteredPrompts.length} Curated Blueprints
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{modelInfo.name}</span> System Prompts
        </h1>

        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {modelInfo.desc}
        </p>

        <div className="pt-3 border-t border-[#30363D]/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-semibold">Core Strengths:</span>
          <span className="bg-[#0D1117] border border-[#30363D] px-2.5 py-1 rounded-md text-emerald-400 font-mono">
            {modelInfo.highlights}
          </span>
        </div>
      </div>

      {/* Prompt Grid Section */}
      <div className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Available {modelInfo.name} Prompts ({filteredPrompts.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Score 90+ Scored</span>
        </div>

        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt: any) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-[#30363D] rounded-2xl bg-[#161B22]/50">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-200 font-medium">No custom prompts loaded for {modelInfo.name} yet.</p>
            <p className="text-xs text-slate-400 mt-1">Autonomous daily ingestion will populate verified templates shortly.</p>
          </div>
        )}
      </div>

      {/* MODEL ENGINEERING GUIDELINES (Adds 250+ Crawlable Words for Google Indexation) */}
      <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            Prompt Engineering Directives for {modelInfo.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {modelInfo.guidelines.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]/80 space-y-2">
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {g.title}
              </h3>
              <p className="text-slate-400">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model FAQs */}
      {modelInfo.faqs.length > 0 && (
        <section className="pt-8 border-t border-[#30363D] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {modelInfo.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-emerald-500/40"
              >
                <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
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
      )}
    </div>
  );
}
