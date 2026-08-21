import Link from 'next/link';
import { PromptItem } from '@/types';
import CopyButton from './CopyButton';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function PromptCard({ prompt }: { prompt: PromptItem }) {
  const promptUrl = `/prompts/${prompt.model.slug}/${prompt.profession.slug}/${prompt.task.slug}`;

  return (
    <div className="bg-[#0F141C] border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {prompt.model.name}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300">
              {prompt.profession.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{prompt.qualityScore}/100</span>
          </div>
        </div>

        <Link href={promptUrl}>
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2 line-clamp-1">
            {prompt.title}
          </h3>
        </Link>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {prompt.description}
        </p>
      </div>

      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <CopyButton text={prompt.promptTemplate} />
        <Link 
          href={promptUrl}
          className="text-xs text-zinc-400 hover:text-zinc-100 flex items-center gap-1 transition-colors"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
