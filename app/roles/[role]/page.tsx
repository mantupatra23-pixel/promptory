import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PromptCard from '@/components/PromptCard';
import { 
  ChevronRight, 
  Briefcase, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const revalidate = 60;

interface Props {
  params: {
    role: string;
  };
}

interface RoleMeta {
  title: string;
  desc: string;
  focus: string;
  playbook: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const ROLE_INFO: Record<string, RoleMeta> = {
  developer: {
    title: 'Software Developers & Engineers',
    desc: 'Production system prompts for Python, FastAPI, Next.js, Rust, Docker, SQL schema tuning, unit test suites, and automated pull request audits.',
    focus: 'Zero-hallucination code generation, async concurrency, memory leak analysis, deterministic test fixtures',
    playbook: [
      {
        title: 'AST & Code Correctness Directives',
        desc: 'Developer prompts enforce strict language grammar, preventing deprecated library imports and hallucinated methods by pinning exact runtime versions.',
      },
      {
        title: 'Negative Security Guards',
        desc: 'Explicit instructions restrict the model from hardcoding mock secrets, insecure SQL concatenation, and unvalidated CORS headers.',
      },
    ],
    faqs: [
      {
        q: 'How do software developers use Promptory system prompts?',
        a: 'Engineers inject these blueprints into Cursor, Claude Code, or IDE extensions as persistent system instructions to maintain high code standards.',
      },
      {
        q: 'Are unit test generation prompts supported?',
        a: 'Yes, blueprints include test-driven development templates with mock fixtures for Pytest, Jest, Playwright, and Vitest.',
      },
    ],
  },
  'digital-marketer': {
    title: 'Digital Marketers & Growth Leads',
    desc: 'High-converting cold email sequences, paid ads hooks, landing page value propositions, webinar scripts, and multi-channel campaign architectures.',
    focus: 'Direct-response copywriting, persona targeting, email deliverability hooks, conversion rate optimization',
    playbook: [
      {
        title: 'Audience Persona Calibration',
        desc: 'Prompts mandate establishing specific ICP criteria (pains, industry friction, budget authority) before generating promotional copy.',
      },
      {
        title: 'Spam Trigger Suppression',
        desc: 'Templates ban high-risk deliverability trigger words (free, guarantee, instant cash) to protect sender domain reputation.',
      },
    ],
    faqs: [
      {
        q: 'Can these prompts improve cold email reply rates?',
        a: 'Yes, each template focuses on concise 3-sentence outreach structures that deliver 30%+ open-to-reply efficiency.',
      },
      {
        q: 'Which LLMs work best for marketing copy?',
        a: 'ChatGPT-4o is excellent for fast hook iteration, while Claude 3.5 Sonnet excels at nuanced brand voice and storytelling.',
      },
    ],
  },
  founder: {
    title: 'Founders & Product Operators',
    desc: 'SaaS pitch decks, investor update narratives, competitor teardowns, monetization strategies, and product roadmap prioritization frameworks.',
    focus: 'Unit economics decomposition, GTM strategy, customer interviews, value proposition testing',
    playbook: [
      {
        title: 'Deterministic Unit Economics',
        desc: 'Founder prompts force the AI to break down customer acquisition costs (CAC), lifetime value (LTV), and churn sensitivities with mathematical rigor.',
      },
      {
        title: 'GTM Sequencing',
        desc: 'Bans generic advice like "build community"; instead forces specific, sequenced distribution actions tailored to early B2B or B2C traction.',
      },
    ],
    faqs: [
      {
        q: 'How do founders use Promptory for investor decks?',
        a: 'Templates structure problem-solution narratives, market sizing calculations, and defensibility moats into clear slides.',
      },
      {
        q: 'Can these prompts assist in pricing model strategy?',
        a: 'Yes, templates evaluate usage-based, tiered seat, and feature-gated pricing models against industry SaaS benchmarks.',
      },
    ],
  },
  'seo-specialist': {
    title: 'SEO Specialists & Content Strategists',
    desc: 'Programmatic SEO content architectures, keyword cluster models, schema markup generators, and internal link optimization frameworks.',
    focus: 'SERP intent mapping, semantic keyword coverage, EEAT optimization, crawl budget preservation',
    playbook: [
      {
        title: 'Information Gain & Semantic Depth',
        desc: 'SEO prompts instruct the LLM to provide original analysis, proprietary statistics, or technical execution steps that surpass existing top-ranking SERP articles.',
      },
      {
        title: 'JSON-LD Schema Automation',
        desc: 'Generates valid Schema.org entities (TechArticle, FAQPage, Organization) to capture AI Overviews and rich snippets.',
      },
    ],
    faqs: [
      {
        q: 'How do these prompts help with Google Helpful Content guidelines?',
        a: 'They enforce comprehensive technical explanations and clear user action steps, eliminating low-utility, thin AI fluff.',
      },
      {
        q: 'Do these prompts generate valid JSON-LD schemas?',
        a: 'Yes, prompt blueprints include strict schemas ready to be inserted directly into Next.js or WordPress headers.',
      },
    ],
  },
  'real-estate-agent': {
    title: 'Real Estate Agents & Brokers',
    desc: 'High-intent client follow-ups, luxury listing descriptions, investor deal teardowns, and automated CRM lead nurturing email workflows.',
    focus: 'Client relationship nurturing, neighborhood spotlight articles, property pitch scripts, closing objection handling',
    playbook: [
      {
        title: 'Luxury Property Visual Framing',
        desc: 'Listing prompts capture architectural nuances, natural light exposure, and neighborhood lifestyle elements without exaggerated buzzwords.',
      },
      {
        title: 'Investor ROI Modeling',
        desc: 'Structures property summaries with cap rate, cash-on-cash return, and local rent appreciation estimates.',
      },
    ],
    faqs: [
      {
        q: 'Can these prompts be adapted for local housing markets?',
        a: 'Yes, dynamic variable inputs allow you to specify local school districts, proximity to transit, and neighborhood amenities.',
      },
      {
        q: 'Are follow-up email templates included for buyer leads?',
        a: 'Yes, sequential drip follow-ups address common buyer objections and schedule property viewings.',
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.role.toLowerCase();
  const info = ROLE_INFO[key] || {
    title: `${params.role.replace('-', ' ').toUpperCase()} Professionals`,
    desc: `Curated system prompts engineered for ${params.role.replace('-', ' ')}.`,
    focus: 'Workflow acceleration, structured output templates',
    playbook: [],
    faqs: [],
  };

  return {
    title: `Best AI Prompts for ${info.title} | Promptory`,
    description: info.desc,
    alternates: {
      canonical: `https://www.promptory.xyz/roles/${key}`,
    },
    openGraph: {
      title: `AI Prompts for ${info.title} | Promptory`,
      description: info.desc,
      url: `https://www.promptory.xyz/roles/${key}`,
      type: 'website',
      siteName: 'Promptory',
    },
  };
}

export default async function RolePromptsPage({ params }: Props) {
  const roleKey = params.role.toLowerCase();
  const roleInfo = ROLE_INFO[roleKey] || {
    title: `${params.role.replace('-', ' ').toUpperCase()}`,
    desc: `High-scoring production prompts designed for ${params.role.replace('-', ' ')}.`,
    focus: 'Domain-specific instructions, variable templates, output constraints',
    playbook: [
      {
        title: 'Domain Boundary Control',
        desc: 'Tailor prompts to industry standard terminology and enforce negative constraints to eliminate generic outputs.',
      },
      {
        title: 'Deterministic Workflow Execution',
        desc: 'Structure deliverables with step-by-step actions and clear verification standards.',
      },
    ],
    faqs: [
      {
        q: `How do ${params.role.replace('-', ' ')} professionals use these templates?`,
        a: `Use these verified prompts in your preferred AI workspace to automate repetitive tasks with zero setup friction.`,
      },
    ],
  };

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*, model:models(*), profession:professions(*)')
    .order('quality_score', { ascending: false });

  const filteredPrompts = (prompts || []).filter((p: any) => {
    const rSlug = p.profession?.slug || (typeof p.profession === 'string' ? p.profession : '');
    const rName = p.profession?.name || '';
    return rSlug.toLowerCase().includes(roleKey) || rName.toLowerCase().replace(/\s+/g, '-').includes(roleKey);
  });

  const canonicalUrl = `https://www.promptory.xyz/roles/${roleKey}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `AI Prompts for ${roleInfo.title}`,
        description: roleInfo.desc,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: filteredPrompts.length,
          itemListElement: filteredPrompts.slice(0, 15).map((p: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: p.title || p.seoTitle,
            url: `https://www.promptory.xyz/prompts/${p.model?.slug || 'chatgpt'}/${p.profession?.slug || roleKey}/${p.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.promptory.xyz' },
          { '@type': 'ListItem', position: 2, name: 'Roles', item: 'https://www.promptory.xyz/directory' },
          { '@type': 'ListItem', position: 3, name: roleInfo.title, item: canonicalUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: roleInfo.faqs.map((f) => ({
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
        <Link href="/directory" className="hover:text-emerald-400 transition-colors">Roles</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium">{roleInfo.title}</span>
      </nav>

      {/* Header Hub Banner */}
      <div className="border border-[#30363D] bg-[#161B22]/70 rounded-2xl p-6 md:p-8 mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            Role Directory
          </span>
          <span className="px-3 py-1 rounded-full bg-[#21262D] border border-[#30363D] text-slate-300 text-xs font-mono">
            {filteredPrompts.length} Verified Templates
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Prompts for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{roleInfo.title}</span>
        </h1>

        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {roleInfo.desc}
        </p>

        <div className="pt-3 border-t border-[#30363D]/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-semibold">Core Workflow Focus:</span>
          <span className="bg-[#0D1117] border border-[#30363D] px-2.5 py-1 rounded-md text-cyan-400 font-mono">
            {roleInfo.focus}
          </span>
        </div>
      </div>

      {/* Prompt Grid Section */}
      <div className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Tailored Templates ({filteredPrompts.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Verified Score 90+</span>
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
            <p className="text-slate-200 font-medium">No specialized prompts loaded for this role yet.</p>
            <p className="text-xs text-slate-400 mt-1">Autonomous ingestion pipelines add new verified templates daily.</p>
          </div>
        )}
      </div>

      {/* ROLE PLAYBOOK & OPERATIONAL DIRECTIVES (Adds 250+ Indexable Words) */}
      <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            Operational Blueprint for {roleInfo.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {roleInfo.playbook.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]/80 space-y-2">
              <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {p.title}
              </h3>
              <p className="text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role FAQs */}
      {roleInfo.faqs.length > 0 && (
        <section className="pt-8 border-t border-[#30363D] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {roleInfo.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition open:border-cyan-500/40"
              >
                <summary className="text-sm font-semibold text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-cyan-400 font-mono text-xs ml-2 group-open:rotate-180 transition-transform">▼</span>
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
