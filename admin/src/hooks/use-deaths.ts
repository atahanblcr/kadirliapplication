'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type {
  ApiResponse,
  DeathNotice,
  DeathFilters,
  PaginatedMeta,
  CreateDeathDto,
  UpdateDeathDto,
  Cemetery,
  Mosque,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const deathKeys = {
  all: ['admin-deaths'] as const,
  lists: () => [...deathKeys.all, 'list'] as const,
  list: (filters: DeathFilters) => [...deathKeys.lists(), filters] as const,
  cemeteries: ['death-cemeteries'] as const,
  mosques: ['death-mosques'] as const,
  neighborhoods: ['death-neighborhoods'] as const,
};

// ─── Deaths List ─────────────────────────────────────────────────────────────
export function useDeaths(filters: DeathFilters = {}) {
  return useQuery({
    queryKey: deathKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.search) params.set('search', filters.search);

      const { data } = await api.get<ApiResponse<{ notices: DeathNotice[]; meta: PaginatedMeta }>>(
        `/admin/deaths?${params.toString()}`,
      );
      return { items: data.data.notices, meta: data.data.meta };
    },
  });
}

// ─── Cemeteries ──────────────────────────────────────────────────────────────
export function useCemeteries() {
  return useQuery({
    queryKey: deathKeys.cemeteries,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ cemeteries: Cemetery[] }>>(
        '/admin/deaths/cemeteries',
      );
      return data.data.cemeteries;
    },
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

// ─── Mosques ─────────────────────────────────────────────────────────────────
export function useMosques() {
  return useQuery({
    queryKey: deathKeys.mosques,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ mosques: Mosque[] }>>(
        '/admin/deaths/mosques',
      );
      return data.data.mosques;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Neighborhoods ────────────────────────────────────────────────────────────
export function useDeathNeighborhoods() {
  return useQuery({
    queryKey: deathKeys.neighborhoods,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ neighborhoods: Array<{ id: string; name: string }> }>>(
        '/admin/deaths/neighborhoods',
      );
      return data.data.neighborhoods;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateDeathDto) => {
      const { data } = await api.post<ApiResponse<{ notice: DeathNotice }>>(
        '/admin/deaths',
        dto,
      );
      return data.data.notice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
      toast({ title: 'Vefat ilanı oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İlan oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export function useUpdateDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateDeathDto }) => {
      const { data } = await api.patch<ApiResponse<{ notice: DeathNotice }>>(
        `/admin/deaths/${id}`,
        dto,
      );
      return data.data.notice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
      toast({ title: 'Vefat ilanı güncellendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İlan güncellenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export function useDeleteDeath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/deaths/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.lists() });
      toast({ title: 'Vefat ilanı silindi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İlan silinemedi.', variant: 'destructive' });
    },
  });
}
