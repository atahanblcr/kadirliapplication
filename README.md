# KadirliApp - Sosyal Ağ & Toplum Hizmetleri Platformu

![Version](https://img.shields.io/badge/version-1.0-blue) ![Status](https://img.shields.io/badge/status-production--ready-green) ![Coverage](https://img.shields.io/badge/coverage-78.8%25-green) ![Flutter](https://img.shields.io/badge/flutter-90%25-blue)

KadirliApp, mahalle sakinleri arasında haber, ilan, etkinlik ve toplum hizmetlerini paylaşan modern bir sosyal ağ platformudur.

---

## 🎯 Proje Özeti

| Bileşen | Durum | İlerleme |
|---------|-------|----------|
| **Backend (NestJS)** | ✅ Enterprise Ready | 100% (16 modül, 1045 unit + 28 E2E = 1073 test) |
| **Admin Panel (Next.js)** | ✅ Tamamlandı | 100% (16 modül, 0 Lint Error, Full CRUD) |
| **Flutter Mobile** | 🔄 Devam Ediyor | 90% (12 modül: Auth, Home, Announcements, Ads, Deaths, Events, Pharmacy, Campaigns, Guide, Places, Taxi, Profile) |
| **Testing** | ✅ Tamamlandı | Backend: 78.8%, Flutter: 85.5% coverage | CI/CD pipeline aktif |
| **DevOps & CI/CD** | ✅ Tamamlandı | Docker + GitHub Actions (backend-tests.yml, admin-build.yml) |

---

## 📦 Teknoloji Stack'i

### Backend
- **Framework:** NestJS 10 + TypeScript
- **Database:** PostgreSQL 15 + TypeORM
- **Cache:** Redis 7
- **Job Queue:** Bull MQ
- **Authentication:** JWT + OTP (SMS)
- **Testing:** Jest (1045 unit test, 28 E2E test, 78.8% coverage)

### Admin Panel
- **Framework:** Next.js 14 (App Router)
- **UI Library:** shadcn/ui (19 component)
- **Styling:** Tailwind CSS 3
- **State Management:** TanStack React Query
- **Forms:** React Hook Form + Zod

### Mobile (Sonraki Aşama)
- **Framework:** Flutter 3.x
- **State Management:** Provider / Riverpod
- **API Client:** Dio

---

## 🚀 Quick Start (Development)

### Sistem Gereksinimleri
- Docker & Docker Compose
- Node.js 20+
- Git

### 1️⃣ Repository'yi Clone Et
```bash
git clone https://github.com/your-org/kadirliapp.git
cd kadirliapp
```

### 2️⃣ Backend Kurulumu
```bash
cd backend

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# Docker'ı başlat (PostgreSQL + Redis)
docker-compose up -d
```

### 3️⃣ Database Setup
```bash
# Migrations çalıştır
npm run typeorm migration:run

# (Opsiyonal) Seed data yükle
npm run seed
```

### 4️⃣ Backend'i Başlat
```bash
npm run start:dev
```

Backend şu adreste çalışır: `http://localhost:3000`

### 5️⃣ Admin Panel Kurulumu
```bash
cd ../admin

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# Development sunucusunu başlat
npm run dev
```

Admin Panel şu adreste çalışır: `http://localhost:3001`

---

## 🔐 Varsayılan Admin Kullanıcısı

```
Email: admin@kadirliapp.com
Şifre: Admin123a
```

> ⚠️ **Uyarı:** Production'da bu kimlik bilgilerini değiştirin!

---

## 📚 Dokümantasyon

- **[Backend API Endpoints](./docs/04_API_ENDPOINTS_MASTER.md)** - 100+ endpoint (request/response örnekleri)
- **[Database Schema](./docs/01_DATABASE_SCHEMA_FULL.sql)** - 50+ tablo, ERD diagram
- **[Admin Panel Wireframes](./docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md)** - UI tasarımları
- **[Deployment Guide](./docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md)** - Production setup
- **[Project Structure](./docs/09_PROJECT_STRUCTURE.md)** - Dosya organizasyonu
- **[CLAUDE.md](./CLAUDE.md)** - Development kuralları & iş logikleri

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend

# Unit testleri çalıştır (1045 test)
npm test

# E2E testleri çalıştır (28 test, real PostgreSQL)
npm run test:e2e

# Coverage raporu
npm run test:cov
```

**Sonuç:** 1045 unit test + 28 E2E test = 1073 test ✅ | 78.8% coverage

### Admin Panel Tests
```bash
cd admin

# Component tests (soon)
npm run test
```

---

## 🔄 CI/CD Pipeline

GitHub Actions ile otomatik test ve deployment:

```yaml
.github/workflows/
├── backend-tests.yml       # Unit + E2E tests, coverage enforcement (75% requirement)
├── admin-build.yml         # Next.js build, type check, security audit
└── (Production deployment: Manual trigger with artifacts)
```

**Backend Test Suite:** 7 phases (Lint → Unit Tests → E2E Tests → Coverage → Build)
**Admin Build Suite:** 9 phases (Lint → Type Check → Build → Security Audit)

---

## 📊 Proje Modülleri

### Backend (16 Modül)
```
✅ Auth              - JWT + OTP authentication
✅ Users            - Profil, mahalle, bildirim tercihleri
✅ Ads              - İlan oluştur, ara, favoriler, uzatma
✅ Announcements    - Duyuru yayınla, targeting, soft delete
✅ Deaths           - Vefat ilanları + Mezarlık/Cami CRUD
✅ Campaigns        - Kampanya oluştur, QR kod, redemption
✅ Pharmacy         - Nöbetçi eczane, takvim
✅ Events           - Etkinlik reklamı (iç/dış)
✅ Neighborhoods    - Mahalle/köy yönetimi, tür, nüfus
✅ Taxi             - Taksi sürücü yönetimi (RANDOM sıralama)
✅ Transport        - Otobüs/minibüs rota yönetimi
✅ Guide            - Rehber kategorileri + hiyerarşi
✅ Places           - İşletme yönetimi (Haversine search)
✅ Notifications    - FCM token kayıt, bildirim yönetimi
✅ Files            - Dosya upload/delete (multipart)
✅ Jobs             - Arka plan işleri (schedule, queue)
✅ Admin            - 11 domain-specific admin services (complaints, taxi, pharmacy, deaths, transport, users, events, guide, places, campaigns)
```

### Admin Panel (16 Modül - 100% Tamamlandı)
```
✅ Dashboard        - KPI, growth charts, pending approvals
✅ Announcements    - CRUD + targeting filters
✅ Ads              - CRUD + approval workflow
✅ Deaths           - İlan + Cemetery + Mosque CRUD
✅ Campaigns        - Admin CRUD + quick-add business
✅ Users            - Ban/unban, role management
✅ Pharmacy         - CRUD + monthly schedule calendar
✅ Transport        - Intercity + Intracity CRUD + stops
✅ Neighborhoods    - CRUD + type/population
✅ Taxi             - CRUD + random ordering
✅ Events           - CRUD + city scope filtering
✅ Guide            - Kategori + Item CRUD, hiyerarşi yönetimi
✅ Places           - Kategori + İşletme CRUD, fotoğraf galerisi
✅ Complaints       - Complaint workflow + review/resolve/reject actions
✅ Settings         - Admin settings, theme, profile management
✅ Scrapers         - Log viewer, history (legacy module)
```

---

## 🐛 Sorun Bildirme

Bir sorun bulduğunuzda:
1. [Issues](https://github.com/your-org/kadirliapp/issues) sayfasını kontrol edin
2. Yeni bir issue oluşturun (bug template'ı kullanın)
3. Detaylı açıklama + adımlar + beklenen/gerçek sonuç ekleyin

---

## 🤝 Katkıda Bulunma

Kod kontribüsyonlarına hoş geldiniz!

### Git Workflow
```bash
# Yeni feature branch'i oluştur
git checkout -b feature/feature-name

# Değişiklikleri commit et
git commit -m "feat: clear description"

# PR oluştur
git push origin feature/feature-name
```

### Commit Mesajları
```
feat:     Yeni feature
fix:      Bug düzeltme
docs:     Dokümantasyon
test:     Test ekleme
refactor: Kod yeniden düzenleme
```

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- 80%+ test coverage
- CLAUDE.md kurallarına uyun

---

## 📝 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kadirliapp
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600

# OTP
OTP_EXPIRATION_SECONDS=300
OTP_MAX_ATTEMPTS=3

# SMS (dev mode: OTP=123456)
SMS_PROVIDER=netgsm  # netgsm | ileti365
SMS_API_KEY=your-key
SMS_SENDER_ID=KadirliApp

# FCM
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key

# File Upload
MAX_FILE_SIZE=20971520  # 20MB

# CORS
CORS_ORIGIN=http://localhost:3001,https://admin.kadirliapp.com
```

### Admin Panel (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🚢 Production Deployment

### Docker ile Deploy
```bash
# Backend image'ini oluştur
cd backend
docker build -t kadirliapp-backend:1.0 .

# Admin image'ini oluştur
cd ../admin
docker build -t kadirliapp-admin:1.0 .

# docker-compose.prod.yml ile çalıştır
docker-compose -f docker-compose.prod.yml up -d
```

Detaylı deployment talimatları: [DEPLOYMENT_GUIDE.md](./docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md)

---

## 📞 İletişim & Destek

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/kadirliapp/issues)
- **Email:** support@kadirliapp.com

---

## 📄 Lisans

MIT License - Detaylar: [LICENSE](./LICENSE)

---

## 🎓 Geliştirici Rehberi

Yazılım geliştiricileri için detaylı rehber:
- Development workflow
- Code style conventions
- Testing strategy
- Architecture patterns

**Başla:** [CLAUDE.md](./CLAUDE.md)

---

**Tercihen:** Backend NestJS ve Admin Next.js %100 tamamlandı. Flutter mobile app %90 tamamlandı (12 modül: Auth, Home, Announcements, Ads, Deaths, Events, Pharmacy, Campaigns, Guide, Places, Taxi, Profile). Pending: Transport, Jobs, Notifications, Favorites, Search.

**Son Güncelleme:** 4 Mart 2026 | **Backend:** 1073 test ✅ | **Admin:** 0 Lint Error ✅ | **Flutter:** 85.5% coverage ✅
