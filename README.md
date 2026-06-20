# KadirliApp - Sosyal Ağ & Toplum Hizmetleri Platformu

KadirliApp, mahalle sakinleri arasında haber, ilan, etkinlik ve toplum hizmetlerini paylaşan bir sosyal ağ platformudur. Üç bileşenden oluşur: NestJS backend API, Next.js admin paneli ve Flutter mobil uygulama.

---

## 🎯 Proje Özeti

| Bileşen | Durum | Detay |
|---------|-------|-------|
| **Backend (NestJS 11)** | ✅ Çalışır durumda | 15 iş modülü + admin (11 alt-servis), 1070 unit test (58 suite) + 3 E2E spec dosyası, hepsi geçiyor |
| **Admin Panel (Next.js 16)** | ⚠️ Fonksiyonel, küçük temizlik gerekiyor | 16 modül implemente, ancak 4 ESLint hatası var ve otomatik test altyapısı yok |
| **Flutter Mobile** | ✅ 14/14 modül tamamlandı | Auth, Home, Announcements, Ads, Deaths, Events, Campaigns, Pharmacy, Guide, Places, Taxi, Transport, Notifications, Profile — Favoriler sekmesi placeholder |

> Aşağıdaki rakamlar `git log`, doğrudan kod incelemesi ve test çalıştırmalarıyla doğrulanmıştır (Haziran 2026). Alt proje README'lerindeki detaylarla senkronizedir.

---

## 📦 Teknoloji Stack'i

### Backend
- **Framework:** NestJS 11 + TypeScript 5.7
- **Database:** PostgreSQL 15 + TypeORM 0.3
- **Cache/Queue:** Redis (ioredis 5) + Bull
- **Authentication:** JWT (Passport) + OTP (SMS, dev modunda sabit kod)
- **Testing:** Jest 30 + Supertest (1045 unit + 3 E2E test dosyası)
- **API Prefix:** `/v1`, Swagger/OpenAPI kurulu değil

### Admin Panel
- **Framework:** Next.js 16 (App Router) + React 19
- **UI:** shadcn/ui (Radix) + Tailwind CSS 4
- **State:** TanStack React Query 5
- **Forms:** React Hook Form 7 + Zod 4
- **HTTP:** Axios, token'lar cookie'de saklanır

### Mobile
- **Framework:** Flutter (Dart >=3.0.0)
- **State Management:** Riverpod
- **API Client:** Dio (platforma göre otomatik base URL seçimi)
- **Push:** Firebase Cloud Messaging

---

## 🚀 Quick Start (Development)

### Sistem Gereksinimleri
- Docker & Docker Compose
- Node.js 20+
- Flutter SDK >=3.13.0 (mobil geliştirme için)
- Git

### 1️⃣ Backend Kurulumu
```bash
docker-compose up -d          # PostgreSQL + Redis — repo kökünden çalıştırılır
cd backend
npm ci
cp .env.example .env
npm run migration:run
npm run seed                  # opsiyonel — seed kullanıcıları için aşağıya bakın
npm run start:dev
```
Backend: `http://localhost:3000/v1`

### 2️⃣ Admin Panel Kurulumu
```bash
cd admin
npm ci
# .env.local oluştur (örnek dosya repoda yok):
#   NEXT_PUBLIC_API_URL=http://localhost:3000/v1
#   NEXT_PUBLIC_APP_VERSION=1.0.0
npm run dev
```
Admin Panel: `http://localhost:3001`

### 3️⃣ Flutter Mobile Kurulumu
```bash
cd flutter-app
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
cd ios && pod install && cd ..
flutter run
```

---

## 🔐 Seed Kullanıcıları ve Bilinen Giriş Kısıtı

`backend/scripts/seed.ts` (`npm run seed`) şu kullanıcıları oluşturur:

| Rol | Telefon | Şifre |
|-----|---------|-------|
| SUPER_ADMIN | `+905500000001` | `Admin123!` |
| USER (test) | `05551234567` | `User123!` |

> ⚠️ Admin paneli girişi (`POST /auth/admin/login`) kullanıcıyı **email** alanına göre arar, ancak seed script'i admin kullanıcısına email atamıyor. Bu yüzden seed'den gelen admin şu an **panele giremez** — backend'de bu kullanıcıya manuel bir email atamadan admin paneli login testi yapamazsınız. Detay: `backend/README.md`.

---

## 📚 Dokümantasyon

