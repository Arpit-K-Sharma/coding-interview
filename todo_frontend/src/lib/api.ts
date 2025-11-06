import type { Todo, TodoCreate, TodoUpdate } from "@/types/todo";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export async function fetchTodos(): Promise<Todo[]> {
	const res = await fetch(`${API_BASE}/todos/`, { cache: "no-store" });
	if (!res.ok) throw new Error("Failed to load todos");
	return res.json();
}

export async function getTodo(id: number): Promise<Todo> {
	const res = await fetch(`${API_BASE}/todos/${id}`, { cache: "no-store" });
	if (!res.ok) throw new Error("Todo not found");
	return res.json();
}

export async function createTodo(data: TodoCreate): Promise<Todo> {
	const res = await fetch(`${API_BASE}/todos/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create todo");
	return res.json();
}

export async function updateTodo(id: number, data: TodoUpdate): Promise<Todo> {
	const res = await fetch(`${API_BASE}/todos/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update todo");
	return res.json();
}

export async function replaceTodo(id: number, data: TodoCreate): Promise<Todo> {
	const res = await fetch(`${API_BASE}/todos/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to replace todo");
	return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
	const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete todo");
}


