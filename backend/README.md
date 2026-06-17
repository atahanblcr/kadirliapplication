# KadirliApp Backend

NestJS 11 + TypeScript + PostgreSQL + Redis ile geliştirilmiş REST API.

---

## 📋 Hızlı Başlangıç

### Gereksinimler
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (Docker ile otomatik)
- Redis 7 (Docker ile otomatik)

### Kurulum

```bash
# Bağımlılıkları yükle
npm ci

# Environment dosyası oluştur
cp .env.example .env

# Docker'ı başlat (PostgreSQL + Redis) — docker-compose.yml repo kökünde
cd .. && docker-compose up -d && cd backend

# Database migration'ları çalıştır
npm run migration:run

# (Opsiyonel) Seed data yükle
npm run seed
```

### Çalıştırma

```bash
# Development mode (watch + hot reload)
npm run start:dev

# Production mode (önce build et)
npm run build
npm run start:prod
```

**API Base:** `http://localhost:3000/v1` (global prefix `v1`, bkz. `src/main.ts`)
**Swagger/OpenAPI:** Kurulu değil — endpoint dokümantasyonu için `/docs/04_API_ENDPOINTS_MASTER.md`'ye bakın.

---

## 🔐 Seed Kullanıcıları

`npm run seed` (`scripts/seed.ts`) şu kullanıcıları oluşturur:

| Rol | Telefon | Şifre |
|-----|---------|-------|
| SUPER_ADMIN | `+905500000001` | `Admin123!` |
| USER (test) | `05551234567` | `User123!` |

> ⚠️ **Önemli:** `POST /auth/admin/login` endpoint'i kullanıcıyı **email** alanına göre arar (bkz. `src/auth/auth.service.ts:adminLogin`), ancak seed script'i admin kullanıcısına bir `email` set etmiyor. Yani seed'den gelen admin, şu anda admin paneline **email/şifre ile giriş yapamaz** — panele giriş testi yapmadan önce bu kullanıcıya manuel olarak bir `email` atayın (veya seed script'ini güncelleyin). Normal kullanıcı girişi (`/auth/request-otp` → `/auth/verify-otp`) telefon numarası ile çalışır ve bu sorundan etkilenmez.

---

## 🧪 Testing

### Unit Tests
```bash
npm test                 # Tüm unit testleri çalıştır
npm run test:watch       # Watch mode
npm run test:cov         # Coverage raporu
npm run test:debug       # Node inspector ile debug
npm test -- auth.service # Belirli bir dosyayı test et
```

**Mevcut durum:** 58 test suite, 1045 test — hepsi geçiyor (`npx jest`).

### E2E Tests
```bash
npm run test:e2e         # test/jest-e2e.json konfigürasyonu, gerçek PostgreSQL kullanır
```

**Mevcut durum:** 3 E2E spec dosyası — `test/app.e2e-spec.ts`, `test/e2e/auth.e2e-spec.ts`, `test/e2e/admin-neighborhoods.e2e-spec.ts`.

**Coverage hedefi:** %75 (statements + branches), CI'da zorunlu.

---

## 📦 Modüller

### İş Modülleri (15)
- **auth** — JWT + OTP authentication (Redis rate limiting), admin email/password login
- **users** — Profil, mahalle, bildirim tercihleri, 30 günlük kullanıcı adı değişim kısıtı
- **files** — Multipart dosya upload/delete (10 MB limit, jpeg/png/webp/pdf), local disk storage
- **announcements** — Duyuru oluştur, listele, hedefleme, soft delete
- **ads** — İlan oluştur, ara, favoriler, kategori, uzatma (reklam izleyerek)
- **deaths** — Vefat ilanları, mezarlık/cami CRUD, otomatik arşivleme (cron)
- **campaigns** — Kampanya oluştur, QR kod, redemption takibi
- **pharmacy** — Nöbetçi eczane, aylık takvim
- **events** — Yerel/dış etkinlikler, kategori, şehir filtreleme
- **taxi** — Taksi sürücü dizini (`ORDER BY RANDOM()` sıralama)
- **transport** — Şehirlerarası + şehir içi rota ve durak yönetimi
- **guide** — Hiyerarşik rehber kategorileri ve içerikleri
- **places** — İşletme dizini, Haversine formülü ile konum arama
- **notifications** — FCM token kaydı, bildirim listesi/okundu işaretleme
- **admin** — Admin paneli endpoint'leri (aşağıda detay)

