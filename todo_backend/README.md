# Todo Backend (FastAPI)

Simple FastAPI CRUD API storing data in a JSON file (no database).

## Install

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r todo_backend/requirements.txt
```

## Run

```bash
uvicorn todo_backend.main:app --reload --port 8000
```

Open docs at `http://127.0.0.1:8000/docs`.

## Endpoints
- GET `/todos/`
- POST `/todos/`
- GET `/todos/{id}`
- PUT `/todos/{id}`
- PATCH `/todos/{id}`
- DELETE `/todos/{id}`

Data is persisted in `todo_backend/data/todos.json`.

See `todo_backend/API_SPEC.md` for full request/response shapes and curl examples.


