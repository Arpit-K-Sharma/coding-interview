# Todo Backend API Contract

Base URL: `http://127.0.0.1:8000`

## Models

- Todo
  - id: number
  - title: string (1-200 chars)
  - description: string|null (≤2000 chars)
  - completed: boolean
  - created_at: ISO datetime (UTC)
  - updated_at: ISO datetime (UTC)

- TodoCreate (request)
  - title: string (required)
  - description: string|null (optional)
  - completed: boolean (default false)

- TodoUpdate (request)
  - title?: string
  - description?: string|null
  - completed?: boolean

## Endpoints

### GET /todos/
- Response: 200 OK → `Todo[]`
- Example response:
```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "description": "2% organic",
    "completed": false,
    "created_at": "2025-01-01T12:00:00.000000",
    "updated_at": "2025-01-01T12:00:00.000000"
  }
]
```

### POST /todos/
- Body: `TodoCreate`
- Response: 201 Created → `Todo`
- Example request:
```json
{
  "title": "Buy milk",
  "description": "2% organic",
  "completed": false
}
```
- Example response:
```json
{
  "id": 1,
  "title": "Buy milk",
  "description": "2% organic",
  "completed": false,
  "created_at": "2025-01-01T12:00:00.000000",
  "updated_at": "2025-01-01T12:00:00.000000"
}
```

### GET /todos/{id}
- Params: `id` (number ≥1)
- Response: 200 OK → `Todo`
- Errors: 404 Not Found

### PUT /todos/{id}
- Replaces the entire resource
- Body: `TodoCreate`
- Response: 200 OK → `Todo`
- Errors: 404 Not Found

### PATCH /todos/{id}
- Partial update
- Body: `TodoUpdate`
- Response: 200 OK → `Todo`
- Errors: 404 Not Found

### DELETE /todos/{id}
- Response: 204 No Content
- Errors: 404 Not Found

## Error Shape
```json
{
  "detail": "Todo not found"
}
```

## Notes for Frontend
- All timestamps are UTC ISO strings.
- `description` can be null or omitted in requests.
- `completed` defaults to false if omitted in POST.
- CORS is open; no auth implemented.
- Persistence is a JSON file at `todo_backend/data/todos.json`.

## Quick cURL Examples

- Create:
```bash
curl -X POST http://127.0.0.1:8000/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"2% organic","completed":false}'
```

- List:
```bash
curl http://127.0.0.1:8000/todos/
```

- Get by id:
```bash
curl http://127.0.0.1:8000/todos/1
```

- Replace:
```bash
curl -X PUT http://127.0.0.1:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy bread","description":"Whole grain","completed":true}'
```

- Patch:
```bash
curl -X PATCH http://127.0.0.1:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":false}'
```

- Delete:
```bash
curl -X DELETE http://127.0.0.1:8000/todos/1 -i
```


