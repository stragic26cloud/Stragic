import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
ROOT = Path(__file__).resolve().parents[1]
app = FastAPI(title="STRAGIC AI Hub API", version="0.1.0")

AGENT_INSTRUCTIONS = {
    "core": "Eres STRAGIC Core, un coordinador de una comunidad global de tecnología, innovación e investigación. Ayuda a convertir consultas en planes claros y responsables.",
    "tech": "Eres Tech Agent de STRAGIC. Ayuda con arquitectura, programación, APIs, ciberseguridad defensiva, accesibilidad y desarrollo de productos. Explica supuestos y pasos verificables.",
    "legal": "Eres Legal Intelligence de STRAGIC. Solo proporcionas información general e investigación jurídica, no asesoría legal ni conclusiones definitivas. Antes de analizar, identifica jurisdicción, fecha y hechos relevantes. No inventes leyes, artículos, sentencias, enlaces ni citas. Si no tienes fuentes oficiales verificables, dilo claramente y pide el texto o enlace oficial. Recomienda revisión por profesional habilitado. No redactes instrucciones para evadir la ley.",
    "research": "Eres Research Agent de STRAGIC. Ayuda a formular preguntas, metodologías y síntesis de evidencia. No inventes papers, autores, DOI ni resultados. Distingue hechos, inferencias e hipótesis.",
    "innovation": "Eres Innovation Agent de STRAGIC. Ayuda a validar problemas, diseñar MVP, modelos de negocio, teoría de cambio y métricas de impacto."
}

class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=6000)
    agent: str = Field(default="core")
    jurisdiction: str = Field(default="No especificada", max_length=100)

class ChatResponse(BaseModel):
    answer: str
    agent: str
    mode: str

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "STRAGIC AI Hub"}

@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    agent = payload.agent if payload.agent in AGENT_INSTRUCTIONS else "core"
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="IA no configurada. Añade OPENAI_API_KEY en el entorno del servidor.")

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        instructions = (
            AGENT_INSTRUCTIONS[agent]
            + "\nResponde en español salvo que el usuario solicite otro idioma. "
            + "Sé claro, estructurado y honesto sobre límites y datos faltantes. "
            + f"Jurisdicción indicada por el usuario: {payload.jurisdiction}. "
            + "No afirmes haber consultado internet ni bases de datos si no se proporcionaron herramientas o fuentes."
        )
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-6.1-terra"),
            instructions=instructions,
            input=payload.message
        )
        answer = (response.output_text or "").strip()
        if not answer:
            raise ValueError("Empty model response")
        return ChatResponse(answer=answer, agent=agent, mode="openai-responses")
    except HTTPException:
        raise
    except Exception as exc:
        # Do not expose secrets or provider internals to the browser.
        raise HTTPException(status_code=502, detail="No fue posible completar la consulta de IA. Revisa la configuración del servidor.") from exc

@app.get("/")
def home():
    return FileResponse(ROOT / "index.html")

app.mount("/", StaticFiles(directory=ROOT, html=True), name="static")
