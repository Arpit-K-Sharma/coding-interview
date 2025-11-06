## Todo Frontend (Next.js)

Next.js app (App Router, TypeScript) wired to the FastAPI backend.

### Run
```powershell
npm install
npm run dev
```
Open http://localhost:3000/

Optional env (defaults to localhost): create `.env.local` with
```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

### Features
- List todos (GET /todos/)
- Create todo (POST /todos/)
- Toggle complete (PATCH /todos/{id})
- Edit/replace (PUT /todos/{id})
- Delete (DELETE /todos/{id})
- Live search by title (filters as you type) with status chips (Active/Completed)

### Tech
- Tailwind CSS with tokens defined in `src/app/globals.css`
- Components in `src/components/*`
- API client in `src/lib/api.ts`
