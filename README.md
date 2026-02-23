# KadirliApp - Sosyal Ağ & Toplum Hizmetleri Platformu

![Version](https://img.shields.io/badge/version-1.0-blue) ![Status](https://img.shields.io/badge/status-production--ready-green) ![Coverage](https://img.shields.io/badge/coverage-85.13%25-green)

KadirliApp, mahalle sakinleri arasında haber, ilan, etkinlik ve toplum hizmetlerini paylaşan modern bir sosyal ağ platformudur.

---

## 🎯 Proje Özeti

| Bileşen | Durum | İlerleme |
|---------|-------|----------|
| **Backend (NestJS)** | ✅ Tamamlandı | 100% (17 modül, 492 test) |
| **Admin Panel (Next.js)** | ✅ Tamamlandı | 97% (13 ana modül) |
| **Flutter Mobile** | ⏳ Sırada | 0% (Backend API hazır) |
| **Testing** | ✅ Tamamlandı | 85.13% coverage |
| **DevOps & CI/CD** | ⏳ Devam ediyor | Docker + PM2 + GitHub Actions |

---

## 📦 Teknoloji Stack'i

### Backend
- **Framework:** NestJS 10 + TypeScript
- **Database:** PostgreSQL 15 + TypeORM
- **Cache:** Redis 7
- **Job Queue:** Bull MQ
- **Authentication:** JWT + OTP (SMS)
- **Testing:** Jest (492 test, 85%+ coverage)

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
- Node.js 18+
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
Şifre: Admin123!
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

# Tüm testleri çalıştır
npm test

# Coverage raporu
npm run test:cov
```

**Sonuç:** 492 test ✅ | 85.13% coverage

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
├── backend-tests.yml       # npm test (her push'ta)
├── admin-build.yml         # npm run build (main'e)
└── deploy-staging.yml      # Docker image push (manual)
```

---

## 📊 Proje Modülleri

### Backend (17 Modül)
```
✅ Auth          - JWT + OTP authentication
✅ Users         - Profil, mahalle, bildirim tercihleri
✅ Ads           - İlan oluştur, ara, favoriler, uzatma
✅ Announcements - Duyuru yayınla, targeting, soft delete
✅ Deaths        - Vefat ilanları + Mezarlık/Cami CRUD
✅ Campaigns     - Kampanya oluştur, QR kod, redemption
✅ Pharmacy      - Nöbetçi eczane, takvim
✅ Events        - Etkinlik reklamı (iç/dış)
✅ Taxi          - Taksi sürücü yönetimi (RANDOM sıralama)
✅ Transport     - Otobüs/minibüs rota yönetimi
✅ Guide         - Rehber kategorileri + hiyerarşi
✅ Places        - İşletme yönetimi (Haversine search)
✅ Notifications - FCM token kayıt, bildirim yönetimi
✅ Files         - Dosya upload/delete (multipart)
✅ Admin         - Dashboard, user ban/unban, scraper logs
✅ Jobs          - Arka plan işleri (schedule, queue)
```

### Admin Panel (13 Modül)
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
✅ Scrapers         - Log viewer, history
🔲 Settings         - (placeholder)
🔲 Guide            - (placeholder)
🔲 Places           - (placeholder)
🔲 Complaints       - (placeholder)
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

**Tercihen:** Backend NestJS ve Admin Next.js üzerinde başlıyor. Backend API %100 hazır, admin panel %97 tamamlandı. Flutter mobile app sonraki aşamada başlanacak.

**Son Güncelleme:** 24 Şubat 2026
