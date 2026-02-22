'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  IntracityRoute,
  IntracityStop,
  IntracityFilters,
  PaginatedMeta,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const intracityKeys = {
  all: ['intracity'] as const,
  lists: () => [...intracityKeys.all, 'list'] as const,
  list: (filters: IntracityFilters) => [...intracityKeys.lists(), filters] as const,
  detail: (id: string) => [...intracityKeys.all, 'detail', id] as const,
};

// ─── List ─────────────────────────────────────────────────────────────────────
export function useIntracityRoutes(filters: IntracityFilters = {}) {
  const params = new URLSearchParams();
  if (filters.line_number) params.set('line_number', filters.line_number);
  if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
  if (filters.is_active !== undefined) params.set('is_active', String(filters.is_active));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: intracityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ routes: IntracityRoute[]; meta: PaginatedMeta }>
      >(`/admin/transport/intracity?${params.toString()}`);
      return data.data;
    },
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────
export function useIntracityDetail(id: string) {
  return useQuery({
    queryKey: intracityKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ route: IntracityRoute }>>(
        `/admin/transport/intracity/${id}`,
      );
      return data.data.route;
    },
    enabled: !!id,
  });
}

// ─── Create Route ─────────────────────────────────────────────────────────────
export function useCreateIntracityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Omit<IntracityRoute, 'id' | 'created_at' | 'stops'>) => {
      const { data } = await api.post<ApiResponse<{ route: IntracityRoute }>>(
        '/admin/transport/intracity',
        dto,
      );
      return data.data.route;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}

// ─── Update Route ─────────────────────────────────────────────────────────────
export function useUpdateIntracityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<IntracityRoute> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<{ route: IntracityRoute }>>(
        `/admin/transport/intracity/${id}`,
        dto,
      );
      return data.data.route;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: intracityKeys.detail(variables.id) });
    },
  });
}

// ─── Delete Route ─────────────────────────────────────────────────────────────
export function useDeleteIntracityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/transport/intracity/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}

// ─── Add Stop ─────────────────────────────────────────────────────────────────
export function useAddStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      routeId,
      ...dto
    }: {
      routeId: string;
      name: string;
      neighborhood_id?: string;
      latitude?: number;
      longitude?: number;
      time_from_start?: number;
    }) => {
      const { data } = await api.post<ApiResponse<{ stop: IntracityStop }>>(
        `/admin/transport/intracity/${routeId}/stops`,
        dto,
      );
      return { stop: data.data.stop, routeId };
    },
    onSuccess: ({ routeId }) => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}

// ─── Update Stop ──────────────────────────────────────────────────────────────
export function useUpdateStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      stopId,
      routeId,
      ...dto
    }: Partial<IntracityStop> & { stopId: string; routeId: string }) => {
      const { data } = await api.patch<ApiResponse<{ stop: IntracityStop }>>(
        `/admin/transport/intracity/stops/${stopId}`,
        dto,
      );
      return { stop: data.data.stop, routeId };
    },
    onSuccess: ({ routeId }) => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}

// ─── Delete Stop ──────────────────────────────────────────────────────────────
export function useDeleteStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stopId, routeId }: { stopId: string; routeId: string }) => {
      await api.delete(`/admin/transport/intracity/stops/${stopId}`);
      return routeId;
    },
    onSuccess: (routeId) => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}

// ─── Reorder Stop ─────────────────────────────────────────────────────────────
export function useReorderStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      stopId,
      routeId,
      new_order,
    }: {
      stopId: string;
      routeId: string;
      new_order: number;
    }) => {
      const { data } = await api.patch<ApiResponse<{ stop: IntracityStop }>>(
        `/admin/transport/intracity/stops/${stopId}/reorder`,
        { new_order },
      );
      return { stop: data.data.stop, routeId };
    },
    onSuccess: ({ routeId }) => {
      queryClient.invalidateQueries({ queryKey: intracityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intracityKeys.lists() });
    },
  });
}
