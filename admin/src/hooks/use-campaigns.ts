'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Campaign, CampaignFilters, PaginatedMeta } from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
};

// ─── Campaigns List (Admin) ───────────────────────────────────────────────────
export function useCampaigns(filters: CampaignFilters = {}) {
  return useQuery({
    queryKey: campaignKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page)        params.set('page',        String(filters.page));
      if (filters.limit)       params.set('limit',       String(filters.limit));
      if (filters.status)      params.set('status',      filters.status);
      if (filters.search)      params.set('search',      filters.search);
      if (filters.business_id) params.set('business_id', filters.business_id);

      const { data } = await api.get<ApiResponse<{ campaigns: Campaign[]; meta: PaginatedMeta }>>(
        `/admin/campaigns?${params.toString()}`,
      );
      return { items: data.data.campaigns, meta: data.data.meta };
    },
    // Pending tab'da 30 saniyede bir otomatik yenile
    refetchInterval: filters.status === 'pending' ? 30_000 : false,
  });
}

// ─── Approve ─────────────────────────────────────────────────────────────────
export function useApproveCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(
        `/admin/campaigns/${id}/approve`,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

// ─── Reject ──────────────────────────────────────────────────────────────────
export function useRejectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason, note }: { id: string; reason: string; note?: string }) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(
        `/admin/campaigns/${id}/reject`,
        { reason, note },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────
export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}
