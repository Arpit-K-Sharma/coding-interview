page.tsx

"use client"

import { useEffect, useState } from "react"
import { TodoList } from "@/components/todo-list"
import { TodoForm } from "@/components/todo-form"
import type { Todo } from "@/types/todo"

const API_URL = "http://127.0.0.1:8000"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/todos/`)
      if (!response.ok) throw new Error("Failed to fetch todos")
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (title: string, description: string | null) => {
    try {
      const response = await fetch(`${API_URL}/todos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false }),
      })
      if (!response.ok) throw new Error("Failed to create todo")
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo")
    }
  }

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      if (!response.ok) throw new Error("Failed to update todo")
      const updated = await response.json()
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo")
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete todo")
      setTodos(todos.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo")
    }
  }

  const handleEditTodo = async (id: number, title: string, description: string | null) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      if (!response.ok) throw new Error("Failed to update todo")
      const updated = await response.json()
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to edit todo")
    }
  }

  const completedCount = todos.filter((t) => t.completed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">Your Tasks</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Stay organized and productive with your personal todo list
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-primary">{todos.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="mt-2 text-3xl font-bold text-accent">{completedCount}</p>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <TodoForm onAddTodo={handleAddTodo} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
          </div>
        )}

        {/* Todo List */}
        {!loading && (
          <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onEdit={handleEditTodo} />
        )}

        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center">
            <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </main>
  )
}



##todo-form.tsx

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TodoFormProps {
  onAddTodo: (title: string, description: string | null) => Promise<void>
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setIsSubmitting(true)
      await onAddTodo(title, description.trim() || null)
      setTitle("")
      setDescription("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Task Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter your task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="mt-2"
            maxLength={200}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">{title.length}/200</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="description"
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="mt-2"
            maxLength={2000}
            rows={3}
          />
          <p className="mt-1 text-xs text-muted-foreground">{description.length}/2000</p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  )
}


##todo-item.tsx

"use client"

import { useState } from "react"
import type { Todo } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Trash2, Edit2, X, Check } from "lucide-react"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onEdit: (id: number, title: string, description: string | null) => Promise<void>
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await onToggle(todo.id, todo.completed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsLoading(true)
      try {
        await onDelete(todo.id)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return
    setIsLoading(true)
    try {
      await onEdit(todo.id, editTitle, editDescription.trim() || null)
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isLoading}
            maxLength={200}
            placeholder="Task title"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isLoading}
            maxLength={2000}
            placeholder="Task description (optional)"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isLoading || !editTitle.trim()}
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-4 w-4" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setEditTitle(todo.title)
                setEditDescription(todo.description || "")
              }}
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group rounded-lg border transition-all ${
        todo.completed ? "border-border bg-muted/40" : "border-border bg-card hover:border-primary/50 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4 p-4">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="mt-1 flex-shrink-0 transition-colors"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed ? (
            <CheckCircle2 className="h-6 w-6 text-accent" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold transition-all ${
              todo.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-1 text-sm transition-all ${
                todo.completed ? "text-muted-foreground line-through" : "text-muted-foreground"
              }`}
            >
              {todo.description}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(todo.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="text-muted-foreground hover:text-primary"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={isLoading}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


## todo-list.tsx

"use client"

import type { Todo } from "@/types/todo"
import { TodoItem } from "./todo-item"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number, completed: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onEdit: (id: number, title: string, description: string | null) => Promise<void>
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const completed = todos.filter((t) => t.completed)
  const pending = todos.filter((t) => !t.completed)

  return (
    <div className="space-y-8">
      {/* Pending Tasks */}
      {pending.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
            <span className="inline-block h-1 w-1 rounded-full bg-primary mr-2"></span>
            Active Tasks ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
            <span className="inline-block h-1 w-1 rounded-full bg-accent mr-2"></span>
            Completed ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


#todo.ts

export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

