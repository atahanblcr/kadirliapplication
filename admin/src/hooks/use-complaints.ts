'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Complaint, ComplaintFilters } from '@/types';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const complaintKeys = {
  all: ['complaints'] as const,
  list: (filters: ComplaintFilters) => [...complaintKeys.all, 'list', filters] as const,
  detail: (id: string) => [...complaintKeys.all, 'detail', id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────

export function useComplaints(filters: ComplaintFilters) {
  return useQuery({
    queryKey: complaintKeys.list(filters),
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
      );
      const res = await api.get('/admin/complaints', { params });
      return res.data.data as { complaints: Complaint[]; meta: any };
    },
  });
}

// ── Detail ────────────────────────────────────────────────────────────────────

export function useComplaintDetail(id: string | null) {
  return useQuery({
    queryKey: complaintKeys.detail(id ?? ''),
    queryFn: async () => {
      const res = await api.get(`/admin/complaints/${id}`);
      return res.data.data.complaint as Complaint;
    },
    enabled: !!id,
  });
}

// ── Review ────────────────────────────────────────────────────────────────────

export function useReviewComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/admin/complaints/${id}/review`);
      return res.data.data.complaint as Complaint;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
      queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) });
      toast({ title: 'Şikayet incelemeye alındı.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İşlem başarısız.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── Resolve ───────────────────────────────────────────────────────────────────

export function useResolveComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, admin_response }: { id: string; admin_response: string }) => {
      const res = await api.patch(`/admin/complaints/${id}/resolve`, {
        status: 'resolved',
        admin_response,
      });
      return res.data.data.complaint as Complaint;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
      queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) });
      toast({ title: 'Şikayet çözüldü.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İşlem başarısız.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── Reject ────────────────────────────────────────────────────────────────────

export function useRejectComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, admin_response }: { id: string; admin_response: string }) => {
      const res = await api.patch(`/admin/complaints/${id}/reject`, {
        status: 'rejected',
        admin_response,
      });
      return res.data.data.complaint as Complaint;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
      queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) });
      toast({ title: 'Şikayet reddedildi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İşlem başarısız.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── Update Priority ───────────────────────────────────────────────────────────

export function useUpdateComplaintPriority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: string }) => {
      const res = await api.patch(`/admin/complaints/${id}/priority`, { priority });
      return res.data.data.complaint as Complaint;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
      queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) });
      toast({ title: 'Öncelik güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'İşlem başarısız.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}
