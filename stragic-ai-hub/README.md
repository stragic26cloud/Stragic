# STRAGIC AI Hub

Prototipo web para una comunidad global de tecnología, innovación, investigación e inteligencia legal responsable. Incluye dashboard responsive, selector de agentes, chatbot y API backend opcional.

## Incluye
- Identidad visual azul/naranja y logo STRAGIC proporcionado.
- Dashboard responsive en HTML/CSS/JavaScript.
- Agentes: Core, Tech, Legal Intelligence, Research e Innovation.
- Chat conectado a un backend FastAPI.
- Integración de servidor con OpenAI Responses API.
- Selector de jurisdicción para consultas legales.
- Modo demostración en el frontend si el backend no está disponible.

## Ejecutar localmente
Requiere Python 3.10+.

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edita `.env` y coloca tu clave API en `OPENAI_API_KEY`. La clave debe permanecer únicamente en el servidor; nunca la escribas en `app.js`, `index.html` ni en GitHub.

```bash
uvicorn backend.app:app --reload
```

Abre http://127.0.0.1:8000

Sin clave API el backend devuelve un error de configuración; el navegador muestra respuestas de demostración locales. No son respuestas de un modelo de IA.

## Publicar en GitHub
1. Crea un repositorio público o privado llamado `stragic-ai-hub`.
2. Descomprime este proyecto.
3. Sube todos los archivos, incluido `assets/stragic-logo.png`.
4. No subas `.env` ni claves.
5. Para habilitar el chatbot real, despliega el backend en un servicio compatible con Python y configura `OPENAI_API_KEY` y `OPENAI_MODEL` como variables secretas.
6. Configura el frontend para llamar al dominio del backend si se alojan por separado (ajusta `API_URL` en `app.js`).

GitHub Pages solo sirve el frontend estático; no ejecuta FastAPI ni mantiene secretos. Para un despliegue completo utiliza hosting para backend, por ejemplo Render, Railway o Fly.io, y un hosting estático para el frontend.

## Arquitectura recomendada para la siguiente versión
- Autenticación y roles (miembro, mentor, investigador, administrador).
- Base de datos PostgreSQL para perfiles, proyectos y conversaciones.
- RAG con documentos curados y fuentes oficiales por país.
- Registro de fuentes, fecha de consulta y versión normativa.
- Revisión humana para documentos legales de alto impacto.
- Consentimiento, retención mínima, borrado y controles de acceso.
- Rate limiting, moderación, logging seguro y protección contra prompt injection.

## Salvaguardas legales
Legal Intelligence es una herramienta de orientación e investigación general. No reemplaza a un abogado ni crea una relación profesional. No se deben presentar normas o citas sin verificar en fuentes oficiales. Antes de usarla en producción, incorporar corpus jurídico oficial por jurisdicción, enlaces y fechas de vigencia, controles de calidad y revisión profesional.

## API
- `GET /api/health`
- `POST /api/chat`

Ejemplo:
```json
{
  "message": "¿Qué debo considerar para proteger el software de mi startup?",
  "agent": "legal",
  "jurisdiction": "Perú"
}
```
