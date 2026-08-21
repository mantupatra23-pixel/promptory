'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubmitPromptPage() {
  const [models, setModels] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    title: '',
    model_id: '',
    profession_id: '',
    task_id: '',
    description: '',
    prompt_template: '',
    example_input: '',
    example_output: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadMeta() {
      const [m, p, t] = await Promise.all([
        supabase.from('models').select('id, name'),
        supabase.from('professions').select('id, name'),
        supabase.from('tasks').select('id, name'),
      ]);
      if (m.data) {
        setModels(m.data);
        if (m.data[0]) setForm(f => ({ ...f, model_id: m.data[0].id }));
      }
      if (p.data) {
        setProfessions(p.data);
        if (p.data[0]) setForm(f => ({ ...f, profession_id: p.data[0].id }));
      }
      if (t.data) {
        setTasks(t.data);
        if (t.data[0]) setForm(f => ({ ...f, task_id: t.data[0].id }));
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { error } = await supabase.from('prompts').insert({
      title: form.title,
      slug: slug || `prompt-${Date.now()}`,
      model_id: form.model_id,
      profession_id: form.profession_id,
      task_id: form.task_id,
      description: form.description,
      prompt_template: form.prompt_template,
      example_input: form.example_input,
      example_output: form.example_output,
      quality_score: 92,
      status: 'draft',
      is_featured: false,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Prompt Submitted Successfully!</h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          Your prompt has been queued for verification. Once approved by our team, it will appear in the global directory and sitemap.
        </p>
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-xs transition-transform hover:scale-105"
        >
          Back to Prompts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-100 mb-2">Submit a Tested Prompt</h1>
        <p className="text-sm text-zinc-400">
          Share your high-performing system prompts with dynamic variables like <code className="text-emerald-400 font-mono">[TARGET_VARIABLE]</code>.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#0F141C] p-6 sm:p-8 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">Prompt Title *</label>
          <input
            required
            type="text"
            placeholder="e.g. Next.js 14 Server Action Security Auditor"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">AI Model</label>
            <select
              value={form.model_id}
              onChange={(e) => setForm({ ...form, model_id: e.target.value })}
              className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Target Profession</label>
            <select
              value={form.profession_id}
              onChange={(e) => setForm({ ...form, profession_id: e.target.value })}
              className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              {professions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Task Category</label>
            <select
              value={form.task_id}
              onChange={(e) => setForm({ ...form, task_id: e.target.value })}
              className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">Description *</label>
          <input
            required
            type="text"
            placeholder="1-2 sentences explaining what this prompt accomplishes..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Prompt Template * <span className="text-zinc-500 font-normal">(use [UPPERCASE_VARS] for inputs)</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="You are an expert in [DOMAIN]. Analyze the following [CODE_SNIPPET] with tone [PROFESSIONAL/CASUAL]..."
            value={form.prompt_template}
            onChange={(e) => setForm({ ...form, prompt_template: e.target.value })}
            className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-4 py-3 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">Sample Input / Context (Optional)</label>
          <textarea
            rows={2}
            placeholder="e.g. DOMAIN: Web Security, CODE_SNIPPET: app/api/auth/route.ts"
            value={form.example_input}
            onChange={(e) => setForm({ ...form, example_input: e.target.value })}
            className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-4 py-2.5 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
}
