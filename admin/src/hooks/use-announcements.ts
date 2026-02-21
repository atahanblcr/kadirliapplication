'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  Announcement,
  AnnouncementListItem,
  AnnouncementListResponse,
  AnnouncementType,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementFilters,
  PaginatedMeta,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters: AnnouncementFilters) => [...announcementKeys.lists(), filters] as const,
  detail: (id: string) => [...announcementKeys.all, 'detail', id] as const,
  types: () => ['announcement-types'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useAnnouncementTypes() {
  return useQuery({
    queryKey: announcementKeys.types(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ types: AnnouncementType[] }>>(
        '/announcements/types',
      );
      return data.data.types;
    },
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
}

export function useAnnouncements(filters: AnnouncementFilters = {}) {
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.type_id) params.set('type_id', filters.type_id);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.status) params.set('status', filters.status);
      if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);

      const { data } = await api.get<
        ApiResponse<AnnouncementListResponse & { meta: PaginatedMeta }>
      >(`/announcements?${params.toString()}`);
      return { items: data.data.announcements, meta: data.data.meta };
    },
  });
}

export function useAnnouncement(id: string | null) {
  return useQuery({
    queryKey: announcementKeys.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ announcement: Announcement }>>(
        `/announcements/${id}`,
      );
      return data.data.announcement;
    },
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAnnouncementDto) => {
      const { data } = await api.post<ApiResponse<{ announcement: Announcement }>>(
        '/announcements',
        dto,
      );
      return data.data.announcement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateAnnouncementDto }) => {
      const { data } = await api.patch<ApiResponse<{ announcement: Announcement }>>(
        `/announcements/${id}`,
        dto,
      );
      return data.data.announcement;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.detail(id) });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}

export function useSendAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<
        ApiResponse<{ message: string; job_id: string; estimated_recipients: number }>
      >(`/announcements/${id}/send`);
      return data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.detail(id) });
    },
  });
}
