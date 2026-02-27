# KadirliApp Admin Panel

Next.js 14 + Tailwind CSS + shadcn/ui ile geliştirilmiş production-ready admin dashboard.

---

## 📋 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- Backend API running at `http://localhost:3000/v1`

### Kurulum

```bash
# Bağımlılıkları yükle
npm ci

# Environment dosyası oluştur
cp .env.example .env.local
```

### `.env.local` Konfigürasyonu

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Çalıştırma

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Production mode'de çalıştır
npm start
```

**Admin Panel:** `http://localhost:3001`
**Login:** `admin@kadirliapp.com` / `Admin123a`

---

## 🧪 Testing

```bash
# Component tests (coming soon)
npm run test

# Build test
npm run build

# ESLint check
npm run lint

# TypeScript type check
npx tsc --noEmit
```

---

## 📦 16 Modül (100% Tamamlandı)

### Core Modules
- **Dashboard** — KPI charts, pending approvals, user stats
- **Settings** — Theme (Light/Dark), admin profile, password change

### Content Management
- **Announcements** — Create, list, edit, delete with targeting
- **Ads** — Approval workflow, list, detail, status management
- **Deaths** — Death notices, cemeteries, mosques, auto-archive management
- **Campaigns** — Create campaigns, quick-add businesses, QR codes
- **Events** — Create, filter by city, local/external distinction
- **Guide** — Hierarchical categories + guide items (max 2 levels)
- **Places** — Businesses with categories, image gallery, coordinates

### User & System Management
- **Users** — Ban/unban users, role management, list with filters
- **Neighborhoods** — Create, edit, delete neighborhoods and villages
- **Pharmacy** — On-duty pharmacies, monthly schedule calendar
- **Transport** — Intercity routes, intracity routes with stops
- **Taxi** — Taxi drivers with random ordering
- **Complaints** — Review, resolve, reject complaints with priority
- **Scrapers** — Log viewer for scraper activities (legacy)

---

## 🎨 UI Components

- **shadcn/ui:** 19+ pre-built components
- **Tailwind CSS:** Responsive design
- **React Hook Form:** Form management with validation
- **TanStack React Query:** Data fetching and caching
- **Zod:** Schema validation

### Key Components
- Modals/Dialogs (create, edit, confirm)
- Data tables with pagination
- Form builders (CRUD operations)
- Image galleries (drag-drop reordering)
- Calendar widgets (pharmacy schedules)

---

## 🏗️ Proje Yapısı

```
app/
├── (auth)/                - Login page
├── (dashboard)/           - Dashboard and modules
│   ├── dashboard/         - Dashboard page
│   ├── announcements/     - Announcements module
│   ├── ads/               - Ads module
│   ├── deaths/            - Deaths module
│   ├── campaigns/         - Campaigns module
│   ├── events/            - Events module
│   ├── guide/             - Guide module
│   ├── places/            - Places module
│   ├── users/             - Users module
│   ├── neighborhoods/     - Neighborhoods module
│   ├── pharmacy/          - Pharmacy module
│   ├── transport/         - Transport module
│   ├── taxi/              - Taxi module
│   ├── complaints/        - Complaints module
│   └── settings/          - Settings page
├── api/                   - API routes (auth, etc)
└── layout.tsx             - Root layout

components/
├── ui/                    - shadcn/ui components
├── [module]/              - Module-specific components
└── common/                - Shared components

hooks/
├── use-auth.ts            - Auth hook
├── use-[module].ts        - Module hooks (mutations/queries)
└── use-settings.ts        - Settings hook

types/
├── index.ts               - Type definitions
├── api.ts                 - API response types

lib/
├── api-client.ts          - API client with headers
├── validators.ts          - Zod schemas
└── utils.ts               - Helper functions
```

---

## 🔒 Authentication

### Login Flow
1. User enters email + password
2. Backend returns JWT token
3. Token stored in localStorage
4. Automatically added to all API requests
5. Auto-logout on 401 Unauthorized

### Default Credentials
```
Email: admin@kadirliapp.com
Password: Admin123a
```

---

## 📡 API Integration

### Base URL
```
http://localhost:3000/v1
```

### API Client
- **Library:** Axios
- **Auth:** JWT Bearer Token (localStorage)
- **Error Handling:** Global interceptors
- **Response Format:** Consistent with backend

### Response Structure
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "total": 50,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-27T10:00:00Z",
    "path": "/announcements"
  }
}
```

---

## 🎯 Key Features

### Dashboard
- KPI cards (total users, announcements, pending approvals)
- Growth charts (last 30 days)
- Pending items (ads awaiting approval, etc.)

### CRUD Operations
- **Create:** Forms with validation (Zod)
- **Read:** Tables with pagination and filters
- **Update:** Edit modals with pre-filled data
- **Delete:** Soft delete with confirmation

### Advanced Features
- **Image Management:** Upload, crop, drag-drop reordering
- **Category Hierarchy:** Parent-child relationships with circular-ref protection
- **Schedule Management:** Calendar view for pharmacy duties
- **Drag-Drop:** Transport stops reordering
- **Search & Filter:** Full-text search, multi-select filters
- **Status Workflows:** Approval states, priority levels

---

## 🌓 Theme Management

```bash
# Light mode (default)
# Dark mode (next-themes)
```

Setting is persisted in localStorage and synced across tabs.

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Build
```bash
docker build -t kadirliapp-admin:1.0 .
docker run -p 3001:3000 --env-file .env.local kadirliapp-admin:1.0
```

### Environment Variables (Production)
```env
NEXT_PUBLIC_API_URL=https://api.kadirliapp.com
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Production Checklist
- [ ] `.env.local` with production API URL
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passing (`npm run lint`)
- [ ] Build size acceptable
- [ ] All routes prerendered

---

## 📊 Performance

- **Next.js 14:** App Router (streaming, partial prerendering)
- **Code Splitting:** Per-route code splitting
- **Image Optimization:** next/image for responsive images
- **Caching:** React Query with stale-while-revalidate

---

## 🔗 Referanslar

- **API Endpoints:** `/docs/04_API_ENDPOINTS_MASTER.md`
- **UI Wireframes:** `/docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md`
- **Development Rules:** `/CLAUDE.md`

---

**Framework:** Next.js 14 (App Router)
**UI Library:** shadcn/ui + Tailwind CSS
**State Management:** TanStack React Query
**Forms:** React Hook Form + Zod
**HTTP Client:** Axios
