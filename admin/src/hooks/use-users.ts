'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, User, UserFilters, PaginatedMeta } from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// ─── Users List (Admin) ───────────────────────────────────────────────────────
// Backend returns { users, total, page, limit } — we normalize to PaginatedMeta
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page)            params.set('page',            String(filters.page));
      if (filters.limit)           params.set('limit',           String(filters.limit));
      if (filters.role)            params.set('role',            filters.role);
      if (filters.search)          params.set('search',          filters.search);
      if (filters.neighborhood_id) params.set('neighborhood_id', filters.neighborhood_id);
      if (filters.is_banned !== undefined) {
        params.set('is_banned', String(filters.is_banned));
      }

      const { data } = await api.get<ApiResponse<{ users: User[]; total: number; page: number; limit: number }>>(
        `/admin/users?${params.toString()}`,
      );

      const { users, total, page, limit } = data.data;
      const total_pages = Math.ceil(total / limit);
      const meta: PaginatedMeta = {
        page,
        limit,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      };
      return { items: users, meta };
    },
  });
}

// ─── User Detail ──────────────────────────────────────────────────────────────
export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// ─── Ban User ─────────────────────────────────────────────────────────────────
export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ban_reason,
      duration_days,
    }: {
      id: string;
      ban_reason: string;
      duration_days?: number;
    }) => {
      const { data } = await api.post<ApiResponse<{ message: string; banned_until: string | null }>>(
        `/admin/users/${id}/ban`,
        { ban_reason, duration_days },
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// ─── Unban User ───────────────────────────────────────────────────────────────
export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${id}/unban`,
      );
      return data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// ─── Change Role ──────────────────────────────────────────────────────────────
export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.patch<ApiResponse<{ message: string; role: string }>>(
        `/admin/users/${id}/role`,
        { role },
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
