# KadirliApp Backend

NestJS + TypeScript + PostgreSQL + Redis ile geliştirilmiş production-ready backend API.

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

# Docker'ı başlat (PostgreSQL + Redis)
docker-compose up -d

# Database migration'ları çalıştır
npm run typeorm migration:run

# (Opsiyonal) Seed data yükle
npm run seed
```

### Çalıştırma

```bash
# Development mode (watch + hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

**API Base:** `http://localhost:3000/v1`
**Admin Login:** `admin@kadirliapp.com` / `Admin123a`

---

## 🧪 Testing

### Unit Tests (742 test)
```bash
# Tüm unit testleri çalıştır
npm test

# Coverage raporu görüntüle
npm run test:cov

# Belirli bir dosyayı test et
npm test auth.service
```

### E2E Tests (24 test)
```bash
# Real PostgreSQL database'i kullanan E2E testleri
npm run test:e2e

# Belirli E2E test dosyasını çalıştır
npm run test:e2e -- auth
```

**Coverage Target:** 75% (statements + branches)

---

## 📦 Modüller (17 Toplam)

### Core Modules
- **auth** — JWT + OTP authentication, admin login
- **users** — Profile management, notifications preferences
- **files** — File upload/delete with multipart support

### Feature Modules
- **announcements** — Create, list, targeting, soft delete
- **ads** — Create, list, favorites, extend, categories
- **deaths** — Death notices, cemetery/mosque management, auto-archive
- **campaigns** — Campaigns with QR codes and redemption
- **pharmacy** — On-duty pharmacies, monthly schedules
- **events** — Local/external events with categories
- **taxi** — Taxi drivers (RANDOM ordering)
- **transport** — Intercity + Intracity routes with stops
- **guide** — Hierarchical guide categories and items
- **places** — Businesses with location search (Haversine)
- **neighborhoods** — Neighborhood/village management
- **notifications** — FCM tokens and push notifications
- **jobs** — Background jobs and scheduled tasks

### Admin Module
- **admin** — 11 domain-specific admin services (enterprise refactored)
  - complaints-admin, users-admin, deaths-admin, transport-admin, etc.

---

## 🔌 Önemli Endpoints

### Authentication
```
POST /auth/request-otp          - OTP gönder (dev: 123456)
POST /auth/verify-otp           - OTP doğrula
POST /auth/register             - Kayıt + token
POST /auth/refresh              - Token yenile
POST /auth/admin/login          - Admin login (email/password)
```

### Users
```
GET  /users/me                  - Profile bilgileri
PATCH /users/me                 - Profil güncelle
PATCH /users/me/notifications   - Bildirim tercihleri
```

### Admin Endpoints (20+)
```
GET  /admin/dashboard           - KPI ve istatistikler
GET  /admin/approvals           - Onay bekleyen içerik
POST /admin/ads/:id/approve     - İlan onayla
POST /admin/ads/:id/reject      - İlan reddet

# Admin CRUD endpoints (campaigns, users, taxi, pharmacy, vb...)
GET/POST/PATCH/DELETE /admin/[module]/...
```

---

## 🔒 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kadirliapp
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT & Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600
OTP_EXPIRATION_SECONDS=300
OTP_MAX_ATTEMPTS=3

# SMS Provider (dev: always returns 123456)
SMS_PROVIDER=netgsm
SMS_API_KEY=your-key
SMS_SENDER_ID=KadirliApp

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key

# File Upload
MAX_FILE_SIZE=20971520  # 20MB

# CORS
CORS_ORIGIN=http://localhost:3001,https://admin.kadirliapp.com

# Node Environment
NODE_ENV=development
```

---

## 🏗️ Proje Yapısı

```
src/
├── auth/                  - Authentication module
├── users/                 - User management
├── [feature-modules]/     - Feature-specific modules
├── admin/                 - Admin panel endpoints + 11 admin services
├── database/
│   ├── entities/          - TypeORM entities
│   └── migrations/        - Database migrations
├── common/
│   ├── filters/           - Exception filters
│   ├── interceptors/      - Response transformers
│   ├── guards/            - JWT & role guards
│   └── decorators/        - Custom decorators
└── config/                - Environment validation
```

---

## 🔐 İş Kuralları

### Taksi Modülü
- **Sıralama:** `ORDER BY RANDOM()` — rank/order kolonu YOK!

### Duyurular
- **Manual duyurular:** Otomatik `status = 'published'`
- **Scraping duyurular:** `status = 'draft'` (onay bekler)
- **Description:** Plain text only (HTML yasak)

### İlanlar
- **Yeni ilan:** `expires_at = NOW() + 7 gün`
- **Uzatma:** Reklam izle → +1 gün (max 3×)
- **Kategori:** Leaf category zorunlu

### Vefat İlanları
- **Auto-archive:** `funeral_date + 7 gün` otomatik silme
- **Cron job:** Her gün 03:00'te çalışır

### Mahalle Hedefleme
- **Format:** `string[]` array (JSON columns)
- **Örnek:** `["merkez", "akdam"]`

---

## 🚀 Deployment

### Docker Build
```bash
docker build -t kadirliapp-backend:1.0 .
docker run -p 3000:3000 --env-file .env kadirliapp-backend:1.0
```

### Production Checklist
- [ ] `.env` dosyası production values'lar ile güncellendi
- [ ] Database backup'ı alındı
- [ ] JWT_SECRET strong value'la set edildi
- [ ] SMS provider configured ve test edildi
- [ ] Firebase credentials loaded
- [ ] CORS_ORIGIN updated for production domain

---

## 📊 Test Coverage

**Current:** 78.82% (742 unit + 24 E2E = 1045+ test)
**Target:** 75% (PASSED ✅)

**Coverage Breakdown:**
- Auth module: 88.88%
- Users module: 100%
- Admin module: Enterprise refactored (77% test setup reduction)
- Support modules: 90%+ coverage

---

## 🔗 Referanslar

- **API Documentation:** `/docs/04_API_ENDPOINTS_MASTER.md`
- **Database Schema:** `/docs/01_DATABASE_SCHEMA_FULL.sql`
- **Architecture Decisions:** `/MEMORY_BANK/decisions.md`

---

**Framework:** NestJS 10 + TypeScript
**Database:** PostgreSQL 15 + TypeORM
**Cache:** Redis 7
**Auth:** JWT + OTP
**Testing:** Jest + Supertest
