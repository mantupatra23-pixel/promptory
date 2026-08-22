export interface PromptItem {
  id: string | number;
  title: string;
  slug?: string;
  description: string;
  content?: string;
  prompt?: string;
  model?: { name?: string; slug?: string } | string;
  profession?: { name?: string; slug?: string } | string;
  role?: string;
  category?: string;
  tags?: string[];
  quality_score?: number;
  created_at?: string;
  saves_count?: number;
  copies_count?: number;
}

export function searchAndRankPrompts(prompts: PromptItem[], query: string): PromptItem[] {
  if (!query || !query.trim()) return prompts;

  const rawQuery = query.toLowerCase().trim();
  const searchTerms = rawQuery
    .split(/\s+/)
    .filter(term => !['i', 'need', 'a', 'prompt', 'for', 'to', 'the', 'in', 'and', 'with', 'an'].includes(term));

  if (searchTerms.length === 0) return prompts;

  const scored = prompts.map(item => {
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const body = (item.content || item.prompt || '').toLowerCase();
    const model = typeof item.model === 'object' ? (item.model?.name || '') : (item.model || '');
    const role = typeof item.profession === 'object' ? (item.profession?.name || '') : (item.role || item.profession || '');
    const category = (item.category || '').toLowerCase();
    const tags = (item.tags || []).map(t => t.toLowerCase()).join(' ');

    let score = 0;

    // Direct exact query matches (Massive Boost)
    if (title.includes(rawQuery)) score += 50;
    if (desc.includes(rawQuery)) score += 25;

    // Term-by-term scoring
    for (const term of searchTerms) {
      if (title.includes(term)) score += 40;
      if (desc.includes(term)) score += 20;
      if (tags.includes(term) || category.includes(term)) score += 15;
      if (body.includes(term)) score += 10;
      if (model.toLowerCase().includes(term)) score += 5;
      if (role.toLowerCase().includes(term)) score += 5;
    }

    return { item, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
