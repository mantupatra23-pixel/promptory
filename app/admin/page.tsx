'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Check, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

export default function AdminModerationPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        model:models(name),
        profession:professions(name),
        task:tasks(name)
      `)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDrafts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'published' })
      .eq('id', id);

    if (!error) {
      setDrafts((prev) => prev.filter((item) => item.id !== id));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    setActionLoading(id);
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (!error) {
      setDrafts((prev) => prev.filter((item) => item.id !== id));
    }
    setActionLoading(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderation Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100">Draft Submissions Queue</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review community submitted prompts and publish them live to the directory.
          </p>
        </div>

        <button
          onClick={fetchDrafts}
          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
          title="Refresh Queue"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 font-mono">Loading pending submissions...</div>
      ) : drafts.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0F141C] border border-zinc-800">
          <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-200">Moderation Queue Clear</h3>
          <p className="text-xs text-zinc-500 mt-1">All submitted prompts have been reviewed and published.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-5 rounded-xl bg-[#0F141C] border border-zinc-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prompt.model?.name || 'AI'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
                      {prompt.profession?.name || 'General'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">slug: {prompt.slug}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100">{prompt.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    disabled={actionLoading === prompt.id}
                    onClick={() => handleApprove(prompt.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Publish Live
                  </button>
                  <button
                    disabled={actionLoading === prompt.id}
                    onClick={() => handleDelete(prompt.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
                    title="Reject & Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400">{prompt.description}</p>

              <div className="p-3.5 rounded-lg bg-[#080B10] border border-zinc-850 font-mono text-xs text-zinc-300 whitespace-pre-wrap">
                {prompt.prompt_template}
              </div>

              {prompt.example_input && (
                <div className="text-xs text-zinc-500 font-mono">
                  <strong className="text-zinc-400 font-sans">Sample Input:</strong> {prompt.example_input}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
