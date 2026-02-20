# KadirliApp - Detaylı Proje Yapısı

**Tarih:** 16 Şubat 2026  
**Amaç:** Tüm klasör ve dosya yapısını göster

---

## 📁 Tam Proje Yapısı

```
kadirliapp/
├── docs/                                    # Tüm dokümantasyon
│   ├── 01_DATABASE_SCHEMA_FULL.sql
│   ├── 02_ERD_DIAGRAM.md
│   ├── 03_DATABASE_DOCUMENTATION.md
│   ├── 04_API_ENDPOINTS_MASTER.md
│   ├── 05_ADMIN_PANEL_WIREFRAME_MASTER.md
│   ├── 06_TEST_SCENARIOS_COMPLETE.md
│   ├── 07_DEPLOYMENT_GUIDE_PRODUCTION.md
│   ├── 08_CLAUDE_CODE_PROMPT_CHAIN.md
│   ├── 09_PROJECT_STRUCTURE.md (bu dosya)
│   └── 10_CORRECTIONS_AND_UPDATES.md
│
├── backend/                                 # NestJS Backend
│   ├── src/
│   │   ├── main.ts                         # Entry point
│   │   ├── app.module.ts                   # Root module
│   │   │
│   │   ├── auth/                           # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── request-otp.dto.ts
│   │   │   │   ├── verify-otp.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   │
│   │   ├── users/                          # Users
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   └── dto/
│   │   │       ├── update-user.dto.ts
│   │   │       └── update-notifications.dto.ts
│   │   │
│   │   ├── announcements/                  # Duyurular
│   │   │   ├── announcements.module.ts
│   │   │   ├── announcements.service.ts
│   │   │   ├── announcements.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-announcement.dto.ts
│   │   │       └── update-announcement.dto.ts
│   │   │
│   │   ├── ads/                            # İlanlar
│   │   │   ├── ads.module.ts
│   │   │   ├── ads.service.ts
│   │   │   ├── ads.controller.ts
│   │   │   ├── categories/
│   │   │   │   ├── categories.service.ts
│   │   │   │   └── categories.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-ad.dto.ts
│   │   │       ├── update-ad.dto.ts
│   │   │       └── extend-ad.dto.ts
│   │   │
│   │   ├── deaths/                         # Vefat İlanları
│   │   │   ├── deaths.module.ts
│   │   │   ├── deaths.service.ts
│   │   │   ├── deaths.controller.ts
│   │   │   └── dto/
│   │   │       └── create-death-notice.dto.ts
│   │   │
│   │   ├── pharmacy/                       # Nöbetçi Eczane
│   │   │   ├── pharmacy.module.ts
│   │   │   ├── pharmacy.service.ts
│   │   │   └── pharmacy.controller.ts
│   │   │
│   │   ├── events/                         # Etkinlikler
│   │   │   ├── events.module.ts
│   │   │   ├── events.service.ts
│   │   │   └── events.controller.ts
│   │   │
│   │   ├── campaigns/                      # Kampanyalar
│   │   │   ├── campaigns.module.ts
│   │   │   ├── campaigns.service.ts
│   │   │   └── campaigns.controller.ts
│   │   │
│   │   ├── guide/                          # Altın Rehber
│   │   │   ├── guide.module.ts
│   │   │   ├── guide.service.ts
│   │   │   └── guide.controller.ts
│   │   │
│   │   ├── places/                         # Gezilecek Yerler
│   │   │   ├── places.module.ts
│   │   │   ├── places.service.ts
│   │   │   └── places.controller.ts
│   │   │
│   │   ├── transport/                      # Ulaşım
│   │   │   ├── transport.module.ts
│   │   │   ├── transport.service.ts
│   │   │   └── transport.controller.ts
│   │   │
│   │   ├── notifications/                  # Bildirimler
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.controller.ts
│   │   │   └── fcm/
│   │   │       └── fcm.service.ts
│   │   │
│   │   ├── taxi/                           # Taksi
│   │   │   ├── taxi.module.ts
│   │   │   ├── taxi.service.ts
│   │   │   └── taxi.controller.ts
│   │   │
│   │   ├── admin/                          # Admin İşlemleri
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.controller.ts
│   │   │
│   │   ├── database/                       # Database
│   │   │   ├── entities/                  # TypeORM Entities
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── neighborhood.entity.ts
│   │   │   │   ├── announcement.entity.ts
│   │   │   │   ├── announcement-type.entity.ts
│   │   │   │   ├── ad.entity.ts
│   │   │   │   ├── ad-category.entity.ts
│   │   │   │   ├── category-property.entity.ts
│   │   │   │   ├── property-option.entity.ts
│   │   │   │   ├── ad-property-value.entity.ts
│   │   │   │   ├── ad-image.entity.ts
│   │   │   │   ├── ad-favorite.entity.ts
│   │   │   │   ├── taxi-driver.entity.ts
│   │   │   │   ├── taxi-call.entity.ts
│   │   │   │   ├── death-notice.entity.ts
│   │   │   │   ├── cemetery.entity.ts
│   │   │   │   ├── mosque.entity.ts
│   │   │   │   ├── pharmacy.entity.ts
│   │   │   │   ├── pharmacy-schedule.entity.ts
│   │   │   │   ├── event.entity.ts
│   │   │   │   ├── event-category.entity.ts
│   │   │   │   ├── campaign.entity.ts
│   │   │   │   ├── business.entity.ts
│   │   │   │   ├── business-category.entity.ts
│   │   │   │   ├── guide-category.entity.ts
│   │   │   │   ├── guide-item.entity.ts
│   │   │   │   ├── place.entity.ts
│   │   │   │   ├── place-category.entity.ts
│   │   │   │   ├── intercity-route.entity.ts
│   │   │   │   ├── intercity-schedule.entity.ts
│   │   │   │   ├── intracity-route.entity.ts
│   │   │   │   ├── intracity-stop.entity.ts
│   │   │   │   ├── notification.entity.ts
│   │   │   │   ├── file.entity.ts
│   │   │   │   ├── permission.entity.ts
│   │   │   │   ├── role-permission.entity.ts
│   │   │   │   ├── audit-log.entity.ts
│   │   │   │   ├── scraper-log.entity.ts
│   │   │   │   └── complaint.entity.ts
│   │   │   │
│   │   │   └── migrations/                # Database migrations
│   │   │       └── [timestamp]-initial.ts
│   │   │
│   │   ├── common/                         # Shared code
│   │   │   ├── decorators/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── enums/
│   │   │   │   ├── user-role.enum.ts
│   │   │   │   ├── announcement-priority.enum.ts
│   │   │   │   └── ad-status.enum.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── validation.pipe.ts
│   │   │   └── utils/
│   │   │       ├── pagination.util.ts
│   │   │       └── phone.util.ts
│   │   │
│   │   ├── config/                         # Configuration
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── firebase.config.ts
│   │   │
│   │   └── jobs/                           # Background jobs
│   │       ├── announcements-job.service.ts
│   │       ├── death-archive-job.service.ts
│   │       └── scraper-job.service.ts
│   │
│   ├── test/                               # Tests
│   │   ├── unit/
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── announcements.service.spec.ts
│   │   │   └── ads.service.spec.ts
│   │   └── e2e/
│   │       ├── auth.e2e-spec.ts
│   │       ├── announcements.e2e-spec.ts
│   │       └── ads.e2e-spec.ts
│   │
│   ├── logs/                               # Logs
│   │   ├── error.log
│   │   └── combined.log
│   │
│   ├── .env.example                        # Environment template
│   ├── .env                                # Environment (gitignore)
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
│
├── admin/                                   # Next.js Admin Panel
│   ├── app/
│   │   ├── layout.tsx                      # Root layout
│   │   ├── page.tsx                        # Landing page
│   │   │
│   │   ├── (auth)/                         # Auth group
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   └── (dashboard)/                    # Dashboard group
│   │       ├── layout.tsx                  # Sidebar + Topbar
│   │       ├── page.tsx                    # Dashboard
│   │       │
│   │       ├── announcements/              # Duyurular
│   │       │   ├── page.tsx               # List
│   │       │   ├── [id]/
│   │       │   │   └── page.tsx           # Detail
│   │       │   └── new/
│   │       │       └── page.tsx           # Create
│   │       │
│   │       ├── ads/                        # İlanlar
│   │       │   ├── page.tsx               # Moderation list
│   │       │   └── [id]/
│   │       │       └── page.tsx           # Detail modal
│   │       │
│   │       ├── deaths/                     # Vefat
│   │       │   └── page.tsx
│   │       │
│   │       ├── campaigns/                  # Kampanyalar
│   │       │   └── page.tsx
│   │       │
│   │       ├── events/                     # Etkinlikler
│   │       │   └── page.tsx
│   │       │
│   │       ├── pharmacy/                   # Eczane
│   │       │   └── page.tsx
│   │       │
│   │       ├── guide/                      # Rehber
│   │       │   └── page.tsx
│   │       │
│   │       ├── places/                     # Yerler
│   │       │   └── page.tsx
│   │       │
│   │       ├── transport/                  # Ulaşım
│   │       │   └── page.tsx
│   │       │
│   │       ├── users/                      # Kullanıcılar
│   │       │   ├── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       │
│   │       ├── complaints/                 # Şikayetler
│   │       │   └── page.tsx
│   │       │
│   │       ├── scrapers/                   # Scrapers
│   │       │   └── page.tsx
│   │       │
│   │       └── settings/                   # Ayarlar
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── dashboard/
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── kpi-card.tsx
│   │   │   ├── activity-feed.tsx
│   │   │   └── charts/
│   │   │       ├── user-growth-chart.tsx
│   │   │       └── module-usage-chart.tsx
│   │   │
│   │   ├── announcements/
│   │   │   ├── announcement-list.tsx
│   │   │   ├── announcement-form.tsx
│   │   │   └── announcement-detail.tsx
│   │   │
│   │   ├── ads/
│   │   │   ├── ad-list.tsx
│   │   │   ├── ad-moderation-modal.tsx
│   │   │   └── ad-detail.tsx
│   │   │
│   │   └── shared/
│   │       ├── pagination.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                          # Axios instance
│   │   ├── utils.ts                        # Helper functions
│   │   └── constants.ts                    # Constants
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAnnouncements.ts
│   │   └── useAds.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── announcement.ts
│   │   ├── ad.ts
│   │   └── api.ts
│   │
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── .env.local                          # Environment
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── Dockerfile
│
├── flutter-app/                            # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart                       # Entry point
│   │   │
│   │   ├── app/
│   │   │   ├── app.dart                   # Root widget
│   │   │   └── routes.dart                # Route definitions
│   │   │
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   ├── api_client.dart        # Dio client
│   │   │   │   ├── api_interceptor.dart
│   │   │   │   └── endpoints.dart
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart
│   │   │   │   ├── announcement_model.dart
│   │   │   │   ├── ad_model.dart
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth_service.dart
│   │   │   │   ├── storage_service.dart
│   │   │   │   └── notification_service.dart
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── validators.dart
│   │   │   │   ├── formatters.dart
│   │   │   │   └── constants.dart
│   │   │   │
│   │   │   └── theme/
│   │   │       ├── app_theme.dart
│   │   │       ├── app_colors.dart
│   │   │       └── app_text_styles.dart
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── phone_input_screen.dart
│   │   │   │   │   ├── otp_verification_screen.dart
│   │   │   │   │   └── registration_screen.dart
│   │   │   │   ├── providers/
│   │   │   │   │   └── auth_provider.dart
│   │   │   │   └── widgets/
│   │   │   │       ├── phone_input_field.dart
│   │   │   │       └── otp_input_field.dart
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── screens/
│   │   │   │   │   └── home_screen.dart
│   │   │   │   └── widgets/
│   │   │   │       ├── bottom_nav_bar.dart
│   │   │   │       └── announcement_card.dart
│   │   │   │
│   │   │   ├── announcements/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── announcements_list_screen.dart
│   │   │   │   │   └── announcement_detail_screen.dart
│   │   │   │   └── providers/
│   │   │   │       └── announcements_provider.dart
│   │   │   │
│   │   │   ├── ads/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── ads_list_screen.dart
│   │   │   │   │   ├── ad_detail_screen.dart
│   │   │   │   │   ├── create_ad_screen.dart
│   │   │   │   │   └── my_ads_screen.dart
│   │   │   │   ├── providers/
│   │   │   │   │   └── ads_provider.dart
│   │   │   │   └── widgets/
│   │   │   │       ├── ad_card.dart
│   │   │   │       ├── category_selector.dart
│   │   │   │       └── image_uploader.dart
│   │   │   │
│   │   │   ├── deaths/
│   │   │   ├── pharmacy/
│   │   │   ├── events/
│   │   │   ├── campaigns/
│   │   │   ├── guide/
│   │   │   ├── places/
│   │   │   └── profile/
│   │   │
│   │   └── shared/
│   │       └── widgets/
│   │           ├── loading_indicator.dart
│   │           ├── error_widget.dart
│   │           ├── custom_button.dart
│   │           └── custom_text_field.dart
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   └── README.md
│
├── scripts/                                 # Utility scripts
│   ├── seed-database.sh                    # Database seeding
│   ├── backup.sh                           # Backup script
│   └── deploy.sh                           # Deployment script
│
├── docker-compose.yml                       # Docker orchestration
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🎯 Her Klasörün Amacı

### `/docs`
- Tüm dokümantasyon burada
- Claude Code bunları okuyacak
- Silme, güncelleme yapma

### `/backend`
- NestJS API
- PostgreSQL + TypeORM
- Redis cache
- JWT authentication
- FCM push notifications

### `/admin`
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Admin panel
- Dashboard + Moderation

### `/flutter-app`
- Flutter 3.x
- Mobil uygulama
- Android + iOS
- Push notifications

### `/scripts`
- Yardımcı scriptler
- Database seed
- Backup
- Deploy

---

## 📦 Package.json Örnekleri

### Backend (NestJS)

```json
{
  "name": "kadirliapp-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/bull": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "bull": "^4.12.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "firebase-admin": "^12.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^4.0.0",
    "jest": "^29.5.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.0"
  }
}
```

### Admin Panel (Next.js)

```json
{
  "name": "kadirliapp-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Flutter (pubspec.yaml)

```yaml
name: kadirliapp
description: KadirliApp Mobile Application
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.1.0
  
  # HTTP
  dio: ^5.4.0
  
  # Local Storage
  shared_preferences: ^2.2.0
  
  # Firebase
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.0
  
  # UI
  cached_network_image: ^3.3.0
  image_picker: ^1.0.0
  
  # Utils
  intl: ^0.18.0
  url_launcher: ^6.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

---

## 🔧 Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: kadirliapp-postgres
    environment:
      POSTGRES_DB: kadirliapp
      POSTGRES_USER: kadirliapp_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: kadirliapp-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    container_name: kadirliapp-backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  admin:
    build: ./admin
    container_name: kadirliapp-admin
    ports:
      - "3001:3001"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000
    depends_on:
      - backend
    volumes:
      - ./admin:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

---

## 🎯 .gitignore Örneği

```
# Backend
backend/node_modules/
backend/dist/
backend/.env
backend/logs/*.log

# Admin
admin/node_modules/
admin/.next/
admin/out/
admin/.env.local

# Flutter
flutter-app/.dart_tool/
flutter-app/.flutter-plugins
flutter-app/.flutter-plugins-dependencies
flutter-app/build/
flutter-app/ios/Pods/
flutter-app/ios/.symlinks/
flutter-app/android/.gradle/
flutter-app/android/app/google-services.json

# General
.DS_Store
*.swp
*.swo
*~
.vscode/
.idea/
```

---

## ✅ Kontrol Listesi

Proje başlamadan önce bu yapıyı kontrol et:

- [ ] `docs/` klasörü var ve 10 dosya içinde
- [ ] `backend/` klasörü boş (Claude dolduracak)
- [ ] `admin/` klasörü boş (Claude dolduracak)
- [ ] `flutter-app/` klasörü boş (Claude dolduracak)
- [ ] `scripts/` klasörü var
- [ ] `docker-compose.yml` root'ta
- [ ] `.gitignore` root'ta
- [ ] `README.md` root'ta

Hepsi tamam? Claude Code'u başlat! 🚀
