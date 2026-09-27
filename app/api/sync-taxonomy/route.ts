import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [{ data: profs }, { data: tasks }] = await Promise.all([
      supabase.from('professions').select('id, slug, name'),
      supabase.from('tasks').select('id, slug, name'),
    ]);

    const marketer = (profs || []).find(
      (p) => p.slug === 'digital-marketer' || p.slug.includes('market')
    );
    const contentTask =
      (tasks || []).find(
        (t) =>
          t.slug === 'content-writing' ||
          t.slug.includes('content') ||
          t.slug.includes('market')
      ) || tasks?.[0];
    const emailTask =
      (tasks || []).find(
        (t) => t.slug.includes('email') || t.slug.includes('outreach')
      ) || contentTask;

    if (!marketer || !contentTask) {
      return NextResponse.json(
        { error: 'Marketer role or Content task not found in database' },
        { status: 404 }
      );
    }

    // 1. Re-align Marketing prompts
    const { data: mPrompts } = await supabase
      .from('prompts')
      .select('id, title')
      .or('title.ilike.%Marketing Manager%,title.ilike.%Content Strategy%');

    const updatedMarketing = [];
    for (const p of mPrompts || []) {
      await supabase
        .from('prompts')
        .update({
          profession_id: marketer.id,
          task_id: contentTask.id,
          task_slug: contentTask.slug,
        })
        .eq('id', p.id);
      updatedMarketing.push(p.title);
    }

    // 2. Re-align Cold Email prompts
    const { data: ePrompts } = await supabase
      .from('prompts')
      .select('id, title')
      .or('title.ilike.%Cold Email%,title.ilike.%Email Outreach%');

    const updatedEmail = [];
    for (const p of ePrompts || []) {
      await supabase
        .from('prompts')
        .update({
          profession_id: marketer.id,
          task_id: emailTask.id,
          task_slug: emailTask.slug,
        })
        .eq('id', p.id);
      updatedEmail.push(p.title);
    }

    return NextResponse.json({
      success: true,
      message: 'Taxonomy successfully synced in Supabase database!',
      targetMarketerRole: marketer.name,
      updatedMarketingPrompts: updatedMarketing,
      updatedEmailPrompts: updatedEmail,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
