"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Task { id: string; title: string; authorId: string; completed: boolean; createdAt: string; updatedAt: string }

async function fetchTasks(userId: string | null): Promise<Task[]> {
  if (!userId) return [];
  const res = await fetch(`/api/users/${userId}/tasks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load tasks');
  return res.json();
}

export function useTasks(userId: string | null) {
  return useQuery({ queryKey: ['tasks', userId], queryFn: () => fetchTasks(userId), enabled: !!userId });
}

export function useCreateTask(userId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!userId) throw new Error('No user');
      const res = await fetch(`/api/users/${userId}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      if (!res.ok) throw new Error('Create task failed');
      return res.json() as Promise<Task>;
    },
    onSuccess: (_data, _vars, context) => {
      qc.invalidateQueries({ queryKey: ['tasks', userId] });
    },
  });
}

export function useUpdateTask(userId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string; title?: string; completed?: boolean }) => {
      const res = await fetch(`/api/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
      if (!res.ok) throw new Error('Update task failed');
      return res.json() as Promise<Task>;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', userId] }); },
  });
}

export function useDeleteTask(userId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      return id;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', userId] }); },
  });
}