> Not: "Neighborhoods" (mahalle) ayrı bir modül **değildir** — CRUD işlemleri `admin/admin.service.ts` içinde, `GET /admin/neighborhoods` ise (`@SkipAuth`) kayıt formunda kullanılmak üzere public'tir.

### Altyapı Klasörleri
- **common** — Pagination util, telefon validasyonu, exception filter, response interceptor, guard'lar, decorator'lar
- **database** — TypeORM `data-source.ts`, entity'ler, migration'lar

### Admin Modülü (11 domain-specific servis)
`admin.service.ts` (dashboard, onaylar, ilan onay/red, mahalle CRUD, admin profil) dışında, enterprise refactoring ile ayrılmış servisler:
```
campaign-admin.service.ts      complaints-admin.service.ts
deaths-admin.service.ts        event-admin.service.ts
guide-admin.service.ts         pharmacy-admin.service.ts
places-admin.service.ts        staff-admin.service.ts
taxi-admin.service.ts          transport-admin.service.ts
users-admin.service.ts
```

---

## 🔌 Auth Endpoints

```
POST /auth/request-otp     - Telefona OTP gönder (rate limit: 10/saat, Redis)
POST /auth/verify-otp      - OTP doğrula → kayıt için temp token döner
POST /auth/register        - Temp token ile kayıt tamamla → access + refresh token
POST /auth/refresh         - Refresh token ile yeni access token al
POST /auth/logout          - Çıkış (JWT zorunlu, FCM token opsiyonel temizlenir)
POST /auth/admin/login     - Email + şifre ile admin/staff girişi
```

**Token ömrü:** access token 30 gün, refresh token 90 gün.
**OTP dev modu:** `OTP_DEV_MODE=true` iken kod her zaman `123456`, SMS gönderilmez.

Diğer tüm endpoint'ler için: `/docs/04_API_ENDPOINTS_MASTER.md`

---

## 🔒 Environment Variables

`.env.example` dosyasındaki gerçek bölümler:

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# Database (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=kadirliapp
DATABASE_USER=kadirliapp_user
DATABASE_PASSWORD=your_strong_password_here
DATABASE_SYNCHRONIZE=false   # production'da her zaman false
DATABASE_LOGGING=false
DATABASE_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=min-64-karakter-güçlü-secret
JWT_EXPIRES_IN=30d
JWT_REFRESH_SECRET=min-64-karakter-güçlü-secret
JWT_REFRESH_EXPIRES_IN=90d

# OTP
OTP_TTL_SECONDS=300
OTP_RATE_LIMIT_PER_HOUR=10
OTP_MAX_ATTEMPTS=3
OTP_BLOCK_DURATION_MINUTES=5
OTP_DEV_MODE=true            # true: SMS yerine kod=123456

# SMS Sağlayıcı
SMS_API_KEY=
SMS_API_SECRET=
SMS_SENDER=KADIRLI

