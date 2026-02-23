'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type {
  ApiResponse,
  Campaign,
  CampaignFilters,
  PaginatedMeta,
  BusinessOption,
  BusinessCategory,
  CreateAdminBusinessDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
  businesses: () => [...campaignKeys.all, 'businesses'] as const,
  businessCategories: () => [...campaignKeys.all, 'business-categories'] as const,
};

// ─── Campaigns List ───────────────────────────────────────────────────────────
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
  });
}

// ─── Businesses (for form dropdown) ──────────────────────────────────────────
export function useBusinesses() {
  return useQuery({
    queryKey: campaignKeys.businesses(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ businesses: BusinessOption[] }>>(
        '/admin/campaigns/businesses',
      );
      return data.data.businesses;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
}

// ─── Business Categories (for quick-add form) ────────────────────────────────
export function useBusinessCategories() {
  return useQuery({
    queryKey: campaignKeys.businessCategories(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ categories: BusinessCategory[] }>>(
        '/admin/campaigns/businesses/categories',
      );
      return data.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Create Business Category (quick-add) ────────────────────────────────────
export function useCreateBusinessCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<ApiResponse<{ id: string; name: string }>>(
        '/admin/campaigns/businesses/categories',
        { name },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.businessCategories() });
      toast({ title: 'Kategori eklendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Kategori eklenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Create Business (quick-add) ─────────────────────────────────────────────
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAdminBusinessDto) => {
      const { data } = await api.post<ApiResponse<{ id: string; business_name: string }>>(
        '/admin/campaigns/businesses',
        dto,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.businesses() });
      toast({ title: 'İşletme oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İşletme oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateCampaignDto) => {
      const { data } = await api.post<ApiResponse<{ message: string; id: string }>>(
        '/admin/campaigns',
        dto,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      toast({ title: 'Kampanya oluşturuldu.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Kampanya oluşturulamadı.', variant: 'destructive' });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateCampaignDto }) => {
      const { data } = await api.patch<ApiResponse<{ message: string }>>(
        `/admin/campaigns/${id}`,
        dto,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      toast({ title: 'Kampanya güncellendi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Kampanya güncellenemedi.', variant: 'destructive' });
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      toast({ title: 'Kampanya silindi.' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    },
  });
}
