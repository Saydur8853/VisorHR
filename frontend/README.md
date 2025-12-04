# VisorHR frontend (React + Vite)

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend (e.g., http://localhost:8000/api).
3. Start the dev server: `npm run dev` (defaults to http://localhost:5173).
4. To run frontend and backend together (backend venv required), use: `npm run dev:full`.
5. Build for production: `npm run build`.

Vite config binds to 0.0.0.0:5173 for container/local network access.
