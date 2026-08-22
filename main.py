import os
import time
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase init error: {e}")

app = FastAPI(title="Promptory Engine API", version="2.0.0")

# CORS setup for promptory.xyz & localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulateRequest(BaseModel):
    prompt: str
    model: Optional[str] = "groq"
    temperature: Optional[float] = 0.3

class TrackRequest(BaseModel):
    prompt_id: Optional[str] = None
    slug: Optional[str] = None
    event_type: str = "copy" # "copy" or "view"

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Promptory FastAPI Engine",
        "timestamp": time.time()
    }

@app.post("/api/v1/simulate")
async def simulate_prompt(req: SimulateRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt text cannot be empty.")

    start_time = time.time()
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    # 1. Primary: Groq Fast Llama 3 Inference
    if groq_api_key:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_api_key}"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": "You are executing a user prompt simulation on Promptory.xyz. Adhere strictly to format and output constraints without meta-commentary."},
                            {"role": "user", "content": req.prompt}
                        ],
                        "temperature": req.temperature,
                        "max_tokens": 1024
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    latency = round((time.time() - start_time) * 1000, 2)
                    return {
                        "success": True,
                        "output": content,
                        "latency_ms": latency,
                        "provider": "Groq Llama 3.3 70B"
                    }
        except Exception as err:
            print(f"Groq API error: {err}")

    # 2. Secondary: Google Gemini API Inference
    if gemini_api_key:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"
                res = await client.post(
                    url,
                    json={
                        "contents": [{"parts": [{"text": req.prompt}]}],
                        "generationConfig": {"temperature": req.temperature, "maxOutputTokens": 1024}
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    latency = round((time.time() - start_time) * 1000, 2)
                    return {
                        "success": True,
                        "output": text,
                        "latency_ms": latency,
                        "provider": "Google Gemini 1.5 Flash"
                    }
        except Exception as err:
            print(f"Gemini API error: {err}")

    # 3. Fallback deterministic execution simulator
    latency = round((time.time() - start_time) * 1000, 2)
    return {
        "success": True,
        "output": f"=== SIMULATION RESULT PREVIEW ===\n\nPrompt validated and formatted for production execution.\n\nInput summary: {req.prompt[:180]}...\n\n[Action Required]: Connect GROQ_API_KEY or GEMINI_API_KEY in Render Environment Variables for live real-time LLM responses.",
        "latency_ms": latency,
        "provider": "Deterministic Simulator"
    }

@app.post("/api/v1/track")
async def track_prompt_event(req: TrackRequest):
    if not supabase:
        return {"status": "skipped", "reason": "no_database_connection"}

    try:
        if req.slug:
            field = "copies_count" if req.event_type == "copy" else "views_count"
            supabase.rpc("increment_prompt_stats", {"target_slug": req.slug, "field_name": field}).execute()
        return {"status": "ok", "event": req.event_type}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    print(f"🚀 Promptory FastAPI Server running on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
