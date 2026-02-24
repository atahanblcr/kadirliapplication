'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ApiResponse,
  Ad,
  AdListItem,
  AdCategory,
  AdFilters,
  AdminApprovalsResponse,
  PaginatedMeta,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const adKeys = {
  all: ['ads'] as const,
  lists: () => [...adKeys.all, 'list'] as const,
  list: (filters: AdFilters) => [...adKeys.lists(), filters] as const,
  pending: () => [...adKeys.all, 'pending'] as const,
  detail: (id: string) => [...adKeys.all, 'detail', id] as const,
  categories: () => ['ad-categories'] as const,
};

// ─── Pending Ads (Admin Approvals) ───────────────────────────────────────────
export function usePendingAds() {
  return useQuery({
    queryKey: adKeys.pending(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminApprovalsResponse>>('/admin/approvals');
      // Backend: { approvals: [{type:'ad'|'death'|'campaign', ...}], total, page, limit }
      return (data.data.approvals ?? []).filter((a) => a.type === 'ad') as unknown as AdListItem[];
    },
    refetchInterval: 30_000, // otomatik 30 saniyede refresh
  });
}

// ─── Approved/All Ads ────────────────────────────────────────────────────────
export function useAds(filters: AdFilters = {}) {
  return useQuery({
    queryKey: adKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.category_id) params.set('category_id', filters.category_id);
      if (filters.search) params.set('search', filters.search);
      if (filters.sort) params.set('sort', filters.sort);

      const { data } = await api.get<
        ApiResponse<{ ads: AdListItem[]; meta: PaginatedMeta }>
      >(`/ads?${params.toString()}`);
      return { items: data.data.ads, meta: data.data.meta };
    },
  });
}

// ─── Ad Detail ───────────────────────────────────────────────────────────────
export function useAd(id: string | null) {
  return useQuery({
    queryKey: adKeys.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ ad: Ad }>>(`/ads/${id}`);
      return data.data.ad;
    },
    enabled: !!id,
  });
}

// ─── Ad Categories ────────────────────────────────────────────────────────────
export function useAdCategories() {
  return useQuery({
    queryKey: adKeys.categories(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ categories: AdCategory[] }>>(
        '/ads/categories',
      );
      return data.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Approve ─────────────────────────────────────────────────────────────────
export function useApproveAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<{ ad: Ad }>>(
        `/admin/ads/${id}/approve`,
      );
      return data.data.ad;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
  });
}

// ─── Reject ──────────────────────────────────────────────────────────────────
export function useRejectAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.post<ApiResponse<{ ad: Ad }>>(
        `/admin/ads/${id}/reject`,
        { rejected_reason: reason },
      );
      return data.data.ad;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
  });
}

// ─── Delete (soft) ───────────────────────────────────────────────────────────
export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/ads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
  });
}
