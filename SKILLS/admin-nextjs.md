# SKILL: Next.js 14 Admin Panel

**Amaç:** Next.js 14 App Router ile professional admin panel

---

## 🎯 TECH STACK

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod
- TanStack Query (React Query)
- Axios

---

## 📁 PROJECT STRUCTURE
```
admin/
├── app/
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Landing/Redirect)
│   │
│   ├── (auth)/
│   │   ├── layout.tsx (Auth layout - centered)
│   │   └── login/
│   │       └── page.tsx (Login screen)
│   │
│   └── (dashboard)/
│       ├── layout.tsx (Sidebar + Topbar)
│       ├── page.tsx (Dashboard)
│       │
│       ├── announcements/
│       │   ├── page.tsx (List)
│       │   ├── [id]/
│       │   │   └── page.tsx (Detail)
│       │   └── new/
│       │       └── page.tsx (Create)
│       │
│       ├── ads/
│       │   ├── page.tsx (Moderation)
│       │   └── [id]/
│       │       └── page.tsx (Detail)
│       │
│       ├── deaths/
│       ├── campaigns/
│       ├── users/
│       └── settings/
│
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── kpi-card.tsx
│   └── shared/
│
├── lib/
│   ├── api.ts (Axios instance)
│   ├── utils.ts
│   └── constants.ts
│
└── hooks/
    ├── useAuth.ts
    └── useAnnouncements.ts
```

---

## 🔐 AUTHENTICATION
```typescript
// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor - Add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      // If fail, redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## 🎨 LAYOUT PATTERN
```typescript
// app/(dashboard)/layout.tsx
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 DATA FETCHING
```typescript
// hooks/useAnnouncements.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAnnouncements(params) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/announcements', { params });
      return data.data;
    },
  });
}
```

---

## 📝 FORM HANDLING
```typescript
// components/announcements/announcement-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  type_id: z.string().uuid(),
  title: z.string().min(10).max(200),
  body: z.string().min(10).max(2000),
  priority: z.enum(['low', 'normal', 'high', 'emergency']),
  target_type: z.enum(['all', 'neighborhoods', 'users']),
  target_neighborhoods: z.array(z.string()).optional(),
});

export function AnnouncementForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await api.post('/v1/announcements', data);
  };

  return (
    <Form {...form}>
      {/* form fields */}
    </Form>
  );
}
```

---

## 🎨 STYLING RULES
```typescript
// ✅ DOĞRU: Tailwind utility classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// ❌ YANLIŞ: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

---

## 📱 RESPONSIVE DESIGN
```typescript
// Mobile first
<div className="
  flex flex-col     // Mobile: column
  md:flex-row       // Tablet+: row
  lg:gap-8          // Desktop: larger gap
">
```

---

## ✅ BEST PRACTICES

1. **Server Components by Default**
   - Use 'use client' only when needed (forms, hooks)

2. **Loading States**
   - Always show loading indicators

3. **Error Boundaries**
   - Wrap async components

4. **Type Safety**
   - Define types for all API responses

5. **Code Splitting**
   - Use dynamic imports for heavy components

---

**KULLAN:** Admin panel yazmadan önce bu skill'i oku!
EOFADMIN

echo "✅ admin-nextjs.md oluşturuldu!"
```

---

## 🎯 TAM HAZIRLIK PLANI:

### 1. Backend Test Et (Şimdi - 15 dakika)
```
Yukarıdaki test prompt'unu Claude'a ver
→ Tüm endpoint'leri test etsin
→ Sonuçları raporlasın
