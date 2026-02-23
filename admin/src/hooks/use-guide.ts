'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type {
  GuideCategory,
  GuideItem,
  GuideItemFilters,
  CreateGuideCategoryDto,
  UpdateGuideCategoryDto,
  CreateGuideItemDto,
  UpdateGuideItemDto,
} from '@/types';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const guideKeys = {
  all: ['guide'] as const,
  categories: () => [...guideKeys.all, 'categories'] as const,
  items: () => [...guideKeys.all, 'items'] as const,
  itemList: (filters: GuideItemFilters) =>
    [...guideKeys.items(), filters] as const,
};

// ── KATEGORİLER ───────────────────────────────────────────────────────────────

export function useGuideCategories() {
  return useQuery({
    queryKey: guideKeys.categories(),
    queryFn: async () => {
      const res = await api.get('/admin/guide/categories');
      return res.data.data.categories as GuideCategory[];
    },
  });
}

export function useCreateGuideCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateGuideCategoryDto) => {
      const res = await api.post('/admin/guide/categories', dto);
      return res.data.data.category as GuideCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.categories() });
      toast({ title: 'Kategori oluşturuldu.' });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ?? 'Kategori oluşturulamadı.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useUpdateGuideCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...dto
    }: UpdateGuideCategoryDto & { id: string }) => {
      const res = await api.patch(`/admin/guide/categories/${id}`, dto);
      return res.data.data.category as GuideCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.categories() });
      toast({ title: 'Kategori güncellendi.' });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ?? 'Kategori güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useDeleteGuideCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/guide/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.categories() });
      toast({ title: 'Kategori silindi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Kategori silinemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── İÇERİKLER ─────────────────────────────────────────────────────────────────

export function useGuideItems(filters: GuideItemFilters = {}) {
  return useQuery({
    queryKey: guideKeys.itemList(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category_id) params.set('category_id', filters.category_id);
      if (filters.is_active !== undefined)
        params.set('is_active', String(filters.is_active));
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));

      const res = await api.get(`/admin/guide/items?${params.toString()}`);
      return res.data.data as { items: GuideItem[]; meta: any };
    },
  });
}

export function useCreateGuideItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateGuideItemDto) => {
      const res = await api.post('/admin/guide/items', dto);
      return res.data.data.item as GuideItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.items() });
      toast({ title: 'İçerik oluşturuldu.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İçerik oluşturulamadı.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useUpdateGuideItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...dto
    }: UpdateGuideItemDto & { id: string }) => {
      const res = await api.patch(`/admin/guide/items/${id}`, dto);
      return res.data.data.item as GuideItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.items() });
      toast({ title: 'İçerik güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İçerik güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useDeleteGuideItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/guide/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.items() });
      toast({ title: 'İçerik silindi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İçerik silinemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}
