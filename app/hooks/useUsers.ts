"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User { id: string; name: string }

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error('Create failed');
      return res.json() as Promise<User>;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error('Update failed');
      return res.json() as Promise<User>;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      return id;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}
