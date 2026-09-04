// lib/prompt-helper.ts

export interface CanonicalPrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt_template: string;
  prompt?: string;
  content?: string;
  model_id?: string;
  profession_id?: string;
  task_slug?: string;
  status: string;
  quality_score?: number;
  tags?: string[];
  variables?: Array<{ name: string; label?: string; placeholder?: string; default?: string }>;
  use_cases?: string[];
  limitations?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  created_at: string;
  updated_at: string;
  models?: { id: string; name: string; slug: string } | null;
  professions?: { id: string; name: string; slug: string } | null;
  tasks?: { id: string; name: string; slug: string } | null;
}

/**
 * Safely extracts the canonical prompt body across legacy and unified schemas.
 */
export function getPromptBody(prompt: Partial<CanonicalPrompt> | null | undefined): string {
  if (!prompt) return '';
  return (
    prompt.prompt_template?.trim() ||
    prompt.prompt?.trim() ||
    prompt.content?.trim() ||
    ''
  );
}

/**
 * Derives the canonical URL for any given prompt record.
 */
export function getCanonicalPromptUrl(
  prompt: CanonicalPrompt,
  modelSlugFallback = 'chatgpt',
  roleSlugFallback = 'software-developer'
): string {
  const modelSlug = prompt.models?.slug || modelSlugFallback;
  const roleSlug = prompt.professions?.slug || roleSlugFallback;
  return `https://www.promptory.xyz/prompts/${modelSlug}/${roleSlug}/${prompt.slug}`;
}
