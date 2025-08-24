# AI QuadBoard (local)
Compará respuestas de **ChatGPT**, **Gemini**, **Grok** y **Copilot*** en 4 columnas.

> *Copilot no tiene API pública; esta columna usa **Azure OpenAI** si lo configurás.*

## Cómo correrlo
1. Instalá Node.js (https://nodejs.org).
2. En esta carpeta:
   ```bash
   npm install
   ```
3. Duplicá `.env.example` a `.env` y completá tus claves.
4. Ejecutá:
   ```bash
   npm start
   ```
5. Abrí `http://localhost:3000` en tu navegador.

## Estructura
- `public/index.html` — Interfaz web.
- `server.js` — Backend local (proxy a cada IA).
- `.env` — Claves privadas (no compartir).
- `package.json` — Dependencias y scripts.

## Notas
- Las claves **no** deben ponerse en el HTML.
- Si no configurás Azure OpenAI, la columna “Copilot” mostrará un aviso 501 (informativo).
