'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { ApiResponse, PaginatedMeta } from '@/types';

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  type: 'neighborhood' | 'village';
  population?: number;
  latitude?: number;
  longitude?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NeighborhoodFilters {
  search?: string;
  type?: 'neighborhood' | 'village';
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateNeighborhoodDto {
  name: string;
  type: 'neighborhood' | 'village';
  slug?: string;
  population?: number;
  latitude?: number;
  longitude?: number;
  display_order?: number;
  is_active?: boolean;
}

export type UpdateNeighborhoodDto = Partial<CreateNeighborhoodDto>;

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const neighborhoodKeys = {
  all: ['admin-neighborhoods'] as const,
  lists: () => [...neighborhoodKeys.all, 'list'] as const,
  list: (filters: NeighborhoodFilters) => [...neighborhoodKeys.lists(), filters] as const,
};

// ─── Neighborhoods List ──────────────────────────────────────────────────────
export function useNeighborhoods(filters: NeighborhoodFilters = {}) {
  return useQuery({
    queryKey: neighborhoodKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.search) params.set('search', filters.search);
      if (filters.type) params.set('type', filters.type);
      if (filters.is_active !== undefined) params.set('is_active', String(filters.is_active));

      const { data } = await api.get<ApiResponse<{ neighborhoods: Neighborhood[]; meta: PaginatedMeta }>>(
        `/admin/neighborhoods?${params.toString()}`,
      );
      return { items: data.data.neighborhoods, meta: data.data.meta };
    },
  });
}

// ─── Create ──────────────────────────────────────────────────────────────────
export function useCreateNeighborhood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateNeighborhoodDto) => {
      const { data } = await api.post<ApiResponse<{ neighborhood: Neighborhood }>>(
        '/admin/neighborhoods',
        dto,
      );
      return data.data.neighborhood;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: neighborhoodKeys.lists() });
      toast({ title: 'Mahalle oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mahalle oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Update ──────────────────────────────────────────────────────────────────
export function useUpdateNeighborhood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateNeighborhoodDto }) => {
      const { data } = await api.patch<ApiResponse<{ neighborhood: Neighborhood }>>(
        `/admin/neighborhoods/${id}`,
        dto,
      );
      return data.data.neighborhood;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: neighborhoodKeys.lists() });
      toast({ title: 'Mahalle güncellendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mahalle güncellenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────
export function useDeleteNeighborhood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/neighborhoods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: neighborhoodKeys.lists() });
      toast({ title: 'Mahalle silindi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Mahalle silinemedi.', variant: 'destructive' });
    },
  });
}
