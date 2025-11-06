"use client";

import { useState } from "react";

type Props = {
	onAddTodo: (title: string, description: string | null) => Promise<void>;
};

export function TodoForm({ onAddTodo }: Props) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!title.trim()) return;
		setSubmitting(true);
		try {
			await onAddTodo(title.trim(), description.trim() || null);
			setTitle("");
			setDescription("");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="rounded-lg border p-4 grid gap-3 bg-white">
			<input
				className="border rounded px-3 py-2"
				placeholder="Task title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				maxLength={200}
				required
			/>
			<textarea
				className="border rounded px-3 py-2"
				placeholder="Description (optional)"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				maxLength={2000}
				rows={3}
			/>
			<button disabled={submitting || !title.trim()} className="rounded bg-black text-white px-3 py-2">
				{submitting ? "Adding..." : "Add Task"}
			</button>
		</form>
	);
}


