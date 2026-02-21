'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import type { AdminUser, LoginRequest } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const storedUser = Cookies.get('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { data } = await api.post('/auth/admin/login', credentials);
    const { accessToken, refreshToken, user: userData } = data.data;

    Cookies.set('accessToken', accessToken, { sameSite: 'strict' });
    Cookies.set('refreshToken', refreshToken, { sameSite: 'strict' });
    Cookies.set('user', JSON.stringify(userData), { sameSite: 'strict' });

    setUser(userData);
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, loading, login, logout };
}