- **[Backend API Endpoints](./docs/04_API_ENDPOINTS_MASTER.md)**
- **[Database Schema (ERD)](./docs/02_ERD_DIAGRAM.md)** / **[Database Documentation](./docs/03_DATABASE_DOCUMENTATION.md)**
- **[Admin Panel Wireframes](./docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md)**
- **[Test Senaryoları](./docs/06_TEST_SCENARIOS_COMPLETE.md)**
- **[Deployment Guide](./docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md)**
- **[Proje Yapısı](./docs/09_PROJECT_STRUCTURE.md)**
- **[Düzeltme/Güncelleme Notları](./docs/10_CORRECTIONS_AND_UPDATES.md)**
- **[MEMORY_BANK/](./MEMORY_BANK/)** — Claude için süreklilik dosyaları (modüller, kararlar, deployment, sorunlar)
- **[SKILLS/](./SKILLS/)** — Backend/Admin/Flutter için best-practice referansları

---

## 🧪 Testing

### Backend
```bash
cd backend
npm test          # 58 suite, 1070 unit test
npm run test:e2e   # 3 E2E spec dosyası, gerçek PostgreSQL kullanır
npm run test:cov   # Coverage raporu (hedef: %75)
```

### Admin Panel
```bash
cd admin
npm run lint        # Şu an 4 hata + 38 uyarı veriyor
npx tsc --noEmit     # Tip kontrolü (hatasız)
```
Otomatik component/E2E testi yok (Jest/Vitest/Playwright kurulu değil).

### Flutter
```bash
cd flutter-app
flutter test         # 57 test dosyası
```
CI'a bağlı değil, coverage manuel hesaplanıyor (commit mesajında %88 olarak belirtilmiş).

---

## 🔄 CI/CD Pipeline

```
.github/workflows/
├── backend-tests.yml   - Lint → Unit → E2E → Coverage (%75 zorunlu) → Build
└── admin-build.yml     - Lint → Type Check → Build → Security Audit
```
**Not:** Flutter için bir CI workflow'u yok — mobil testler şu an yalnızca lokal olarak çalıştırılıyor.

---

## 📊 Proje Modülleri

### Backend (15 iş modülü + admin)
```
auth · users · files · announcements · ads · deaths · campaigns
pharmacy · events · taxi · transport · guide · places · notifications
admin (11 domain-specific servis: campaign, complaints, deaths, event,
       guide, pharmacy, places, staff, taxi, transport, users)
```
"Neighborhoods" ayrı bir modül değildir — CRUD `admin.service.ts` içindedir.

### Admin Panel (16 modül)
```
Dashboard · Announcements · Ads · Deaths · Campaigns · Users · Pharmacy
Transport · Neighborhoods · Taxi · Events · Guide · Places · Complaints
Settings · Staff
```

### Flutter (14/14 modül tamamlandı)
```
Auth · Home · Announcements · Ads · Deaths · Events · Campaigns
Pharmacy · Guide · Places · Taxi · Transport · Notifications · Profile
```
Bilinen eksik: Favoriler sekmesi placeholder; complaints ve jobs modülleri için Flutter UI'ı henüz yok.

---

## 🐛 Sorun Bildirme

1. [Issues](https://github.com/your-org/kadirliapp/issues) sayfasını kontrol edin
2. Yeni bir issue oluşturun (bug template'ı kullanın)
3. Detaylı açıklama + adımlar + beklenen/gerçek sonuç ekleyin

---

## 🤝 Katkıda Bulunma

### Git Workflow
```bash
git checkout -b feature/feature-name
git commit -m "feat: clear description"
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
- TypeScript strict mode (backend + admin)
- ESLint + Prettier
- Backend: %75+ test coverage hedefi
- GEMINI.md kurallarına uyun (proje geliştirme kuralları/sistem promptu — bkz. not aşağıda)

---

## 📝 Environment Variables

Her alt projenin kendi `.env.example`/`.env.local` dosyası var — gerçek değişken listeleri için:
- Backend: `backend/README.md` → Environment Variables bölümü (`backend/.env.example`)
- Admin: `admin/README.md` → `.env.local` bölümü (örnek dosya repoda yok)

---

## 🚢 Production Deployment

```bash
cd backend && docker build -t kadirliapp-backend:1.0 .
cd ../admin && docker build -t kadirliapp-admin:1.0 .
docker-compose -f docker-compose.prod.yml up -d
```

Detaylı talimatlar: [docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md](./docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md)

---

## 📄 Lisans

Lisans dosyası repoda bulunmuyor — dağıtım/kullanım koşulları için proje sahibine danışın.

---

## 🎓 Geliştirici Rehberi

Development workflow, code style, testing strategy ve mimari kararlar için: **[GEMINI.md](./GEMINI.md)** (dosya adı GEMINI.md olsa da içeriği projenin Claude/AI geliştirme sistem promptudur — repoda ayrı bir CLAUDE.md yok).

---

**Son Güncelleme:** 21 Haziran 2026 — Backend: 1070 unit + 3 E2E test ✅ | Admin: TypeScript temiz, 4 lint hatası açık ⚠️ | Flutter: 14/14 modül tamamlandı, 57 test dosyası ✅
