#!/bin/bash
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Seeding 200+ SEO Prompts into Supabase..."
python scripts/seed_prompts.py
