# KadirliApp Admin Panel

Next.js 16 + Tailwind CSS + shadcn/ui ile geliştirilmiş admin dashboard.

---

## 📋 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- Backend API çalışıyor olmalı (`http://localhost:3000/v1`)

### Kurulum

```bash
# Bağımlılıkları yükle
npm ci
```

> Not: `.env.example` dosyası yok, sadece `.env.local` mevcut. Yeni bir ortamda çalıştırırken aşağıdaki içerikle kendi `.env.local` dosyanızı oluşturun.

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Çalıştırma

```bash
npm run dev      # Development server (port 3001, hot reload)
npm run build    # Production build
npm start        # Production modunda çalıştır
```

**Admin Panel:** `http://localhost:3001`

### Giriş Bilgileri

Panel girişi backend'deki `POST /auth/admin/login` endpoint'ine email + şifre gönderir; sabit kodlanmış bir kullanıcı yoktur. Backend'i seed ettiyseniz, seed admin kullanıcısının `email` alanı boş olduğu için **şu an panele giremez** — bkz. `backend/README.md` içindeki "Seed Kullanıcıları" notu. Giriş testi için backend tarafında bu kullanıcıya bir email atayın.

---

## 🧪 Testing

```bash
npm run lint           # ESLint
npx tsc --noEmit        # TypeScript tip kontrolü
npm run build           # Build testi
```

**Mevcut durum (doğrulandı, 22 Haziran 2026):**
- TypeScript: 0 hata ✅
- ESLint: **0 hata + 38 uyarı** ✅
  - Uyarılar: kullanılmayan import'lar, `next/image` önerisi yerine `<img>` kullanımı (places, pharmacy, settings).
- Build: `npm run build` → başarılı (21 route, tümü static).
- **Otomatik test altyapısı yok** — Jest/Vitest/Playwright kurulu değil, hiçbir `*.test.tsx`/`*.spec.tsx` dosyası yok.

---

## 📦 16 Modül

| Modül | Açıklama |
|-------|----------|
| **Dashboard** | KPI kartları, kullanıcı büyüme grafiği, modül kullanım grafiği, bekleyen onaylar, son aktiviteler |
| **Ads** | İlan onay/red akışı, onaylanmış ilanlar listesi (görüntülenme, kategori, fiyat filtreleri) |
| **Announcements** | Duyuru CRUD, tip/öncelik filtresi, hedef kitle seçimi (herkes / mahalle / kullanıcı), görüntülenme sayacı |
| **Campaigns** | Kampanya CRUD, işletme ilişkisi, indirim oranı, geçerlilik tarihi, kupon kodu üretimi |
| **Complaints** | Şikayet durumu (pending/reviewing/resolved/rejected), öncelik (urgent/high/medium/low), hedef tipi filtreleme |
| **Deaths** | Vefat ilanı, mezarlık/cami yönetimi, otomatik arşivleme |
| **Events** | Etkinlik oluşturma, şehir filtresi, yerel/dış ayrımı, kategori hiyerarşisi |
| **Guide** | 2 seviyeli hiyerarşik kategori + rehber içeriği yönetimi |
| **Neighborhoods** | Mahalle/köy CRUD, nüfus, koordinat, sıralama, aktif/pasif |
| **Pharmacy** | Nöbetçi eczane, aylık takvim görünümü |
| **Places** | İşletme dizini, kategori hiyerarşisi, fotoğraf galerisi (sürükle-bırak sıralama) |
| **Settings** | Admin profil, şifre değiştirme, tema (açık/koyu) |
| **Staff** | Admin/personel hesabı oluşturma, rol atama, şifre sıfırlama, hesap aktif/pasif |
| **Taxi** | Taksi sürücü yönetimi, rastgele sıralama |
| **Transport** | Şehirlerarası + şehir içi rota/durak yönetimi (sürükle-bırak sıralama) |
| **Users** | Kullanıcı listesi, ban/unban, rol yönetimi |

