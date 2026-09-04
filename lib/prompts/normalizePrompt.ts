export interface NormalizedPrompt {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  seoTitle: string;
  description: string;
  content: string;
  model: {
    id: string;
    name: string;
    slug: string;
  };
  profession: {
    id: string;
    name: string;
    slug: string;
  };
  task: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  variables: Array<{ name: string; label?: string; placeholder?: string; default?: string }>;
  useCases: string[];
  limitations: string[];
  faqs: Array<{ question: string; answer: string }>;
  qualityScore: number;
  contentQualityScore: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function sanitizeClaims(text: string): string {
  if (!text) return '';
  return text
    .replace(/\b100%\s*Quality\s*Audited\b/gi, '303 Quality-Scored Prompts')
    .replace(/\bQuality\s*Audited\b/gi, 'Quality-Scored')
    .replace(/\btested\s+system\s+prompts?\b/gi, 'curated AI prompts and workflow templates')
    .replace(/\btested\s+prompts?\b/gi, 'curated prompts')
    .replace(/\bzero[- ]hallucination\b/gi, 'structured context')
    .replace(/\beliminate\s+(ai\s+)?hallucinations?\b/gi, 'mitigate inaccurate generations')
    .replace(/\b100%\s*accurate\b/gi, 'high-precision')
    .replace(/\bbattle[- ]tested\b/gi, 'practical')
    .replace(/\bproduction[- ]tested\b/gi, 'production-focused')
    .replace(/\bproduction[- ]proven\b/gi, 'production-focused')
    .replace(/\bguaranteed\s+ranking\b/gi, 'search-optimized')
    .replace(/\bguarantees?\s+security\b/gi, 'supports security audits')
    .replace(/\bguaranteed\b/gi, 'recommended')
    .replace(/\bhigh[- ]authority\s+ranking\b/gi, 'search visibility')
    .replace(/\bhigh[- ]authority\b/gi, 'curated')
    .replace(/\bhigh[- ]ranking\b/gi, 'search-aligned')
    .replace(/\bdeterministic\b/gi, 'structured')
    .replace(/\baudited\s+and\s+deterministic\b/gi, 'structured and reviewed')
    .replace(/\bverified\s+gpt\s+prompt\b/gi, 'prompt')
    .replace(/\bAll prompts verified under open developer licensing\.?\b/gi, 'Promptory publishes reusable AI prompt templates and workflow resources.')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeRepeatedPhrases(text: string): string {
  if (!text) return '';

  // Collapse consecutive duplicated words (e.g. "Optimization Optimization" -> "Optimization")
  let result = text.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');

  // Collapse duplicated multi-word clusters
  result = result.replace(/\b(Performance Optimization)\s+(?:Performance Optimization|Optimization)\b/gi, '$1');
  result = result.replace(/\b(Query Optimization)\s+(?:Query Optimization|Optimization)\b/gi, '$1');
  result = result.replace(/\b(Testing & Performance)\s+(?:Testing & Performance|Performance|Testing)\b/gi, '$1');
  result = result.replace(/\b(Code Review)\s+(?:Code Review|Review)\b/gi, '$1');
  result = result.replace(/\b(Prompt)\s+Prompt\b/gi, 'Prompt');

  return result.replace(/\s+/g, ' ').trim();
}

export function generateSeoTitle(rawTitle: string, taskSlug?: string): string {
  if (!rawTitle) return 'AI System Prompt';

  // 1. Strip branding & legacy suffixes
  let clean = rawTitle
    .replace(/\s*\|\s*Promptory.*$/i, '')
    .replace(/\s*—\s*Verified.*$/i, '')
    .replace(/\s*—\s*Production.*$/i, '')
    .replace(/Performance Audit & Architecture Optimizer/gi, 'Testing & Performance Prompt')
    .replace(/& Architecture Optimizer/gi, 'Optimization Prompt')
    .replace(/Architecture Optimizer/gi, 'Optimization Prompt')
    .replace(/High-Volume Query Optimization & Index Planner/gi, 'Query Optimization & Index Tuning Prompt')
    .trim();

  clean = sanitizeClaims(clean);

  // 2. Map task intent suffix only if specific intent is missing
  const taskSuffixMap: Record<string, string> = {
    database: 'Query Optimization Prompt',
    debugging: 'Debugging Prompt',
    'code-review': 'Code Review Prompt',
    testing: 'Testing Prompt',
    performance: 'Performance Optimization Prompt',
    security: 'Security Audit Prompt',
    seo: 'SEO Prompt',
    'email-outreach': 'Outreach Prompt',
    email: 'Outreach Prompt',
    'content-writing': 'Writing Prompt',
    marketing: 'Marketing Prompt',
    automation: 'Automation Prompt',
  };

  const hasIntent = /\b(prompt|optimization|testing|audit|review|debugging|outreach|generator)\b/i.test(clean);

  if (!hasIntent && taskSlug && taskSuffixMap[taskSlug]) {
    clean = `${clean} ${taskSuffixMap[taskSlug]}`;
  } else if (!clean.toLowerCase().includes('prompt')) {
    clean = `${clean} Prompt`;
  }

  return removeRepeatedPhrases(clean);
}

export function calculateContentQualityScore(prompt: any, content: string): number {
  let score = 0;
  if (prompt.title && prompt.title.length >= 20 && !prompt.title.includes('Optimizer Optimizer')) score += 15;
  if (prompt.description && prompt.description.length >= 75) score += 15;
  if (content && content.length >= 300) score += 25;
  if (Array.isArray(prompt.variables) && prompt.variables.length > 0) score += 15;
  if (Array.isArray(prompt.use_cases) && prompt.use_cases.length > 0) score += 10;
  if (Array.isArray(prompt.faqs) && prompt.faqs.length > 0) score += 10;
  if (prompt.task_id || prompt.task_slug) score += 10;

  const combined = `${prompt.title} ${prompt.description} ${content}`;
  if (/\b(guaranteed|zero-hallucination|100% accurate|battle-tested)\b/i.test(combined)) {
    score -= 25;
  }

  return Math.max(0, Math.min(100, score));
}

export function normalizePrompt(raw: any): NormalizedPrompt {
  const content = (
    raw.prompt_template?.trim() ||
    raw.prompt?.trim() ||
    raw.content?.trim() ||
    ''
  );

  const rawTitle = raw.title || 'AI System Prompt';
  const taskSlug = raw.task?.slug || raw.task_slug || 'coding';
  const seoTitle = generateSeoTitle(rawTitle, taskSlug);

  return {
    id: raw.id,
    slug: raw.slug,
    title: sanitizeClaims(rawTitle),
    displayTitle: sanitizeClaims(rawTitle),
    seoTitle,
    description: sanitizeClaims(
      raw.description || `Practical ${raw.model?.name || 'AI'} system prompt for ${raw.profession?.name || 'engineers'}.`
    ),
    content: sanitizeClaims(content),
    model: {
      id: raw.model?.id || raw.model_id || '',
      name: raw.model?.name || 'AI Model',
      slug: raw.model?.slug || 'chatgpt',
    },
    profession: {
      id: raw.profession?.id || raw.profession_id || '',
      name: raw.profession?.name || 'Developer',
      slug: raw.profession?.slug || 'software-developer',
    },
    task: {
      id: raw.task?.id || raw.task_id || '',
      name: raw.task?.name || 'Coding',
      slug: taskSlug,
    },
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    variables: Array.isArray(raw.variables) ? raw.variables : [],
    useCases: Array.isArray(raw.use_cases) ? raw.use_cases : [],
    limitations: Array.isArray(raw.limitations) ? raw.limitations : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    qualityScore: raw.quality_score || 90,
    contentQualityScore: calculateContentQualityScore(raw, content),
    status: raw.status || 'published',
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.created_at || new Date().toISOString(),
  };
}
