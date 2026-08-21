import { notFound } from 'next/navigation';
import { samplePrompts } from '@/lib/data';
import CopyButton from '@/components/CopyButton';
import { ShieldCheck, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PromptDetailPage({
  params
}: {
  params: { model: string; profession: string; task: string }
}) {
  const prompt = samplePrompts.find(
    (p) =>
      p.model.slug === params.model &&
      p.profession.slug === params.profession &&
      p.task.slug === params.task
  );

  if (!prompt) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/prompts" className="hover:text-zinc-300">Prompts</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400">{prompt.model.name}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-emerald-400">{prompt.title}</span>
      </nav>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {prompt.model.name}
          </span>
          <span className="px-2.5 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300">
            {prompt.profession.name}
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Quality Score: {prompt.qualityScore}/100</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">{prompt.title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">{prompt.description}</p>
      </div>

      {/* PRIMARY PROMPT BOX */}
      <div className="mb-10 bg-[#0F141C] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Prompt Template</span>
          <CopyButton text={prompt.promptTemplate} />
        </div>
        <pre className="p-5 text-sm text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
          {prompt.promptTemplate}
        </pre>
      </div>

      {/* EXAMPLE OUTPUT */}
      {prompt.exampleOutput && (
        <div className="mb-10 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Info className="w-4 h-4 text-emerald-400" /> Illustrative Output Demo
          </div>
          <div className="p-4 rounded-lg bg-[#0A0D12] text-xs sm:text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
            {prompt.exampleOutput}
          </div>
        </div>
      )}

      {/* USE CASES & PITFALLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {prompt.useCases && (
          <div className="p-5 rounded-xl bg-[#0F141C] border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Best Use Cases</h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
              {prompt.useCases.map((uc, idx) => (
                <li key={idx}>{uc}</li>
              ))}
            </ul>
          </div>
        )}

        {prompt.commonMistakes && (
          <div className="p-5 rounded-xl bg-[#0F141C] border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Common Mistakes
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
              {prompt.commonMistakes.map((cm, idx) => (
                <li key={idx}>{cm}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
