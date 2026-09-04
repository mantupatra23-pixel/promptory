export interface NormalizedPrompt {
  id: string;
  slug: string;
  title: string;
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
    .replace(/\b100%\s*Quality\s*Audited\b/gi, 'Quality-Scored')
    .replace(/\bzero[- ]hallucination\b/gi, 'structured')
    .replace(/\b100%\s*accurate\b/gi, 'high-precision')
    .replace(/\bbattle[- ]tested\b/gi, 'practical')
    .replace(/\bproduction[- ]tested\b/gi, 'production-focused')
    .replace(/\bguaranteed ranking\b/gi, 'search-optimized')
    .replace(/\bguaranteed\b/gi, 'recommended')
    .replace(/\beliminate hallucinations\b/gi, 'mitigate hallucinations')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateSeoTitle(title: string, taskSlug?: string): string {
  if (!title) return 'AI System Prompt';
  let clean = title
    .replace(/\s*\|\s*Promptory.*$/i, '')
    .replace(/\s*—\s*Verified.*$/i, '')
    .replace(/\s*—\s*Production.*$/i, '')
    .replace(/& Architecture Optimizer/gi, 'Optimization')
    .replace(/Architecture Optimizer/gi, 'Optimization')
    .replace(/Performance Audit & Architecture Optimizer/gi, 'Performance Optimization')
    .trim();

  clean = sanitizeClaims(clean);

  if (/prompt$/i.test(clean)) return clean;

  const taskSuffixMap: Record<string, string> = {
    database: 'Optimization Prompt',
    debugging: 'Debugging Prompt',
    'code-review': 'Code Review Prompt',
    testing: 'Testing Prompt',
    performance: 'Performance Optimization Prompt',
    security: 'Security Audit Prompt',
    seo: 'SEO Prompt',
    'email-outreach': 'Outreach Prompt',
    'content-writing': 'Writing Prompt',
  };

  const suffix = (taskSlug && taskSuffixMap[taskSlug]) ? taskSuffixMap[taskSlug] : 'Prompt';
  return clean.toLowerCase().includes('prompt') ? clean : `${clean} ${suffix}`.replace(/\s+/g, ' ');
}

export function calculateContentQualityScore(prompt: any, content: string): number {
  let score = 0;
  if (prompt.title && prompt.title.length >= 20) score += 15;
  if (prompt.description && prompt.description.length >= 80) score += 15;
  if (content && content.length >= 350) score += 25;
  if (Array.isArray(prompt.variables) && prompt.variables.length > 0) score += 15;
  if (Array.isArray(prompt.use_cases) && prompt.use_cases.length > 0) score += 10;
  if (Array.isArray(prompt.faqs) && prompt.faqs.length > 0) score += 10;
  if (prompt.task_id || prompt.task_slug) score += 10;
  return Math.min(100, score);
}

export function normalizePrompt(raw: any): NormalizedPrompt {
  const content = (
    raw.prompt_template?.trim() ||
    raw.prompt?.trim() ||
    raw.content?.trim() ||
    ''
  );

  const rawTitle = raw.title || 'AI Prompt';
  const taskSlug = raw.task?.slug || raw.task_slug || 'coding';
  const seoTitle = generateSeoTitle(rawTitle, taskSlug);

  return {
    id: raw.id,
    slug: raw.slug,
    title: sanitizeClaims(rawTitle),
    seoTitle,
    description: sanitizeClaims(raw.description || ''),
    content,
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
