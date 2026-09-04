const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with', 'the', 'this', 'prompt', 'best'
]);

export function tokenizeText(text: string): Set<string> {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

export function computeJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersection++;
  });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface DuplicateAuditResult {
  id: string;
  slug: string;
  title: string;
  duplicateStatus: 'unique' | 'possible_duplicate' | 'duplicate';
  similarityScore: number;
  matchedWith?: {
    id: string;
    slug: string;
    title: string;
  };
  reason?: string;
}

export function analyzeDuplicateCorpus(prompts: Array<{ id: string; slug: string; title: string; body: string }>): DuplicateAuditResult[] {
  const tokenized = prompts.map((p) => ({
    ...p,
    titleTokens: tokenizeText(p.title),
    bodyTokens: tokenizeText(p.body.slice(0, 1500)),
  }));

  const results: DuplicateAuditResult[] = [];

  for (let i = 0; i < tokenized.length; i++) {
    const current = tokenized[i];
    let maxSim = 0;
    let matchTarget: typeof current | null = null;
    let matchReason = '';

    for (let j = 0; j < tokenized.length; j++) {
      if (i === j) continue;
      const compare = tokenized[j];

      // Exact title match check
      if (current.title.toLowerCase().trim() === compare.title.toLowerCase().trim()) {
        maxSim = 1.0;
        matchTarget = compare;
        matchReason = 'Exact title collision';
        break;
      }

      const titleSim = computeJaccardSimilarity(current.titleTokens, compare.titleTokens);
      const bodySim = computeJaccardSimilarity(current.bodyTokens, compare.bodyTokens);

      if (titleSim >= 0.85 && titleSim > maxSim) {
        maxSim = titleSim;
        matchTarget = compare;
        matchReason = `Title similarity of ${(titleSim * 100).toFixed(1)}%`;
      } else if (bodySim >= 0.85 && bodySim > maxSim) {
        maxSim = bodySim;
        matchTarget = compare;
        matchReason = `Body similarity of ${(bodySim * 100).toFixed(1)}%`;
      }
    }

    if (maxSim >= 0.95) {
      results.push({
        id: current.id,
        slug: current.slug,
        title: current.title,
        duplicateStatus: 'duplicate',
        similarityScore: Number((maxSim * 100).toFixed(1)),
        matchedWith: matchTarget ? { id: matchTarget.id, slug: matchTarget.slug, title: matchTarget.title } : undefined,
        reason: matchReason,
      });
    } else if (maxSim >= 0.85) {
      results.push({
        id: current.id,
        slug: current.slug,
        title: current.title,
        duplicateStatus: 'possible_duplicate',
        similarityScore: Number((maxSim * 100).toFixed(1)),
        matchedWith: matchTarget ? { id: matchTarget.id, slug: matchTarget.slug, title: matchTarget.title } : undefined,
        reason: matchReason,
      });
    } else {
      results.push({
        id: current.id,
        slug: current.slug,
        title: current.title,
        duplicateStatus: 'unique',
        similarityScore: 0,
      });
    }
  }

  return results;
}
