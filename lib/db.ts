import { supabase } from './supabase';

export async function getModels() {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching models:', error);
    return [];
  }
  return data;
}

export async function getProfessions() {
  const { data, error } = await supabase
    .from('professions')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching professions:', error);
    return [];
  }
  return data;
}

export async function getPrompts() {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      model:models(*),
      profession:professions(*),
      task:tasks(*)
    `)
    .eq('status', 'published')
    .order('quality_score', { ascending: false });
  
  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
  return data;
}

export async function getPromptByRoute(modelSlug: string, profSlug: string, promptOrTaskSlug: string) {
  // 1. Direct match with prompt unique slug
  const { data: promptBySlug } = await supabase
    .from('prompts')
    .select(`
      *,
      model:models(*),
      profession:professions(*),
      task:tasks(*)
    `)
    .eq('slug', promptOrTaskSlug)
    .maybeSingle();

  if (promptBySlug) {
    return promptBySlug;
  }

  // 2. Fallback match by task.slug + model + profession
  const { data: promptByTask } = await supabase
    .from('prompts')
    .select(`
      *,
      model:models!inner(*),
      profession:professions!inner(*),
      task:tasks!inner(*)
    `)
    .eq('model.slug', modelSlug)
    .eq('profession.slug', profSlug)
    .eq('task.slug', promptOrTaskSlug)
    .limit(1)
    .maybeSingle();

  return promptByTask || null;
}

export async function getWorkflows() {
  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      steps:workflow_steps(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }
  return data;
}

export async function getWorkflowBySlug(slug: string) {
  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      steps:workflow_steps(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching workflow by slug:', error);
    return null;
  }

  if (data && data.steps) {
    data.steps.sort((a: any, b: any) => a.step_order - b.step_order);
  }
  return data;
}
