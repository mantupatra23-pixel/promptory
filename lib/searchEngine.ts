export interface SearchablePrompt {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  prompt_template?: string;
  prompt?: string;
  content?: string;
  model?: any;
  profession?: any;
  role?: any;
  tags?: string[];
  keywords?: string[];
  quality_score?: number;
  [key: string]: any;
}

export interface SearchResult<T = SearchablePrompt> {
  item: T;
  score: number;
  matchedTokens: string[];
}

export interface SearchOptions {
  modelFilter?: string;
  roleFilter?: string;
  sortBy?: 'relevance' | 'quality' | 'newest';
}

// Low-value conversational stop words (Preserves technical terms)
const STOP_WORDS = new Set([
  'i', 'need', 'a', 'an', 'the', 'to', 'for', 'my', 'me', 'please', 'can', 'you',
  'help', 'with', 'want', 'give', 'find', 'looking', 'is', 'are', 'of', 'and', 'or',
  'in', 'on', 'at', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over',
  'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among'
]);

// Synonyms and technical aliases
const SYNONYMS: Record<string, string[]> = {
  'fastapi': ['fast api', 'python api', 'backend'],
  'fast api': ['fastapi'],
  'seo': ['search engine optimization', 'blog outline', 'content'],
  'email': ['cold email', 'outreach', 'hook', 'copy'],
  'code review': ['audit', 'debugger', 'refactor', 'code optimizer'],
  'audit': ['code review', 'review'],
  'postgres': ['postgresql', 'database', 'sql'],
  'ai': ['artificial intelligence', 'llm'],
  'saas': ['b2b', 'software'],
};

// Levenshtein distance for lightweight typo tolerance
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalizer
export function normalizeQuery(query: string): string[] {
  if (!query) return [];

  // Remove punctuation, lower case, collapse spaces
  const cleaned = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into raw tokens
  const rawTokens = cleaned.split(' ').filter(Boolean);

  // Filter out stop words while keeping technical terms
  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t) || t.length > 3);

  // If all tokens were filtered (e.g. "how to"), fallback to raw tokens
  return meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;
}

// Deterministic Search & Ranking Algorithm
export function searchPrompts<T extends SearchablePrompt>(
  prompts: T[],
  rawQuery: string,
  options: SearchOptions = {}
): { results: T[]; correctedQuery?: string; tokens: string[] } {
  const { modelFilter = 'all', roleFilter = 'all', sortBy = 'relevance' } = options;

  // 1. Filter by Model & Role first
  const filtered = prompts.filter((p) => {
    if (modelFilter !== 'all') {
      const pModel = (p.model?.slug || p.model || '').toLowerCase();
      if (pModel !== modelFilter.toLowerCase()) return false;
    }
    if (roleFilter !== 'all') {
      const pRole = (p.profession?.slug || p.role || p.profession || '')
        .toLowerCase()
        .replace(/\s+/g, '-');
      if (pRole !== roleFilter.toLowerCase()) return false;
    }
    return true;
  });

  const queryTokens = normalizeQuery(rawQuery);
  const cleanFullQuery = rawQuery.toLowerCase().trim();

  // Empty query fallback: return filtered list sorted by quality score or newest
  if (!rawQuery.trim() || queryTokens.length === 0) {
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'quality') return (b.quality_score || 95) - (a.quality_score || 95);
      return 0;
    });
    return { results: sorted, tokens: [] };
  }

  // 2. Score each candidate
  const scoredItems: SearchResult<T>[] = [];

  for (const item of filtered) {
    let score = 0;
    const matchedTokens = new Set<string>();

    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const content = (item.prompt_template || item.prompt || item.content || '').toLowerCase();
    const role = (item.profession?.name || item.profession?.slug || item.role || item.profession || '').toLowerCase();
    const model = (item.model?.name || item.model?.slug || item.model || '').toLowerCase();
    const tags = Array.isArray(item.tags) ? item.tags.map((t) => t.toLowerCase()) : [];
    const keywords = Array.isArray(item.keywords) ? item.keywords.map((k) => k.toLowerCase()) : [];

    // A. Title Exact Phrase Match
    if (title.includes(cleanFullQuery)) {
      score += 100;
    }

    // B. Token-level matching
    let tokensMatchedCount = 0;

    for (const token of queryTokens) {
      let tokenMatched = false;

      // Title exact word match
      const titleWords = title.split(/\s+/);
      if (titleWords.includes(token)) {
        score += 50;
        tokenMatched = true;
      } else if (title.includes(token)) {
        // Title partial match
        score += 30;
        tokenMatched = true;
      }

      // Tag & Keyword Match
      if (tags.some((t) => t.includes(token)) || keywords.some((k) => k.includes(token))) {
        score += 18;
        tokenMatched = true;
      }

      // Description Match
      if (description.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      // Role Match
      if (role.includes(token)) {
        score += 15;
        tokenMatched = true;
      }

      // Model Match
      if (model.includes(token)) {
        score += 12;
        tokenMatched = true;
      }

      // Content Match
      if (content.includes(token)) {
        score += 10;
        tokenMatched = true;
      }

      // Typo tolerance (Fuzzy matching if token length >= 4)
      if (!tokenMatched && token.length >= 4) {
        for (const word of titleWords) {
          if (word.length >= 4 && levenshtein(token, word) === 1) {
            score += 12;
            tokenMatched = true;
            break;
          }
        }
      }

      if (tokenMatched) {
        tokensMatchedCount++;
        matchedTokens.add(token);
      }
    }

    // Bonus: Multi-token alignment
    if (tokensMatchedCount === queryTokens.length) {
      score += 35; // All significant tokens present
    } else if (tokensMatchedCount > 1) {
      score += tokensMatchedCount * 8;
    }

    // Only include if threshold is met
    if (score > 0) {
      scoredItems.push({
        item,
        score,
        matchedTokens: Array.from(matchedTokens),
      });
    }
  }

  // 3. Sort by computed Relevance Score + Quality Score fallback
  scoredItems.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.item.quality_score || 90) - (a.item.quality_score || 90);
  });

  return {
    results: scoredItems.map((s) => s.item),
    tokens: queryTokens,
  };
}
