"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "todo_demo_items";

function loadInitial(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Todo[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persist(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* ignore */
  }
}

export default function TodoApp() {
  // Start with empty list so server & first client render match, then hydrate from localStorage.
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // After mount, load stored todos exactly once.
  useEffect(() => {
    const stored = loadInitial();
    if (stored.length) setTodos(stored);
    setMounted(true);
  }, []);

  // Persist only after we've mounted to avoid touching localStorage server-side.
  useEffect(() => {
    if (mounted) persist(todos);
  }, [todos, mounted]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(t => !t.completed);
      case "completed":
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const addTodo = useCallback(() => {
    const title = draft.trim();
    if (!title) return;
    setTodos(prev => [
      { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setDraft("");
  }, [draft]);

  const toggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const remove = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const markAll = useCallback((completed: boolean) => {
    setTodos(prev => prev.map(t => ({ ...t, completed })));
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      addTodo();
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-4xl font-bold tracking-tight text-center">Todo List</h1>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={mounted ? "Add a new task..." : "Loading tasks..."}
          disabled={!mounted}
          className="flex-1 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium disabled:opacity-40"
          disabled={!mounted || !draft.trim()}
        >Add</button>
      </div>
      {mounted && todos.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>{remaining} item{remaining !== 1 && 's'} left</span>
          <div className="flex gap-1">
            {(["all", "active", "completed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded border text-xs font-semibold transition ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-300 dark:border-neutral-700'}`}
              >{f}</button>
            ))}
          </div>
          <button
            onClick={clearCompleted}
            className="ml-auto px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >Clear completed</button>
          <button
            onClick={() => markAll(true)}
            className="px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >Mark all done</button>
          <button
            onClick={() => markAll(false)}
            className="px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >Unmark all</button>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {mounted && filtered.map(todo => (
          <li key={todo.id} className="group flex items-center gap-3 rounded border border-neutral-300 dark:border-neutral-700 px-3 py-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
              className="size-4 rounded border-neutral-400 focus:ring-blue-500"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-neutral-500' : ''}`}>{todo.title}</span>
            <button
              onClick={() => remove(todo.id)}
              aria-label="Delete"
              className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600 text-xs font-semibold"
            >Delete</button>
          </li>
        ))}
      </ul>
      {mounted && todos.length === 0 && (
        <p className="text-center text-sm text-neutral-500">No tasks yet. Add one above.</p>
      )}
      {!mounted && (
        <p className="text-center text-sm text-neutral-400 animate-pulse">Loading saved tasks…</p>
      )}
    </div>
  );
}
