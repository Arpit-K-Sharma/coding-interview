export type Todo = {
	id: number;
	title: string;
	description: string | null;
	completed: boolean;
	created_at: string;
	updated_at: string;
};

export type TodoCreate = {
	title: string;
	description?: string | null;
	completed?: boolean;
};

export type TodoUpdate = Partial<Omit<Todo, "id" | "created_at" | "updated_at">>;


