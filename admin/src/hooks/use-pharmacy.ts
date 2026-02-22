'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Pharmacy, PharmacySchedule } from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const pharmacyKeys = {
  all: ['pharmacy'] as const,
  lists: () => [...pharmacyKeys.all, 'list'] as const,
  listSearch: (search?: string) => [...pharmacyKeys.lists(), { search }] as const,
  schedule: (start: string, end: string) => [...pharmacyKeys.all, 'schedule', start, end] as const,
};

// ─── Pharmacies List (Admin) ──────────────────────────────────────────────────
export function usePharmacies(search?: string) {
  return useQuery({
    queryKey: pharmacyKeys.listSearch(search),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const { data } = await api.get<ApiResponse<{ pharmacies: Pharmacy[] }>>(
        `/admin/pharmacy?${params.toString()}`,
      );
      return data.data.pharmacies;
    },
  });
}

// ─── Schedule (Admin) ─────────────────────────────────────────────────────────
export function usePharmacySchedule(startDate: string, endDate: string) {
  return useQuery({
    queryKey: pharmacyKeys.schedule(startDate, endDate),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ schedule: PharmacySchedule[] }>>(
        `/admin/pharmacy/schedule?start_date=${startDate}&end_date=${endDate}`,
      );
      return data.data.schedule;
    },
    enabled: !!startDate && !!endDate,
  });
}

// ─── Create Pharmacy ──────────────────────────────────────────────────────────
export function useCreatePharmacy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Omit<Pharmacy, 'id' | 'created_at'>) => {
      const { data } = await api.post<ApiResponse<{ pharmacy: Pharmacy }>>(
        '/admin/pharmacy',
        dto,
      );
      return data.data.pharmacy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() });
    },
  });
}

// ─── Update Pharmacy ──────────────────────────────────────────────────────────
export function useUpdatePharmacy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Pharmacy> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<{ pharmacy: Pharmacy }>>(
        `/admin/pharmacy/${id}`,
        dto,
      );
      return data.data.pharmacy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() });
    },
  });
}

// ─── Delete Pharmacy ──────────────────────────────────────────────────────────
export function useDeletePharmacy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/pharmacy/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() });
    },
  });
}

// ─── Assign Schedule ──────────────────────────────────────────────────────────
export function useAssignSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pharmacy_id, date, start_time, end_time }: {
      pharmacy_id: string;
      date: string;
      start_time?: string;
      end_time?: string;
    }) => {
      const { data } = await api.post<ApiResponse<{ schedule: PharmacySchedule }>>(
        '/admin/pharmacy/schedule',
        { pharmacy_id, date, start_time, end_time },
      );
      return data.data.schedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...pharmacyKeys.all, 'schedule'] });
    },
  });
}

// ─── Delete Schedule Entry ────────────────────────────────────────────────────
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/pharmacy/schedule/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...pharmacyKeys.all, 'schedule'] });
    },
  });
}
