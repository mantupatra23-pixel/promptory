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

export async function getPromptByRoute(modelSlug: string, profSlug: string, taskSlug: string) {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      model:models!inner(*),
      profession:professions!inner(*),
      task:tasks!inner(*)
    `)
    .eq('model.slug', modelSlug)
    .eq('profession.slug', profSlug)
    .eq('task.slug', taskSlug)
    .single();

  if (error) {
    console.error('Error fetching prompt route:', error);
    return null;
  }
  return data;
}
