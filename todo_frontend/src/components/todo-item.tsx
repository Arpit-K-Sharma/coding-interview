"use client";

import type { Todo } from "@/types/todo";

type Props = {
	todo: Todo;
	onToggle: (id: number, completed: boolean) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
	onEdit: (id: number, title: string, description: string | null) => Promise<void>;
};

import { useState } from "react";

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(todo.title);
	const [description, setDescription] = useState(todo.description ?? "");
	const [busy, setBusy] = useState(false);

	async function toggle() {
		setBusy(true);
		try { await onToggle(todo.id, !todo.completed); } finally { setBusy(false); }
	}

	async function remove() {
		if (!confirm("Delete this task?")) return;
		setBusy(true);
		try { await onDelete(todo.id); } finally { setBusy(false); }
	}

	async function save() {
		if (!title.trim()) return;
		setBusy(true);
		try { await onEdit(todo.id, title.trim(), description.trim() || null); setIsEditing(false); }
		finally { setBusy(false); }
	}

	if (isEditing) {
		return (
			<div className="border rounded p-3 grid gap-2 bg-white">
				<input className="border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
				<textarea className="border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
				<div className="flex gap-2">
					<button onClick={save} disabled={busy || !title.trim()} className="px-3 py-2 rounded bg-black text-white">Save</button>
					<button onClick={() => { setIsEditing(false); setTitle(todo.title); setDescription(todo.description ?? ""); }} className="px-3 py-2 rounded border">Cancel</button>
				</div>
			</div>
		);
	}

	return (
		<div className="border rounded p-3 flex items-start gap-3 bg-white">
			<input type="checkbox" checked={todo.completed} onChange={toggle} disabled={busy} />
			<div className="flex-1">
				<div className={`font-semibold ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</div>
				{todo.description && <div className={`text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-600"}`}>{todo.description}</div>}
				<div className="text-xs text-gray-400 mt-1">{new Date(todo.created_at).toLocaleString()}</div>
			</div>
			<div className="flex gap-2">
				<button onClick={() => setIsEditing(true)} className="px-3 py-2 rounded border">Edit</button>
				<button onClick={remove} className="px-3 py-2 rounded border text-red-600">Delete</button>
			</div>
		</div>
	);
}


