'use client';
import { useState, useMemo } from 'react';
import { extractVariables, replaceVariables } from '@/lib/variableParser';
import CopyButton from './CopyButton';
import { Sparkles, RotateCcw, Bookmark, Download, Wand2, Sliders, ExternalLink } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface Props {
  promptId: string;
  promptTitle: string;
  template: string;
  exampleInput?: string;
}

export default function PromptCustomizer({ promptId, promptTitle, template, exampleInput }: Props) {
  const variables = useMemo(() => extractVariables(template), [template]);
  const [values, setValues] = useState<Record<string, string>>({});
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleInputChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handlePrefill = () => {
    if (!exampleInput) return;
    const lines = exampleInput.split('\n');
    const newValues: Record<string, string> = {};

    variables.forEach((v) => {
      const match = lines.find((l) =>
        l.toLowerCase().includes(v.label.toLowerCase()) ||
        l.toLowerCase().includes(v.key.toLowerCase().replace(/_/g, ' '))
      );
      if (match) {
        const val = match.split(':')[1]?.trim() || match.trim();
        newValues[v.key] = val;
      } else if (v.type === 'select' && v.options?.length) {
        newValues[v.key] = v.options[0];
      }
    });

    setValues(newValues);
  };

  const handleReset = () => setValues({});

  const generatedPrompt = useMemo(() => {
    return replaceVariables(template, values);
  }, [template, values]);

  const applyTone = (tone: string) => {
    const toneVar = variables.find((v) => v.key.includes('/') || /tone/i.test(v.key));
    if (toneVar) {
      handleInputChange(toneVar.key, tone);
    }
  };

  const handleExport = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${promptTitle.toLowerCase().replace(/\s+/g, '-')}-prompt.txt`;
    link.click();
  };

  // Direct AI Deep Launchers
  const openInChatGPT = () => {
    navigator.clipboard.writeText(generatedPrompt);
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(generatedPrompt)}`, '_blank');
  };

  const openInClaude = () => {
    navigator.clipboard.writeText(generatedPrompt);
    window.open('https://claude.ai/new', '_blank');
  };

  const openInPerplexity = () => {
    navigator.clipboard.writeText(generatedPrompt);
    window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(generatedPrompt)}`, '_blank');
  };

  const charCount = generatedPrompt.length;
  const wordCount = generatedPrompt.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-zinc-200">Interactive Prompt Builder</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {exampleInput && (
            <button
              onClick={handlePrefill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" /> Fill Sample Data
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Reset variables"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(promptId)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              isFavorite(promptId)
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite(promptId) ? 'fill-current' : ''}`} />
            {isFavorite(promptId) ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: DYNAMIC FORM */}
        <div className="lg:col-span-5 space-y-4 bg-[#0F141C] p-5 rounded-xl border border-zinc-800/90">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Customize Variables ({variables.length})
          </h3>

          {variables.length === 0 ? (
            <p className="text-xs text-zinc-500">No customizable variables in this prompt.</p>
          ) : (
            variables.map((v) => (
              <div key={v.key} className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span>{v.label}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">[{v.key}]</span>
                </label>

                {v.type === 'select' ? (
                  <select
                    value={values[v.key] || v.defaultValue || ''}
                    onChange={(e) => handleInputChange(v.key, e.target.value)}
                    className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {v.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : v.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder={`Enter ${v.label}...`}
                    value={values[v.key] || ''}
                    onChange={(e) => handleInputChange(v.key, e.target.value)}
                    className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={`e.g. ${v.label}`}
                    value={values[v.key] || ''}
                    onChange={(e) => handleInputChange(v.key, e.target.value)}
                    className="w-full bg-[#080B10] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>
            ))
          )}

          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-[11px] text-zinc-500 block mb-2 font-medium">Quick Tone Shift:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['PROFESSIONAL', 'FRIENDLY', 'URGENT', 'CASUAL'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => applyTone(tone)}
                  className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE OUTPUT & DEEP LAUNCHERS */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#0F141C] rounded-xl border border-zinc-800 overflow-hidden shadow-xl">
          <div>
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-300">Live Generated Output</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                  title="Export .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <CopyButton text={generatedPrompt} />
              </div>
            </div>

            <pre className="p-5 text-xs sm:text-sm text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-emerald-500/30 min-h-[200px]">
              {generatedPrompt}
            </pre>
          </div>

          <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/60 space-y-3">
            {/* DIRECT AI TRIGGER BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-zinc-500 font-mono">Open in:</span>
              <button
                onClick={openInChatGPT}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-300 text-xs font-medium transition-all"
              >
                ChatGPT <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={openInClaude}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-orange-500/20 hover:text-orange-400 text-zinc-300 text-xs font-medium transition-all"
              >
                Claude <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={openInPerplexity}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-zinc-300 text-xs font-medium transition-all"
              >
                Perplexity <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/40">
              <span>{charCount} characters</span>
              <span>~{wordCount} words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
