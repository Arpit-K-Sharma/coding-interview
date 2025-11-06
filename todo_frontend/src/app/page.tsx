"use client";

import { useEffect, useState } from "react";
import type { Todo, TodoCreate } from "@/types/todo";
import { fetchTodos, createTodo, updateTodo, replaceTodo, deleteTodo } from "@/lib/api";
import { TodoList } from "@/components/todo-list";
import { TodoForm } from "@/components/todo-form";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload: TodoCreate = { title, description: description || null, completed: false };
    await createTodo(payload);
    setTitle("");
    setDescription("");
    await load();
  }

  async function onToggle(id: number, completed: boolean) {
    await updateTodo(id, { completed });
    await load();
  }

  async function onDelete(id: number) {
    await deleteTodo(id);
    await load();
  }

  function startEdit(t: Todo) {
    setEditId(t.id);
    setEditTitle(t.title);
    setEditDescription(t.description ?? "");
    setEditCompleted(t.completed);
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (editId == null) return;
    await replaceTodo(editId, {
      title: editTitle,
      description: editDescription || null,
      completed: editCompleted,
    });
    setEditId(null);
    await load();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <p className="text-gray-600">Create, edit, complete, and delete tasks.</p>
        </div>

        <div className="mb-4">
          <TodoForm onAddTodo={async (t, d) => { setTitle(""); setDescription(""); await createTodo({ title: t, description: d, completed: false }); await load(); }} />
        </div>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {loading && <div className="py-8 text-center text-gray-500">Loading…</div>}

        {/* Search by title (live, one letter at a time) */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="border rounded px-3 py-2 w-full"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="px-3 py-2 border rounded">Clear</button>
          )}
        </div>

        {search && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Search results ({todos.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).length})</h2>
            <ul className="grid gap-2">
              {todos
                .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
                .map((t) => (
                  <li key={t.id} className="border rounded p-3 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${t.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.completed ? 'Completed' : 'Active'}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {!loading && !search && (
          <TodoList
            todos={todos}
            onToggle={async (id, completed) => { await updateTodo(id, { completed }); await load(); }}
            onDelete={async (id) => { await deleteTodo(id); await load(); }}
            onEdit={async (id, t, d) => { await replaceTodo(id, { title: t, description: d ?? null, completed: false }); await load(); }}
          />
        )}
      </div>
    </main>
  );
}
