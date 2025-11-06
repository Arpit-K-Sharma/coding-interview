"use client";

import type { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";

type Props = {
	todos: Todo[];
	onToggle: (id: number, completed: boolean) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
	onEdit: (id: number, title: string, description: string | null) => Promise<void>;
};

export function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
	const completed = todos.filter((t) => t.completed);
	const pending = todos.filter((t) => !t.completed);

	return (
		<div className="space-y-6">
			{pending.length > 0 && (
				<div>
					<h2 className="text-lg font-semibold mb-3">Active Tasks ({pending.length})</h2>
					<div className="grid gap-3">
						{pending.map((t) => (
							<TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
						))}
					</div>
				</div>
			)}

			{completed.length > 0 && (
				<div>
					<h2 className="text-lg font-semibold mb-3">Completed ({completed.length})</h2>
					<div className="grid gap-3">
						{completed.map((t) => (
							<TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}


