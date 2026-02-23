# Progress Tracker - Proje İlerlemesi

**Proje Başlangıcı:** 20 Şubat 2026
**Son Güncelleme:** 23 Şubat 2026 (Quick-Add Business & Categories)

---

## 📊 Genel İlerleme

```
Backend:      [██████████] 100% ✅ (15 feature module + admin login, 492 test, 85.13% coverage)
Admin Panel:  [█████████░]  95% (Layout + Login + Dashboard + 9 modül tamamlandı)
Flutter App:  [░░░░░░░░░░]   0% (Başlanmadı)
Testing:      [██████████] 100% ✅ (492 test, 33 test suite)
Deployment:   [░░░░░░░░░░]   0% (Başlanmadı)
```

**Toplam İlerleme:** ~80% (Backend 100%, Admin Panel %95)

### Campaign Quick-Add Business + Categories (23 Şubat 2026) ✅
**Backend:**
- ✅ Migration: `businesses.user_id` nullable yapıldı
- ✅ `POST /admin/campaigns/businesses` - user olmadan işletme oluştur (4 alan)
- ✅ `GET /admin/campaigns/businesses/categories` - kategori dropdown
- ✅ `POST /admin/campaigns/businesses/categories` - yeni kategori (name only, auto-slug)
- ✅ Slug auto-generation: Türkçe karakterler dönüştürülür (ş→s, ü→u, vs), çakışmada suffix

**Frontend:**
- ✅ `useCreateBusiness()` + `useBusinessCategories()` + `useCreateBusinessCategory()` hooks
- ✅ `quick-add-business-dialog.tsx` - 4 alan form + inline kategori ekleme
- ✅ Inline kategori: [+] butonu → Input + Check + X buttons (Esc/Enter)
- ✅ Yeni işletme/kategori oluşturulunca otomatik seçilir
- ✅ 15 seed kategori: Gıda, Restoran, Eczane, Sağlık, Tekstil, Elektrik, Yapı, Oto, Güzellik, Eğitim, Hukuk, Tarım, Mobilya, Diğer

**Test:**
- ✅ GET /categories → [Gıda, Restoran, ...]
- ✅ POST /businesses → { id, name }
- ✅ POST /categories → { id, name }

### Ulaşım (Transport) Admin Panel Modülü (22 Şubat 2026) ✅
- ✅ Backend migration: 11 yeni kolon (company_name, from_city, contact_phone, contact_website, amenities, days_of_week, color, fare, neighborhood_id, latitude, longitude)
- ✅ Backend: transport-admin.controller.ts (16 endpoint - intercity/intracity CRUD + schedules + stops + reorder)
- ✅ Backend: AdminService'e transport repository + tüm metotlar eklendi
- ✅ Frontend types: IntercitySchedule, IntercityRoute, IntercityFilters, IntracityStop, IntracityRoute, IntracityFilters
- ✅ Frontend hooks: use-intercity.ts (7 hook) + use-intracity.ts (7 hook)
- ✅ Frontend bileşenler: intercity-form, schedule-dialog, intercity-detail-modal, intracity-form, stop-dialog, intracity-detail-modal, intercity-page, intracity-page
- ✅ @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities yüklendi (sürükle-bırak durak sıralama)
- ✅ Docker rebuild + restart + API endpoint testleri hepsi geçti