# Dosya Depolama (R2/CDN — şu an kullanılmıyor, kod local disk'e yazıyor)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=kadirliapp
R2_PUBLIC_URL=
CDN_BASE_URL=

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:3002
```

> Not: `R2_*`/`CDN_BASE_URL` değişkenleri `.env.example`'da tanımlı ama `files.service.ts` şu anda dosyaları `./uploads` altına local disk'e yazıyor — Cloudflare R2/CDN entegrasyonu henüz koda bağlanmamış.

---

## 🏗️ Proje Yapısı

```
src/
├── auth/                  - OTP + JWT + admin login
├── users/                 - Kullanıcı profili
├── files/                 - Dosya upload/delete
├── [diğer iş modülleri]/  - ads, announcements, deaths, campaigns, pharmacy,
│                            events, taxi, transport, guide, places, notifications
├── admin/                 - Admin endpoint'leri + 11 domain-specific servis
├── database/
│   ├── entities/          - TypeORM entity'leri
│   ├── migrations/        - Migration dosyaları
│   └── data-source.ts     - TypeORM DataSource (CLI + seed için)
└── common/
    ├── filters/           - HttpExceptionFilter
    ├── interceptors/      - TransformInterceptor (response format)
    ├── guards/            - JwtAuthGuard, RolesGuard, PermissionGuard
    ├── decorators/         - @CurrentUser, @Roles, @SkipAuth
    └── utils/              - pagination.util.ts, phone.util.ts
```

---

## 🔐 İş Kuralları

### Taksi Modülü
- **Sıralama:** `ORDER BY RANDOM()` — sabit bir rank/order kolonu yok.

### Duyurular
- **Manuel duyurular:** Otomatik `status = 'published'`.
- **Scraping duyurular:** `status = 'draft'` (admin onayı bekler).
- **Description:** Sadece düz metin (HTML yasak).

### İlanlar
- **Yeni ilan:** `expires_at = NOW() + 7 gün`.
- **Uzatma:** Reklam izle → +1 gün (max 3 kez).
- **Kategori:** Leaf (yaprak) kategori zorunlu.

### Vefat İlanları
- **Auto-archive:** `funeral_date + 7 gün` sonrası otomatik arşivlenir.
- **Cron job:** Her gün 03:00'te çalışır (`@Cron(CronExpression.EVERY_DAY_AT_3AM)`).

### Mahalle Hedefleme
- **Format:** `string[]` array (JSON kolon).
- **Örnek:** `["merkez", "akdam"]`.

### Dosya Upload
- **Limit:** 10 MB (Multer ve servis seviyesinde aynı limit).
- **İzin verilen tipler:** jpeg, png, webp, pdf.
- **Silme:** Soft delete (DB) + fiziksel dosya `./uploads` altından silinir.

---

## 🚀 Deployment

### Docker Build
```bash
docker build -t kadirliapp-backend:1.0 .
docker run -p 3000:3000 --env-file .env kadirliapp-backend:1.0
```

### Production Checklist
- [ ] `.env` production değerleri ile güncellendi
- [ ] `DATABASE_SYNCHRONIZE=false` (migration'lar manuel çalıştırılır)
- [ ] `JWT_SECRET` / `JWT_REFRESH_SECRET` güçlü, benzersiz değerler
- [ ] `OTP_DEV_MODE=false` ve gerçek SMS sağlayıcı yapılandırıldı
- [ ] Firebase credentials yüklendi
- [ ] `CORS_ORIGINS` production domain'leri içeriyor
- [ ] Admin kullanıcısına gerçek bir `email` atandı (yukarıdaki uyarıya bakın)

---

## 🔗 Referanslar

- **API Documentation:** `/docs/04_API_ENDPOINTS_MASTER.md`
- **Database Schema:** `/docs/02_ERD_DIAGRAM.md`, `/docs/03_DATABASE_DOCUMENTATION.md`
- **Deployment Guide:** `/docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md`
- **Architecture Decisions:** `/MEMORY_BANK/decisions.md`

---

**Framework:** NestJS 11 + TypeScript 5.7
**Database:** PostgreSQL 15 + TypeORM 0.3
**Cache/Queue:** Redis (ioredis 5) + Bull
**Auth:** JWT (Passport) + OTP
**Testing:** Jest 30 + Supertest
