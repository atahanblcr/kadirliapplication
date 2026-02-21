'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  IntercityRoute,
  IntercitySchedule,
  IntercityFilters,
  PaginatedMeta,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const intercityKeys = {
  all: ['intercity'] as const,
  lists: () => [...intercityKeys.all, 'list'] as const,
  list: (filters: IntercityFilters) => [...intercityKeys.lists(), filters] as const,
  detail: (id: string) => [...intercityKeys.all, 'detail', id] as const,
};

// ─── List ─────────────────────────────────────────────────────────────────────
export function useIntercityRoutes(filters: IntercityFilters = {}) {
  const params = new URLSearchParams();
  if (filters.company_name) params.set('company_name', filters.company_name);
  if (filters.from_city) params.set('from_city', filters.from_city);
  if (filters.to_city) params.set('to_city', filters.to_city);
  if (filters.is_active !== undefined) params.set('is_active', String(filters.is_active));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: intercityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ routes: IntercityRoute[]; meta: PaginatedMeta }>
      >(`/admin/transport/intercity?${params.toString()}`);
      return data.data;
    },
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────
export function useIntercityDetail(id: string) {
  return useQuery({
    queryKey: intercityKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ route: IntercityRoute }>>(
        `/admin/transport/intercity/${id}`,
      );
      return data.data.route;
    },
    enabled: !!id,
  });
}

// ─── Create Route ─────────────────────────────────────────────────────────────
export function useCreateIntercityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Omit<IntercityRoute, 'id' | 'created_at' | 'updated_at' | 'schedules'>) => {
      const { data } = await api.post<ApiResponse<{ route: IntercityRoute }>>(
        '/admin/transport/intercity',
        dto,
      );
      return data.data.route;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
    },
  });
}

// ─── Update Route ─────────────────────────────────────────────────────────────
export function useUpdateIntercityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<IntercityRoute> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<{ route: IntercityRoute }>>(
        `/admin/transport/intercity/${id}`,
        dto,
      );
      return data.data.route;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: intercityKeys.detail(variables.id) });
    },
  });
}

// ─── Delete Route ─────────────────────────────────────────────────────────────
export function useDeleteIntercityRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/transport/intercity/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
    },
  });
}

// ─── Add Schedule ─────────────────────────────────────────────────────────────
export function useAddSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      routeId,
      departure_time,
      days_of_week,
      is_active,
    }: {
      routeId: string;
      departure_time: string;
      days_of_week: number[];
      is_active?: boolean;
    }) => {
      const { data } = await api.post<ApiResponse<{ schedule: IntercitySchedule }>>(
        `/admin/transport/intercity/${routeId}/schedules`,
        { departure_time, days_of_week, is_active },
      );
      return data.data.schedule;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: intercityKeys.detail(result.route_id),
      });
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
    },
  });
}

// ─── Update Schedule ──────────────────────────────────────────────────────────
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      scheduleId,
      routeId,
      ...dto
    }: Partial<IntercitySchedule> & { scheduleId: string; routeId: string }) => {
      const { data } = await api.patch<ApiResponse<{ schedule: IntercitySchedule }>>(
        `/admin/transport/intercity/schedules/${scheduleId}`,
        dto,
      );
      return { schedule: data.data.schedule, routeId };
    },
    onSuccess: ({ routeId }) => {
      queryClient.invalidateQueries({ queryKey: intercityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
    },
  });
}

// ─── Delete Schedule ──────────────────────────────────────────────────────────
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ scheduleId, routeId }: { scheduleId: string; routeId: string }) => {
      await api.delete(`/admin/transport/intercity/schedules/${scheduleId}`);
      return routeId;
    },
    onSuccess: (routeId) => {
      queryClient.invalidateQueries({ queryKey: intercityKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: intercityKeys.lists() });
    },
  });
}
