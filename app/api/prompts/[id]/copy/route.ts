import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const promptId = params.id;

  if (!promptId) {
    return NextResponse.json({ error: 'Missing prompt ID' }, { status: 400 });
  }

  // Get current copies_count
  const { data: prompt } = await supabase
    .from('prompts')
    .select('copies_count')
    .eq('id', promptId)
    .single();

  const currentCount = prompt?.copies_count || 0;

  // Increment
  await supabase
    .from('prompts')
    .update({ copies_count: currentCount + 1 })
    .eq('id', promptId);

  return NextResponse.json({ success: true, copies_count: currentCount + 1 });
}