### Audit Düzeltmeleri + AdminController Refaktörü (22 Şubat 2026) ✅
- ✅ Campaign backend endpoint eksikliği giderildi (GET/approve/reject/DELETE /admin/campaigns/*)
- ✅ Campaign entity alan adı uyumsuzlukları düzeltildi (discount_percentage→discount_rate, start_date→valid_from, end_date→valid_until, discount_code→code, code_view_count→code_views)
- ✅ Campaign image_urls doğru çekiliyor (campaign.images[].file.cdn_url)
- ✅ Frontend Campaign tipine rejected_reason?: string eklendi
- ✅ AdminController modülerleştirildi: campaign-admin.controller.ts, users-admin.controller.ts, pharmacy-admin.controller.ts
- ✅ admin.controller.ts sadece core (dashboard/approvals/ads approve+reject/scrapers)
- ✅ admin.controller.spec.ts güncellendi (taşınan metotlar çıkarıldı)
- ✅ Backend TypeScript: 0 hata (bizimle ilgili), Frontend: 0 hata

### Nöbetçi Eczane Admin Panel Modülü (22 Şubat 2026) ✅
- ✅ Backend DTOs: create-pharmacy.dto.ts, update-pharmacy.dto.ts, assign-schedule.dto.ts
- ✅ Backend: GET/POST/PATCH/DELETE /admin/pharmacy + GET/POST/DELETE /admin/pharmacy/schedule
- ✅ Frontend hook: use-pharmacy.ts (7 hook)
- ✅ Frontend sayfa: 2 Tab (Eczaneler + Nöbet Takvimi), özel aylık takvim bileşeni
- ✅ PharmacyForm: Sheet form (controlled inputs, shadcn Form yok)
- ✅ ScheduleDialog: nöbet ata/değiştir/sil

### Kullanıcı Yönetimi Admin Panel Modülü (22 Şubat 2026) ✅
- ✅ Backend: GET /admin/users, GET /admin/users/:id, POST ban/unban, PATCH role
- ✅ Frontend hook: use-users.ts (5 hook)
- ✅ Frontend utils: user-utils.tsx (UserRoleBadge, UserStatusBadge, BAN_REASONS, BAN_DURATIONS)
- ✅ Frontend sayfa: Stats + filters + table + quick ban dialog
- ✅ Frontend modal: user-detail-modal.tsx (ban/unban/rol değiştir)

### Kampanyalar Admin Panel Modülü (22 Şubat 2026) ✅
- ✅ Backend: campaign-admin.controller.ts (GET/approve/reject/DELETE)
- ✅ Backend: campaign admin metotları AdminService'e eklendi
- ✅ Frontend hook: use-campaigns.ts (useCampaigns 30s auto-refresh, approve/reject/delete)
- ✅ Frontend utils: campaign-utils.tsx (CampaignStatusBadge, CAMPAIGN_REJECTION_REASONS, formatDiscountRate, formatValidityRange)
- ✅ Frontend sayfa: Stats bar + 3 sekme (Bekleyen/Onaylı/Reddedilen) + arama + pagination
- ✅ Frontend modal: campaign-detail-modal.tsx (image gallery, kod görüntüleme, onayla/reddet/sil)

### Vefat İlanları Admin Panel Modülü (22 Şubat 2026) ✅
- ✅ Backend: GET /deaths/admin (status/search filtreli, pagination)
- ✅ Backend: POST /deaths/:id/approve, POST /deaths/:id/reject (reason+note), DELETE /deaths/:id
- ✅ Frontend types: DeathNotice, Cemetery, Mosque, DeathFilters, DeathStatus → types/index.ts
- ✅ Frontend hook: use-deaths.ts (useDeaths, useApproveDeath, useRejectDeath, useDeleteDeath)
- ✅ Frontend utils: death-utils.tsx (DeathStatusBadge, DEATH_REJECTION_REASONS, formatFuneralDate, calculateArchiveDaysLeft)
- ✅ Frontend sayfa: deaths/page.tsx - 3 sekme, arama, per-tab pagination, acil uyarı (arşiv 1 gün kaldıysa)
- ✅ Frontend modal: deaths/death-detail-modal.tsx - fotoğraf, bilgi grid, harita linki, onayla/reddet/sil
- ✅ Docker rebuild + restart: tüm deaths routes aktif

### Admin Login Fix (22 Şubat 2026) ✅
- ✅ User entity: email + password kolonları eklendi
- ✅ POST /auth/admin/login - email/password ile JWT token üretimi
- ✅ Admin kullanıcısı: admin@kadirliapp.com / Admin123! (SUPER_ADMIN)
- ✅ Admin panel API uyumu: snake_case (access_token/refresh_token) düzeltildi

---

## 🖥️ Admin Panel Setup ✅ (21 Şubat 2026)

### Next.js 14 Proje Kurulumu ✅
- ✅ Next.js 14 (App Router + TypeScript + Tailwind CSS)
- ✅ shadcn/ui (19 bileşen: Button, Card, Input, Badge, Avatar, DropdownMenu, Sheet, Table, Textarea, Dialog, Separator, ScrollArea, Tooltip, Select, Tabs, Switch, Skeleton, Alert, Label)
- ✅ Dependencies: axios, @tanstack/react-query, react-hook-form, @hookform/resolvers, zod, recharts, lucide-react, js-cookie, date-fns

### Admin Panel Sayfalar ✅
- ✅ Login sayfası (/login) - Email/password form, Zod validation, error handling
- ✅ Dashboard sayfası (/) - KPI kartları, kullanıcı büyüme grafiği, modül kullanım grafiği, hızlı işlemler, bekleyen onaylar, son aktiviteler
- ✅ Layout: Collapsible sidebar (15 menü) + Topbar (notifications + user dropdown)
- ✅ Auth: JWT token management (cookies), refresh token, auto-redirect
- ✅ API client: Axios instance with interceptors
- ✅ Mock data: Dashboard istatistikleri (backend entegrasyonu sonrası değişecek)

---

## ✅ Tamamlanan Görevler

### Backend Setup

#### 1. NestJS Proje Kurulumu ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~15 dakika
**Git Commit:** `feat: NestJS backend initial setup`

**Yapılanlar:**
- ✅ NestJS CLI ile proje oluşturuldu
- ✅ Bağımlılıklar yüklendi (@nestjs/typeorm, @nestjs/jwt, @nestjs/bull, ioredis, class-validator, vb.)
- ✅ `.env.example` oluşturuldu (tüm değişkenler)
- ✅ `docker-compose.yml` oluşturuldu (PostgreSQL 15 + Redis 7)
- ✅ `src/main.ts` güncellendi (ValidationPipe, CORS, GlobalFilters, GlobalInterceptors)
- ✅ `src/app.module.ts` güncellendi (TypeORM, BullMQ, Throttler)

#### 2. Common Katmanı ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~10 dakika

**Dosyalar:**
- ✅ `common/enums/user-role.enum.ts`
- ✅ `common/filters/http-exception.filter.ts`
- ✅ `common/interceptors/transform.interceptor.ts`
- ✅ `common/decorators/roles.decorator.ts`
- ✅ `common/decorators/current-user.decorator.ts`
- ✅ `common/utils/pagination.util.ts`
- ✅ `common/utils/phone.util.ts`

#### 3. TypeORM Entities ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~20 dakika

**Dosyalar:**
- ✅ `database/entities/user.entity.ts`
- ✅ `database/entities/neighborhood.entity.ts`
- ✅ `database/entities/file.entity.ts`
- ✅ `database/entities/announcement.entity.ts`
- ✅ `database/entities/announcement-type.entity.ts`
- ✅ `database/entities/ad.entity.ts`
- ✅ `database/entities/ad-category.entity.ts`
- ✅ `database/entities/taxi-driver.entity.ts`
- ✅ `database/entities/death-notice.entity.ts`
- ✅ `database/entities/pharmacy.entity.ts`
- ✅ `database/entities/notification.entity.ts`

#### 4. Auth Module ✅ (100% Test Coverage)
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~25 dakika + ~30 dakika testler
**Test Coverage:** 88.88% (69 test geçti)

**Dosyalar:**
- ✅ `auth/dto/request-otp.dto.ts`
- ✅ `auth/dto/verify-otp.dto.ts`
- ✅ `auth/dto/register.dto.ts`
- ✅ `auth/strategies/jwt.strategy.ts`
- ✅ `auth/guards/jwt-auth.guard.ts`
- ✅ `auth/guards/roles.guard.ts`
- ✅ `auth/auth.service.ts` (OTP Redis, rate limiting, JWT)
- ✅ `auth/auth.controller.ts` (5 endpoint)
- ✅ `auth/auth.module.ts`
- ✅ `auth/auth.service.spec.ts` (100% coverage)
- ✅ `auth/auth.controller.spec.ts` (100% coverage)
- ✅ `auth/strategies/jwt.strategy.spec.ts` (100% coverage)
- ✅ `auth/guards/roles.guard.spec.ts` (100% coverage)

#### 5. Users Module ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~10 dakika

**Dosyalar:**
- ✅ `users/dto/update-user.dto.ts`
- ✅ `users/dto/update-notifications.dto.ts`
- ✅ `users/users.service.ts` (aylık değişiklik kontrolü)
- ✅ `users/users.controller.ts` (3 endpoint)
- ✅ `users/users.module.ts`

#### 6. Announcements Module ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~45 dakika
**Git Commit:** `feat: implement announcements module with full CRUD and targeting`

**Dosyalar:**
- ✅ `announcements/dto/create-announcement.dto.ts` (plain text validation, array targeting)
- ✅ `announcements/dto/update-announcement.dto.ts` (PartialType + status)
- ✅ `announcements/dto/query-announcement.dto.ts` (sayfalama + filtreler)
- ✅ `announcements/announcements.service.ts` (7 metod: findAll, findTypes, findOne, create, update, remove, send)
- ✅ `announcements/announcements.controller.ts` (7 endpoint)
- ✅ `announcements/announcements.module.ts`
- ✅ `announcements/announcements.service.spec.ts` (Stmts: 97.26%)
- ✅ `announcements/announcements.controller.spec.ts` (Stmts: 100%)

**Test Sonuçları:** 48 test, Stmts: 90.35%, Branch: 79.16%, Funcs: 94.44%, Lines: 91.66%

**Önemli İş Kuralları:**
- Manuel duyuru → status='published' otomatik
- Plain text body (HTML yasak - Matches regex ile)
- Mahalle hedefleme → string[] array (JSONB @> operatörü)
- Soft delete (deleted_at)

---

#### 7. Auth Module Unit Testleri ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~30 dakika
**Git Commit:** `test: add auth module unit tests with 85%+ coverage`

**Test Dosyaları:**
- ✅ `auth/auth.service.spec.ts` (Stmts: 100%, Branch: 90%, Funcs: 100%, Lines: 100%)
- ✅ `auth/auth.controller.spec.ts` (Stmts: 100%, Branch: 79%, Funcs: 100%, Lines: 100%)
- ✅ `auth/strategies/jwt.strategy.spec.ts` (Stmts: 100%, Branch: 86%, Funcs: 100%, Lines: 100%)
- ✅ `auth/guards/roles.guard.spec.ts` (Stmts: 100%, Branch: 83%, Funcs: 100%, Lines: 100%)

**Toplam:** 69 test, Auth klasörü: Stmts: 88.88%, Branch: 85.71%, Funcs: 88.23%, Lines: 89.85%

---

#### 11. Deaths Module ✅ (Cron Auto-Archive + Testler)
**Tamamlanma:** 20 Şubat 2026
**Git Commit:** `feat: implement Deaths module with cron auto-archive + tests`

**5 Endpoint:**
- ✅ `GET /deaths` → onaylı ilanlar, funeral_date filtresi, pagination
- ✅ `GET /deaths/:id` → detay (cemetery, mosque, photo_file relations)
- ✅ `POST /deaths` → oluştur (status=pending, auto_archive_at=funeral+7gün, 2/gün limit)
- ✅ `GET /deaths/cemeteries` → aktif mezarlıklar (public)
- ✅ `GET /deaths/mosques` → aktif camiler (public)

**Cron Job:**
- ✅ `@Cron(EVERY_DAY_AT_3AM)` → `auto_archive_at <= NOW()` soft delete

**İş Kuralları:**
- auto_archive_at = funeral_date + 7 gün
- cemetery_id veya mosque_id en az biri zorunlu
- Günlük limit: 2 vefat ilanı/user
- @nestjs/schedule + ScheduleModule.forRoot() eklendi

**Test:** 22 test, service: 100% Stmts / 86% Branch, controller: 100% Stmts

---

#### 10. Ads Module ✅ (En Karmaşık Modül + Testler)
**Tamamlanma:** 20 Şubat 2026
**Git Commit:** `feat: implement Ads module with full CRUD, favorites, extensions, search`

**14 Endpoint:**
- ✅ `GET /ads` → filtreleme (kategori, fiyat aralığı), ILIKE search, sıralama, pagination
- ✅ `GET /ads/:id` → detay + view_count increment
- ✅ `GET /ads/categories` → hiyerarşik kategoriler (parent_id)
- ✅ `GET /ads/categories/:id/properties` → dinamik kategori özellikleri
- ✅ `POST /ads` → ilan oluştur (status=pending, expires_at=+7gün, 10/gün limit, 1-5 fotoğraf)
- ✅ `PATCH /ads/:id` → güncelle (owner only, approved→pending re-moderation)
- ✅ `DELETE /ads/:id` → soft delete (owner only)
- ✅ `POST /ads/:id/extend` → reklam izle uzat (1 reklam=1 gün, max 3 uzatma)
- ✅ `POST /ads/:id/favorite` → favoriye ekle (max 30)
- ✅ `DELETE /ads/:id/favorite` → favoriden çıkar
- ✅ `GET /users/me/ads` → benim ilanlarım (status filtresi)
- ✅ `GET /users/me/favorites` → favorilerim
- ✅ `POST /ads/:id/track-phone` → telefon tıklama sayacı
- ✅ `POST /ads/:id/track-whatsapp` → WhatsApp tıklama + URL

**İş Kuralları:**
- expires_at = NOW() + 7 gün (yeni ilan)
- 1 reklam izleme = 1 gün uzatma, extension_count++, max_extensions=3
- Günlük limit: 10 ilan/user (createQueryBuilder count)
- Fotoğraf: 1-5 adet, cover_image_id in image_ids
- Moderation: create→pending, approved güncelleme→pending
- Favoriler: max 30, unique constraint
- Leaf category zorunlu (childCount === 0)
- Plain text description (HTML yasak)

**Test Sonuçları (ads klasörü):**
- `ads.service.ts`: Stmts: 98.8%, Branch: 92.15%, Funcs: 90%, Lines: 98.79%
- `ads.controller.ts`: Stmts: 100%, Branch: 75%, Funcs: 100%, Lines: 100%
- Toplam: 61 test

---

#### 9. Users Module ✅ (Tam + Testler)
**Tamamlanma:** 20 Şubat 2026
**Git Commit:** `feat: complete Users module with tests (100% Stmts, 91% Branch coverage)`

**Endpoint'ler:**
- ✅ `GET /users/me` → JWT'den gelen user + primary_neighborhood relation
- ✅ `PATCH /users/me` → username (30 gün kısıtlama), mahalle (30 gün kısıtlama), age, location_type
- ✅ `PATCH /users/me/notifications` → kısmi/tam bildirim tercihi güncelleme

**İş Kuralları:**
- username değişikliği: 30 gün kısıtlama (BadRequestException), unique kontrol (ConflictException)
- mahalle değişikliği: 30 gün kısıtlama
- updateProfile sonrası `primary_neighborhood` relation ile reload (düzeltildi)

**Test Sonuçları (users klasörü):**
- `users.service.ts`: Stmts: 100%, Branch: 91.66%, Funcs: 100%, Lines: 100%
- `users.controller.ts`: Stmts: 100%, Branch: 75%, Funcs: 100%, Lines: 100%
- Toplam: 30 test (service: 20, controller: 10)

---

#### 8. Database Entity Schema (Tam) ✅
**Tamamlanma:** 20 Şubat 2026
**Git Commit:** `feat: add complete database entity schema (30+ entities) + fix TypeScript errors`

**Yeni Entity Dosyaları (18 yeni dosya, 30+ entity):**
- ✅ `ad-extension.entity.ts`, `ad-favorite.entity.ts`, `ad-image.entity.ts`, `ad-property-value.entity.ts`
- ✅ `announcement-view.entity.ts`, `audit-log.entity.ts`
- ✅ `business-category.entity.ts`, `business.entity.ts`
- ✅ `campaign.entity.ts` (Campaign + CampaignImage + CampaignCodeView)
- ✅ `category-property.entity.ts` (CategoryProperty + PropertyOption)
- ✅ `complaint.entity.ts`, `event-category.entity.ts`, `event.entity.ts`
- ✅ `guide.entity.ts` (GuideCategory + GuideItem)
- ✅ `permission.entity.ts` (Permission + RolePermission)
- ✅ `place.entity.ts` (PlaceCategory + Place + PlaceImage)
- ✅ `power-outage.entity.ts`, `scraper-log.entity.ts`, `taxi-call.entity.ts`
- ✅ `transport.entity.ts` (IntercityRoute + IntercitySchedule + IntracityRoute + IntracityStop)
- ✅ `user-neighborhood.entity.ts`
- ✅ `ad.entity.ts` güncellendi (4 OneToMany relation eklendi)
- ✅ `taxi-driver.entity.ts` güncellendi (registration_file eklendi)

**TypeScript Düzeltmeleri:**
- ✅ JWT expiresIn: string → `as any` cast (auth.module, auth.service x4)
- ✅ secretOrKey undefined fallback: `?? ''` (jwt.strategy)
- ✅ Spread `false | object` → `details ? { details } : {}` (http-exception.filter)
- ✅ DTO→Entity type mismatch: `DeepPartial<Announcement>` cast (announcements.service)
- ✅ `null` → `null as any` for fcm_token (auth.service)

**Sonuç:** 0 TypeScript hatası, 117 test geçti

---

#### 7. Module Placeholders ✅
**Tamamlanma:** 20 Şubat 2026
**Süre:** ~5 dakika
**Git Commit:** `feat: create module placeholders`

**13 adet placeholder:**
- ✅ announcements.module.ts
- ✅ ads.module.ts
- ✅ deaths.module.ts
- ✅ pharmacy.module.ts
- ✅ events.module.ts
- ✅ campaigns.module.ts
- ✅ guide.module.ts
- ✅ places.module.ts
- ✅ transport.module.ts
- ✅ notifications.module.ts
- ✅ taxi.module.ts
- ✅ admin.module.ts
- ✅ files.module.ts

---

## ⏳ Bekleyen Modüller (ONAY SONRASI)

### Backend - Sıradaki

1. **Auth Unit Tests** (Öncelik: Yüksek)
2. **Announcements Module** (tam implementasyon)
3. **Ads Module** (en karmaşık - 3+ saat)
4. **Deaths Module** + cron job
5. **Taxi Module** (RANDOM sıralama)
6. **Pharmacy, Events, Campaigns, Guide, Places, Transport**
7. **Notifications** (FCM)
8. **Admin Module**

---

## 🐛 Çözülmüş Sorunlar

1. **Bash heredoc ile modül oluşturma hatası**
   - Çözüm: Elle yazıldı
   - Tarih: 20 Şubat 2026

---

## 📅 Zaman Çizelgesi

```
Şubat 20:    Backend Setup (BUGÜN - %20 tamamlandı)
Şubat 21-25: Backend Modüller (Announcements, Ads, Deaths, Taxi, Pharmacy)
Şubat 26-28: Backend Modüller (Events, Campaigns, Guide, Places, Transport, Notifications)
Mart 1-7:    Admin Panel
Mart 8-14:   Flutter App Auth + Ana Ekranlar
Mart 15-21:  Flutter App Tüm Modüller
Mart 22-28:  Testing + Bug Fixing
Mart 29+:    Deployment
```




