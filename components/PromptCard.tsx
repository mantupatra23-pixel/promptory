import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import CopyButton from './CopyButton';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    slug: string;
    model?: { name: string; slug: string };
    profession?: { name: string; slug: string };
    task?: { name: string; slug: string };
    description: string;
    promptTemplate: string;
    exampleInput?: string;
    exampleOutput?: string;
    qualityScore: number;
    status: string;
  };
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const modelSlug = prompt.model?.slug || 'chatgpt';
  const profSlug = prompt.profession?.slug || 'developer';
  const detailUrl = `/prompts/${modelSlug}/${profSlug}/${prompt.slug}`;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-[#0F141C] p-5 hover:border-emerald-500/40 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              {prompt.model?.name || 'AI'}
            </span>
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-400">
              {prompt.profession?.name || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{prompt.qualityScore}/100</span>
          </div>
        </div>

        <h3 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors text-sm line-clamp-1 mb-1.5">
          {prompt.title}
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {prompt.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
        <CopyButton text={prompt.promptTemplate} promptId={prompt.id} />

        <Link
          href={detailUrl}
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-medium"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
