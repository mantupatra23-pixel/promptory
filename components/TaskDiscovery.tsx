import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Layers } from 'lucide-react';

export default async function TaskDiscovery() {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, name, slug, description')
    .limit(8);

  const { data: prompts } = await supabase
    .from('prompts')
    .select('task_id')
    .eq('status', 'published');

  const countMap = new Map<string, number>();
  (prompts || []).forEach((p) => {
    if (p.task_id) countMap.set(p.task_id, (countMap.get(p.task_id) || 0) + 1);
  });

  const visibleTasks = (tasks || []).filter((t) => (countMap.get(t.id) || 0) >= 3);

  if (visibleTasks.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[#30363D]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Task-Driven Prompt Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Explore Prompts by Task
          </h2>
        </div>
        <Link href="/tasks" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          View All Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleTasks.map((t) => (
          <Link
            key={t.id}
            href={`/tasks/${t.slug}`}
            className="group p-5 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-emerald-500/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="text-emerald-400 font-mono text-[11px] mb-2 font-semibold">
                {countMap.get(t.id) || 0} PROMPTS
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                {t.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {t.description}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-400 group-hover:text-emerald-400">
              Browse Workflows →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
