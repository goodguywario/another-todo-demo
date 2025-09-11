"use client";
import React, { useCallback, useState } from "react";
import { useUsers, useCreateUser, useDeleteUser } from "../hooks/useUsers";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { Spinner } from "./Spinner";

export default function TodoApp() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: tasks, isLoading: tasksLoading } = useTasks(selectedUser);
  const createTask = useCreateTask(selectedUser);
  const updateTask = useUpdateTask(selectedUser);
  const deleteTask = useDeleteTask(selectedUser);

  const [newUserName, setNewUserName] = useState("");
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTasks = (tasks || []).filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const remaining = (tasks || []).filter(t => !t.completed).length;

  const addTask = useCallback(() => {
    if (!draft.trim() || !selectedUser) return;
    createTask.mutate(draft.trim(), { onSuccess: () => setDraft("") });
  }, [draft, selectedUser, createTask]);

  const toggleTask = useCallback((id: string, completed: boolean) => {
    updateTask.mutate({ id, completed: !completed });
  }, [updateTask]);

  const removeTask = useCallback((id: string) => {
    deleteTask.mutate(id);
  }, [deleteTask]);

  const clearCompleted = useCallback(() => {
    (tasks || []).filter(t => t.completed).forEach(t => deleteTask.mutate(t.id));
  }, [tasks, deleteTask]);

  const markAll = useCallback((completed: boolean) => {
    (tasks || []).forEach(t => updateTask.mutate({ id: t.id, completed }));
  }, [tasks, updateTask]);

  function onTaskKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTask();
  }

  const addUser = () => {
    if (!newUserName.trim()) return;
    createUser.mutate(newUserName.trim(), { onSuccess: (u) => {
      setNewUserName("");
      setSelectedUser(u.id);
    }});
  };

  const removeUser = (id: string) => {
    if (selectedUser === id) setSelectedUser(null);
    deleteUser.mutate(id);
  };

  const busyCreatingUser = createUser.isPending;
  const busyCreatingTask = createTask.isPending;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl font-bold tracking-tight text-center">Todo List</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="flex gap-2 items-center">
          <input
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
            placeholder="New user name"
            onKeyDown={e => e.key === 'Enter' && addUser()}
            className="flex-1 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            disabled={busyCreatingUser}
          />
          <button
            onClick={addUser}
            disabled={!newUserName.trim() || busyCreatingUser}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium disabled:opacity-40 flex items-center gap-2"
          >{busyCreatingUser && <Spinner size={14} className="text-white" />}Add User</button>
        </div>
        <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
          {usersLoading && <span className="text-xs text-neutral-500 flex items-center gap-1"><Spinner size={12} /> Loading users...</span>}
          {users?.map(u => (
            <div key={u.id} className={`flex items-center gap-2 px-3 py-1 rounded border text-sm ${selectedUser === u.id ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-300 dark:border-neutral-700'}`}> 
              <button onClick={() => setSelectedUser(u.id)}>{u.name}</button>
              <button onClick={() => removeUser(u.id)} className="text-red-500 hover:text-red-600" aria-label="Delete user">✕</button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-medium mb-1">Selected User</label>
            <select
              value={selectedUser || ''}
              onChange={e => setSelectedUser(e.target.value || null)}
              className="w-full rounded border border-neutral-600 dark:border-neutral-700 bg-neutral-900 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={usersLoading}
            >
              <option value="" className="bg-neutral-900 text-white">-- None --</option>
              {users?.map(u => <option key={u.id} value={u.id} className="bg-neutral-900 text-white">{u.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-medium mb-1">New Task</label>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={onTaskKeyDown}
                placeholder={selectedUser ? "Add a new task..." : "Select a user first"}
                disabled={!selectedUser || busyCreatingTask}
                className="flex-1 rounded border border-neutral-600 dark:border-neutral-700 bg-neutral-900 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={addTask}
                disabled={!draft.trim() || !selectedUser || busyCreatingTask}
                className="px-4 py-2 rounded bg-blue-600 text-white font-medium text-sm disabled:opacity-40 flex items-center gap-2"
              >{busyCreatingTask && <Spinner size={14} className="text-white" />}Add</button>
            </div>
          </div>
        </div>

        {selectedUser && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{remaining} item{remaining !== 1 && 's'} left</span>
            <div className="flex gap-1">
              {(['all', 'active', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded border text-xs font-semibold transition ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-300 dark:border-neutral-700'}`}
                >{f}</button>
              ))}
            </div>
            <button onClick={clearCompleted} className="ml-auto px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700">Clear completed</button>
            <button onClick={() => markAll(true)} className="px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700">Mark all done</button>
            <button onClick={() => markAll(false)} className="px-2 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700">Unmark all</button>
          </div>
        )}

        <ul className="flex flex-col gap-2 min-h-[40px]">
          {tasksLoading && selectedUser && <li className="text-sm text-neutral-500 flex items-center gap-1"><Spinner size={14} /> Loading tasks...</li>}
          {filteredTasks.map(todo => {
            const updating = updateTask.isPending; // coarse; could refine with mutation status per id
            const deleting = deleteTask.isPending; // similarly coarse
            return (
              <li key={todo.id} className="group flex items-center gap-3 rounded border border-neutral-300 dark:border-neutral-700 px-3 py-2">
                <label className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTask(todo.id, todo.completed)}
                    disabled={updating}
                    className="size-4 rounded border-neutral-400 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-neutral-500' : ''}`}>{todo.title}</span>
                </label>
                {(updating || deleting) && <Spinner size={14} className="text-neutral-500" />}
                <button
                  onClick={() => removeTask(todo.id)}
                  aria-label="Delete"
                  disabled={deleting}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600 text-xs font-semibold disabled:opacity-40"
                >Delete</button>
              </li>
            );
          })}
        </ul>
        {selectedUser && !tasksLoading && filteredTasks.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No tasks. Add one above.</p>
        )}
      </section>
    </div>
  );
}
