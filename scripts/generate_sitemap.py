import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Supabase keys missing!")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
BASE_URL = "https://www.promptory.xyz"
TODAY = datetime.utcnow().strftime('%Y-%m-%d')

static_pages = [
    ("", "1.0", "daily"),
    ("/directory", "0.9", "daily"),
    ("/workflows", "0.8", "weekly"),
    ("/saved", "0.6", "monthly"),
    ("/submit", "0.7", "monthly"),
    ("/about", "0.5", "monthly"),
    ("/privacy", "0.4", "monthly"),
    ("/terms", "0.4", "monthly"),
    ("/contact", "0.5", "monthly"),
]

print("🔍 Fetching published prompts from Supabase...")
res = supabase.table('prompts').select('slug, model:models(slug), profession:professions(slug)').eq('status', 'published').execute()
prompts = res.data or []

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

for path, priority, freq in static_pages:
    xml.append(f"""  <url>
    <loc>{BASE_URL}{path}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

for p in prompts:
    m_slug = (p.get('model') or {}).get('slug', 'chatgpt')
    r_slug = (p.get('profession') or {}).get('slug', 'developer')
    p_slug = p.get('slug')
    if p_slug:
        xml.append(f"""  <url>
    <loc>{BASE_URL}/prompts/{m_slug}/{r_slug}/{p_slug}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

xml.append('</urlset>')

os.makedirs("public", exist_ok=True)
with open("public/sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(xml))

print(f"🎉 Success: public/sitemap.xml created with {len(static_pages) + len(prompts)} URLs!")
