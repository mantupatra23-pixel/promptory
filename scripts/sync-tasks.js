const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

async function syncTasks() {
  console.log("Checking task relations in Supabase...");
  const { data: tasks, error: tErr } = await supabase.from("tasks").select("id, slug, name");
  if (tErr) {
    console.error("Task fetch error:", tErr.message);
    return;
  }

  const taskMap = new Map(tasks.map(t => [t.slug, t.id]));
  const { data: prompts, error: pErr } = await supabase.from("prompts").select("id, title, task_id, task_slug");
  if (pErr) {
    console.error("Prompt fetch error:", pErr.message);
    return;
  }

  let updated = 0;
  for (const p of prompts) {
    const slug = p.task_slug || "coding";
    const targetId = taskMap.get(slug);

    if (targetId && (!p.task_id || p.task_id !== targetId)) {
      await supabase.from("prompts").update({ task_id: targetId, task_slug: slug }).eq("id", p.id);
      updated++;
    }
  }

  console.log(`Synced ${updated} prompts with task foreign keys.`);
}

syncTasks();
