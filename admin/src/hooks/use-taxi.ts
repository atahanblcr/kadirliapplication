'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TaxiDriver, TaxiFilters, PaginatedMeta } from '@/types';

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const taxiKeys = {
  all: ['taxi'] as const,
  lists: () => [...taxiKeys.all, 'list'] as const,
  list: (filters: TaxiFilters) => [...taxiKeys.lists(), filters] as const,
  detail: (id: string) => [...taxiKeys.all, 'detail', id] as const,
};

// ─── Query: Liste ──────────────────────────────────────────────────────────────

export function useTaxiDrivers(filters: TaxiFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.is_active !== undefined) params.set('is_active', String(filters.is_active));
  if (filters.is_verified !== undefined) params.set('is_verified', String(filters.is_verified));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: taxiKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: { drivers: TaxiDriver[]; meta: PaginatedMeta };
      }>(`/admin/taxi?${params.toString()}`);
      return data.data;
    },
  });
}

// ─── Mutation: Oluştur ─────────────────────────────────────────────────────────

export function useCreateTaxiDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: {
      name: string;
      phone: string;
      plaka?: string;
      vehicle_info?: string;
      registration_file_id?: string;
      license_file_id?: string;
      is_active?: boolean;
      is_verified?: boolean;
    }) => {
      const { data } = await api.post<{
        success: boolean;
        data: { driver: TaxiDriver };
      }>('/admin/taxi', dto);
      return data.data.driver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxiKeys.lists() });
    },
  });
}

// ─── Mutation: Güncelle ────────────────────────────────────────────────────────

export function useUpdateTaxiDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...dto
    }: Partial<{
      name: string;
      phone: string;
      plaka: string;
      vehicle_info: string;
      registration_file_id: string;
      license_file_id: string;
      is_active: boolean;
      is_verified: boolean;
    }> & { id: string }) => {
      const { data } = await api.patch<{
        success: boolean;
        data: { driver: TaxiDriver };
      }>(`/admin/taxi/${id}`, dto);
      return data.data.driver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxiKeys.lists() });
    },
  });
}

// ─── Mutation: Sil ─────────────────────────────────────────────────────────────

export function useDeleteTaxiDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/taxi/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxiKeys.lists() });
    },
  });
}
