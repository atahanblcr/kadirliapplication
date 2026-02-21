'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, DeathNotice, DeathFilters, PaginatedMeta } from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const deathKeys = {
  all: ['deaths'] as const,
  lists: () => [...deathKeys.all, 'list'] as const,
  list: (filters: DeathFilters) => [...deathKeys.lists(), filters] as const,
};

// ─── Deaths List (Admin) ──────────────────────────────────────────────────────
export function useDeaths(filters: DeathFilters = {}) {
  return useQuery({
    queryKey: deathKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);

      const { data } = await api.get<ApiResponse<{ notices: DeathNotice[]; meta: PaginatedMeta }>>(
        `/deaths/admin?${params.toString()}`,
      );
      return { items: data.data.notices, meta: data.data.meta };
    },
  });
}

// ─── Approve ─────────────────────────────────────────────────────────────────
export function useApproveDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(`/deaths/${id}/approve`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
    },
  });
}

// ─── Reject ──────────────────────────────────────────────────────────────────
export function useRejectDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason, note }: { id: string; reason: string; note?: string }) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(`/deaths/${id}/reject`, {
        reason,
        note,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
    },
  });
}

// ─── Delete (soft) ───────────────────────────────────────────────────────────
export function useDeleteDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/deaths/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
    },
  });
}
