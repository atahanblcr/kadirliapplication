'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import Cookies from 'js-cookie';

// ── Admin Profile ─────────────────────────────────────────────────────────────

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data as {
        id: string;
        email: string;
        username: string | null;
        role: string;
      };
    },
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { username: string }) => {
      const res = await api.patch('/admin/profile', dto);
      return res.data.data as { id: string; email: string; username: string; role: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] });
      // Cookie'deki user nesnesini de güncelle
      const stored = Cookies.get('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          Cookies.set('user', JSON.stringify({ ...parsed, username: data.username }), {
            sameSite: 'strict',
          });
        } catch {
          // ignore
        }
      }
      toast({ title: 'Profil güncellendi.' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Profil güncellenemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}

// ── Change Password ───────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async (dto: { current_password: string; new_password: string }) => {
      const res = await api.patch('/admin/change-password', dto);
      return res.data.data as { message: string };
    },
    onSuccess: () => {
      toast({ title: 'Şifre değiştirildi. Lütfen tekrar giriş yapın.' });
      // Şifre değişince logout
      setTimeout(() => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        window.location.href = '/login';
      }, 1500);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'Şifre değiştirilemedi.';
      toast({ title: message, variant: 'destructive' });
    },
  });
}
