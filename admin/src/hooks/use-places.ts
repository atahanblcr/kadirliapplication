'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type {
  Place,
  PlaceCategory,
  PlaceFilters,
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto,
  CreatePlaceDto,
  UpdatePlaceDto,
} from '@/types';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const placeKeys = {
  all: ['places'] as const,
  categories: () => [...placeKeys.all, 'categories'] as const,
  places: () => [...placeKeys.all, 'list'] as const,
  placeList: (filters: PlaceFilters) => [...placeKeys.places(), filters] as const,
  detail: (id: string) => [...placeKeys.all, 'detail', id] as const,
};

// ── KATEGORİLER ───────────────────────────────────────────────────────────────

export function usePlaceCategories() {
  return useQuery({
    queryKey: placeKeys.categories(),
    queryFn: async () => {
      const res = await api.get('/admin/places/categories');
      return res.data.data.categories as PlaceCategory[];
    },
  });
}

export function useCreatePlaceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreatePlaceCategoryDto) => {
      const res = await api.post('/admin/places/categories', dto);
      return res.data.data.category as PlaceCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.categories() });
      toast({ title: 'Kategori oluşturuldu.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Kategori oluşturulamadı.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useUpdatePlaceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: UpdatePlaceCategoryDto & { id: string }) => {
      const res = await api.patch(`/admin/places/categories/${id}`, dto);
      return res.data.data.category as PlaceCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.categories() });
      toast({ title: 'Kategori güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Kategori güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useDeletePlaceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/places/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.categories() });
      toast({ title: 'Kategori silindi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Kategori silinemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── MEKANLAR ──────────────────────────────────────────────────────────────────

export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: placeKeys.placeList(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category_id) params.set('category_id', filters.category_id);
      if (filters.is_active !== undefined)
        params.set('is_active', String(filters.is_active));
      if (filters.is_free !== undefined)
        params.set('is_free', String(filters.is_free));
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));

      const res = await api.get(`/admin/places?${params.toString()}`);
      return res.data.data as { places: Place[]; meta: any };
    },
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreatePlaceDto) => {
      const res = await api.post('/admin/places', dto);
      return res.data.data.place as Place;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      toast({ title: 'Mekan oluşturuldu.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Mekan oluşturulamadı.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: UpdatePlaceDto & { id: string }) => {
      const res = await api.patch(`/admin/places/${id}`, dto);
      return res.data.data.place as Place;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      queryClient.invalidateQueries({ queryKey: placeKeys.all });
      toast({ title: 'Mekan güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Mekan güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/places/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      toast({ title: 'Mekan silindi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Mekan silinemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── FOTOĞRAFLAR ───────────────────────────────────────────────────────────────

export function useAddPlaceImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file_ids }: { id: string; file_ids: string[] }) => {
      const res = await api.post(`/admin/places/${id}/images`, { file_ids });
      return res.data.data.place as Place;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      toast({ title: 'Fotoğraflar eklendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Fotoğraf eklenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useDeletePlaceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId }: { imageId: string; placeId: string }) => {
      await api.delete(`/admin/places/images/${imageId}`);
    },
    onSuccess: (_, { placeId }) => {
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(placeId) });
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      toast({ title: 'Fotoğraf silindi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Fotoğraf silinemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useSetPlaceCoverImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId }: { imageId: string; placeId: string }) => {
      const res = await api.patch(`/admin/places/images/${imageId}/set-cover`);
      return res.data.data.place as Place;
    },
    onSuccess: (_, { placeId }) => {
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(placeId) });
      queryClient.invalidateQueries({ queryKey: placeKeys.places() });
      toast({ title: 'Kapak fotoğrafı güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Kapak fotoğrafı güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

export function useReorderPlaceImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ordered_ids }: { id: string; ordered_ids: string[] }) => {
      const res = await api.patch(`/admin/places/${id}/images/reorder`, { ordered_ids });
      return res.data.data.place as Place;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(id) });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Sıralama güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}
