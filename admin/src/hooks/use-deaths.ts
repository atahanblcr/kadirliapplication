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
  CreateCemeteryDto,
  UpdateCemeteryDto,
  CreateMosqueDto,
  UpdateMosqueDto,
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

// ─── Create Cemetery ─────────────────────────────────────────────────────────
export function useCreateCemetery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateCemeteryDto) => {
      const { data } = await api.post<ApiResponse<{ cemetery: Cemetery }>>(
        '/admin/deaths/cemeteries',
        dto,
      );
      return data.data.cemetery;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.cemeteries });
      toast({ title: 'Mezarlık oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mezarlık oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Update Cemetery ─────────────────────────────────────────────────────────
export function useUpdateCemetery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateCemeteryDto }) => {
      const { data } = await api.patch<ApiResponse<{ cemetery: Cemetery }>>(
        `/admin/deaths/cemeteries/${id}`,
        dto,
      );
      return data.data.cemetery;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.cemeteries });
      toast({ title: 'Mezarlık güncellendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mezarlık güncellenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Delete Cemetery ─────────────────────────────────────────────────────────
export function useDeleteCemetery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/deaths/cemeteries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.cemeteries });
      toast({ title: 'Mezarlık silindi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mezarlık silinemedi.', variant: 'destructive' });
    },
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

// ─── Create Mosque ───────────────────────────────────────────────────────────
export function useCreateMosque() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateMosqueDto) => {
      const { data } = await api.post<ApiResponse<{ mosque: Mosque }>>(
        '/admin/deaths/mosques',
        dto,
      );
      return data.data.mosque;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.mosques });
      toast({ title: 'Cami oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Cami oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Update Mosque ───────────────────────────────────────────────────────────
export function useUpdateMosque() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateMosqueDto }) => {
      const { data } = await api.patch<ApiResponse<{ mosque: Mosque }>>(
        `/admin/deaths/mosques/${id}`,
        dto,
      );
      return data.data.mosque;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.mosques });
      toast({ title: 'Cami güncellendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Cami güncellenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Delete Mosque ───────────────────────────────────────────────────────────
export function useDeleteMosque() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/deaths/mosques/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deathKeys.mosques });
      toast({ title: 'Cami silindi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Cami silinemedi.', variant: 'destructive' });
    },
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