> Eski README "Scrapers" modülünden bahsediyordu — kod tabanında bu modüle ait bir route yok (legacy/kaldırılmış). Bunun yerine **Staff** modülü mevcut ve önceki README'de hiç bahsedilmemişti.

---

## 🎨 UI & Kütüphaneler

- **shadcn/ui** (Radix UI tabanlı) — component primitive'leri (`src/components/ui/`)
- **TanStack React Query 5** — veri çekme/cache
- **React Hook Form 7 + Zod 4** — form state ve validasyon
- **Axios** — HTTP client
- **@dnd-kit** — sürükle-bırak (transport durakları, görsel galerisi)
- **Recharts** — dashboard grafikleri
- **next-themes** — açık/koyu tema
- **date-fns** — Türkçe tarih formatlama
- **js-cookie** — token saklama
- **sonner** — toast bildirimleri
- **Tailwind CSS 4**

### Component Yapısı
```
src/components/
├── dashboard/    - kpi-cards, user-growth-chart, module-usage-chart,
│                   quick-actions, pending-approvals, recent-activity
├── transport/    - intercity/intracity form, detail, schedule, stop dialog'ları
├── ui/           - shadcn/ui primitive'leri
├── dashboard-layout.tsx, providers.tsx, sidebar.tsx, topbar.tsx
```
Diğer modüllere özel component'ler (ads, announcements, campaigns, vb.) merkezi bir klasörde değil, kendi `app/(dashboard)/[module]/` dizinleri içinde tutuluyor.

### Hooks (18)
`use-auth`, `use-ads`, `use-announcements`, `use-campaigns`, `use-complaints`, `use-deaths`, `use-events`, `use-guide`, `use-neighborhoods`, `use-pharmacy`, `use-places`, `use-settings`, `use-staff`, `use-taxi`, `use-users`, `use-intercity`, `use-intracity`, `use-toast` — hepsi TanStack Query üzerine kurulu.

---

## 🏗️ Proje Yapısı

```
src/app/
├── (auth)/login/             - Login sayfası
├── (dashboard)/
│   ├── dashboard/  ads/  announcements/  campaigns/  complaints/
│   ├── deaths/  events/  guide/  neighborhoods/  pharmacy/
│   ├── places/  settings/  staff/  taxi/  transport/  users/
└── layout.tsx

src/hooks/        - Modül başına veri hook'u (yukarıdaki liste)
src/components/   - dashboard/, transport/, ui/, layout component'leri
src/lib/          - api client, validators, utils
```

---

## 🔒 Authentication

### Login Akışı
1. Kullanıcı email + şifre girer (Zod ile client-side validasyon)
2. `POST /auth/admin/login`'e istek atılır
3. Yanıt: `access_token`, `refresh_token`, `user`
4. Token'lar **cookie'de** saklanır (`sameSite=strict`) — localStorage değil
5. Axios interceptor her isteğe token ekler
6. 401 yanıtında otomatik logout

---

## 🚀 Deployment

```bash
npm run build
docker build -t kadirliapp-admin:1.0 .
docker run -p 3001:3000 --env-file .env.local kadirliapp-admin:1.0
```

### Production Checklist
- [ ] `.env.local` production `NEXT_PUBLIC_API_URL` ile güncellendi
- [ ] `npm run build` başarılı
- [ ] `npm run lint` — 0 hata
- [ ] `npx tsc --noEmit` hatasız

---

## 🔗 Referanslar

- **API Endpoints:** `/docs/04_API_ENDPOINTS_MASTER.md`
- **UI Wireframes:** `/docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md`

---

**Framework:** Next.js 16 (App Router) + React 19
**UI:** shadcn/ui (Radix) + Tailwind CSS 4
**State:** TanStack React Query 5
**Forms:** React Hook Form 7 + Zod 4
**HTTP Client:** Axios
