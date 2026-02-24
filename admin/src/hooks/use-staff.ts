'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  AdminStaff,
  StaffFilters,
  CreateStaffDto,
  UpdateStaffDto,
  UpdateStaffPermissionsDto,
  ResetStaffPasswordDto,
  PaginatedMeta,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffFilters) => [...staffKeys.lists(), filters] as const,
  detail: (id: string) => [...staffKeys.all, 'detail', id] as const,
};

// ─── Staff List ──────────────────────────────────────────────────────────────
export function useStaff(filters: StaffFilters = {}) {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.search) params.set('search', filters.search);
      if (filters.role) params.set('role', filters.role);
      if (typeof filters.is_active === 'boolean') params.set('is_active', String(filters.is_active));

      const { data } = await api.get<
        ApiResponse<{ data: AdminStaff[]; meta: PaginatedMeta }>
      >(`/admin/staff?${params.toString()}`);
      return { items: data.data.data, meta: data.data.meta };
    },
  });
}

// ─── Staff Detail ────────────────────────────────────────────────────────────
export function useStaffDetail(id: string | null) {
  return useQuery({
    queryKey: staffKeys.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminStaff>>(`/admin/staff/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// ─── Create Staff ────────────────────────────────────────────────────────────
export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateStaffDto) => {
      const { data } = await api.post<ApiResponse<AdminStaff>>('/admin/staff', dto);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// ─── Update Staff ────────────────────────────────────────────────────────────
export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateStaffDto) => {
      const { data } = await api.patch<ApiResponse<AdminStaff>>(`/admin/staff/${id}`, dto);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
    },
  });
}

// ─── Update Staff Permissions ────────────────────────────────────────────────
export function useUpdateStaffPermissions(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateStaffPermissionsDto) => {
      const { data } = await api.patch<ApiResponse<AdminStaff>>(
        `/admin/staff/${id}/permissions`,
        dto,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
    },
  });
}

// ─── Deactivate Staff ────────────────────────────────────────────────────────
export function useDeactivateStaff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/admin/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
    },
  });
}

// ─── Reset Staff Password ────────────────────────────────────────────────────
export function useResetStaffPassword(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ResetStaffPasswordDto) => {
      const { data } = await api.patch<ApiResponse<AdminStaff>>(
        `/admin/staff/${id}/reset-password`,
        dto,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
    },
  });
}
