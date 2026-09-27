const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

async function run() {
  console.log("Checking professions and tasks...");

  const { data: profs } = await supabase.from("professions").select("id, slug, name");
  const marketer = profs.find(
    (p) => p.slug === "digital-marketer" || p.slug.includes("market")
  );

  const { data: tasks } = await supabase.from("tasks").select("id, slug, name");
  const targetTask =
    tasks.find((t) => t.slug === "content-writing" || t.slug === "marketing") ||
    tasks[0];

  if (!marketer || !targetTask) {
    console.error("Missing matching marketer role or task");
    return;
  }

  console.log(`Setting Role: ${marketer.name} | Task: ${targetTask.name}`);

  // Fetch prompts that need fixing
  const { data: targets } = await supabase
    .from("prompts")
    .select("id, title")
    .or("title.ilike.%Marketing Manager%,title.ilike.%Content Strategy%");

  if (!targets || targets.length === 0) {
    console.log("No mismatched marketing prompts found.");
    return;
  }

  for (const item of targets) {
    const { error } = await supabase
      .from("prompts")
      .update({
        profession_id: marketer.id,
        task_id: targetTask.id,
        task_slug: targetTask.slug,
      })
      .eq("id", item.id);

    if (!error) {
      console.log(`Updated prompt: "${item.title}"`);
    } else {
      console.error(`Error updating ${item.id}:`, error.message);
    }
  }

  console.log("Done!");
}

run();
