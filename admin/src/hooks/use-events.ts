'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { AdminEvent, EventCategory, EventFilters, PaginatedMeta } from '@/types';

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  categories: () => [...eventKeys.all, 'categories'] as const,
};

// ─── Query: Kategori Listesi ───────────────────────────────────────────────────

export function useEventCategories() {
  return useQuery({
    queryKey: eventKeys.categories(),
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: { categories: EventCategory[] };
      }>('/admin/events/categories');
      return data.data.categories;
    },
  });
}

// ─── Query: Etkinlik Listesi ───────────────────────────────────────────────────

export function useEvents(filters: EventFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category_id) params.set('category_id', filters.category_id);
  if (filters.start_date) params.set('start_date', filters.start_date);
  if (filters.end_date) params.set('end_date', filters.end_date);
  if (filters.status) params.set('status', filters.status);
  if (filters.is_local !== undefined) params.set('is_local', String(filters.is_local));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: { events: AdminEvent[]; meta: PaginatedMeta };
      }>(`/admin/events?${params.toString()}`);
      return data.data;
    },
  });
}

// ─── Mutation: Kategori Oluştur ────────────────────────────────────────────────

export function useCreateEventCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { name: string; icon?: string }) => {
      const { data } = await api.post<{
        success: boolean;
        data: { category: EventCategory };
      }>('/admin/events/categories', dto);
      return data.data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.categories() });
    },
  });
}

// ─── Mutation: Oluştur ────────────────────────────────────────────────────────

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<AdminEvent> & {
      title: string;
      event_date: string;
      event_time: string;
    }) => {
      const { data } = await api.post<{
        success: boolean;
        data: { event: AdminEvent };
      }>('/admin/events', dto);
      return data.data.event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

// ─── Mutation: Güncelle ────────────────────────────────────────────────────────

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<AdminEvent> & { id: string }) => {
      const { data } = await api.patch<{
        success: boolean;
        data: { event: AdminEvent };
      }>(`/admin/events/${id}`, dto);
      return data.data.event;
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(event.id) });
    },
  });
}

// ─── Mutation: Sil ────────────────────────────────────────────────────────────

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}
