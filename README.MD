# Caregene Todo App

Monorepo with a FastAPI backend and a Next.js frontend.

## Structure
- `todo_backend/`: FastAPI JSON-file CRUD API
- `todo_frontend/`: Next.js (App Router, TS) client

## Prerequisites
- Python 3.10+
- Node.js 18+ and npm

## Run Backend (FastAPI)
```powershell
# from repo root
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r todo_backend/requirements.txt
uvicorn todo_backend.main:app --reload --port 8000
```
API docs: http://127.0.0.1:8000/docs

More details: `todo_backend/README.md` and `todo_backend/API_SPEC.md`.

## Run Frontend (Next.js)
```powershell
cd .\todo_frontend
npm install
npm run dev
```
App: http://localhost:3000/

Environment (optional): create `todo_frontend/.env.local` with:
```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

## Features
- Full CRUD wired to backend: list, create (POST), toggle (PATCH), edit/replace (PUT), delete
- Live search by title (client-side, filters as you type) with status chips (Active/Completed)
- JSON persistence to `todo_backend/data/todos.json`

## Notes
- CORS is enabled on the backend for development.
- No database is used; data persists in a JSON file.
