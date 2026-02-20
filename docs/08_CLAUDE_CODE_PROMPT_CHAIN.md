# Claude Code - Adım Adım Prompt Rehberi

**Tarih:** 16 Şubat 2026  
**Amaç:** Claude Code'u sıfırdan nasıl kullanacağını adım adım öğren

---

## 📋 İçindekiler

1. [Claude Code Kurulum](#claude-code-kurulum)
2. [İlk Başlatma](#ilk-başlatma)
3. [Prompt Zinciri (Tüm Proje)](#prompt-zinciri)
4. [Her Modül İçin Detaylı Promptlar](#modül-promptları)
5. [Hata Çözümleme](#hata-çözümleme)
6. [İpuçları ve Püf Noktaları](#i̇puçları)

---

## Claude Code Kurulum

### 1. Kurulum Adımları

```bash
# Terminal aç

# Node.js yüklü olmalı (kontrol et)
node --version
# v20.x.x görmeli

# Claude Code'u yükle
npm install -g @anthropic-ai/claude

# Versiyonu kontrol et
claude --version
```

### 2. API Key Alma

1. https://console.anthropic.com/ adresine git
2. "API Keys" bölümüne gir
3. "Create Key" tıkla
4. Key'i kopyala (bir daha göremezsin!)

### 3. Login

```bash
claude login
# API key'i yapıştır
# Enter'a bas
# "Successfully logged in!" mesajını göreceksin
```

---

## İlk Başlatma

### 1. Proje Klasörü Oluştur

```bash
# Ana klasörü oluştur
mkdir kadirliapp
cd kadirliapp

# Alt klasörleri oluştur
mkdir docs backend admin flutter-app scripts

# Git başlat
git init
```

### 2. Dosyaları Yerleştir

```
kadirliapp/
├── docs/
│   ├── 01_DATABASE_SCHEMA_FULL.sql
│   ├── 02_ERD_DIAGRAM.md
│   ├── 03_DATABASE_DOCUMENTATION.md
│   ├── 04_API_ENDPOINTS_MASTER.md
│   ├── 05_ADMIN_PANEL_WIREFRAME_MASTER.md
│   ├── 06_TEST_SCENARIOS_COMPLETE.md
│   ├── 07_DEPLOYMENT_GUIDE_PRODUCTION.md
│   ├── 08_CLAUDE_CODE_PROMPT_CHAIN.md (bu dosya)
│   ├── 09_PROJECT_STRUCTURE.md
│   └── 10_CORRECTIONS_AND_UPDATES.md
├── backend/ (boş - Claude dolduracak)
├── admin/ (boş - Claude dolduracak)
├── flutter-app/ (boş - Claude dolduracak)
└── scripts/ (boş)
```

### 3. Claude Code Başlat

```bash
cd kadirliapp
claude
```

Terminal'de Claude Code açılacak. Şimdi promptları vermeye hazırsın!

---

## Prompt Zinciri (Tüm Proje)

### PROMPT 1: İlk Tanışma ve Plan

```
Merhaba Claude! Ben KadirliApp adında bir mobil uygulama geliştiriyorum.

Senin görevin bu projeyi SIFIRDAN kodlamak.

Önce docs/ klasöründeki TÜM dosyaları oku:
- 01_DATABASE_SCHEMA_FULL.sql
- 02_ERD_DIAGRAM.md
- 03_DATABASE_DOCUMENTATION.md
- 04_API_ENDPOINTS_MASTER.md
- 05_ADMIN_PANEL_WIREFRAME_MASTER.md
- 06_TEST_SCENARIOS_COMPLETE.md
- 07_DEPLOYMENT_GUIDE_PRODUCTION.md
- 08_CLAUDE_CODE_PROMPT_CHAIN.md
- 09_PROJECT_STRUCTURE.md
- 10_CORRECTIONS_AND_UPDATES.md

ÖNEMLİ: 10_CORRECTIONS_AND_UPDATES.md dosyasındaki tüm düzeltmeleri dikkate al!

Dosyaları okuduktan sonra bana şunu sun:

1. Geliştirme planı (hangi sırayla ne yapacaksın?)
2. Her aşama için tahmini süre
3. İlk 3 görev nedir?
4. Eksik gördüğün bir şey var mı?

Lütfen dosyaları okumadan cevap verme!
```

**BEKLENEN CEVAP:**
Claude dosyaları okuyacak (2-3 dakika sürer) ve sana bir plan sunacak.

---

### PROMPT 2: Backend Başlangıç

```
Harika! Planı onaylıyorum.

Şimdi Backend'e başlayalım.

backend/ klasöründe yeni bir NestJS projesi oluştur:

1. NestJS CLI kullan
2. PostgreSQL + TypeORM + Redis entegrasyonu ekle
3. .env.example dosyası oluştur
4. docker-compose.yml oluştur (PostgreSQL + Redis)
5. Temel klasör yapısını kur:
   - src/auth
   - src/users
   - src/announcements
   - src/ads
   - src/deaths
   - src/pharmacy
   - src/events
   - src/campaigns
   - src/guide
   - src/places
   - src/transport
   - src/notifications
   - src/common (shared kod)

Başla!
```

**BEKLENEN CEVAP:**
Claude NestJS projesini kuracak (5-10 dakika).

---

### PROMPT 3: Database Schema Import

```
Mükemmel!

Şimdi database şemasını import edelim:

1. docs/01_DATABASE_SCHEMA_FULL.sql dosyasını oku
2. TypeORM entity'lerini oluştur (her tablo için ayrı entity)
3. src/database/entities/ klasörüne koy
4. Tüm ilişkileri tanımla (OneToMany, ManyToOne, etc.)

ÖNEMLİ: 
- Entity isimleri singular olsun (User, Announcement)
- Tablo isimleri plural olsun (users, announcements)
- Enum'ları ayrı dosyalara koy (src/common/enums/)

Başla!
```

**BEKLENEN CEVAP:**
50+ entity dosyası oluşturacak (15-20 dakika).

---

### PROMPT 4: Auth Modülü

```
Harika!

Şimdi Authentication modülünü yazalım:

docs/04_API_ENDPOINTS_MASTER.md dosyasını oku, 
"1. AUTHENTICATION" bölümünü incele.

Şu endpoint'leri yaz:
1. POST /auth/request-otp
2. POST /auth/verify-otp
3. POST /auth/register
4. POST /auth/refresh
5. POST /auth/logout

ÖNEMLİ:
- OTP sistemi için Redis kullan (5 dakika TTL)
- Rate limiting ekle (10 OTP/hour per phone)
- JWT token üret (30 gün geçerli)
- Refresh token üret (90 gün geçerli)

Testlerini de yaz (auth.service.spec.ts)

Başla!
```

**BEKLENEN CEVAP:**
Auth modülü tamamlanacak (30-40 dakika).

---

### PROMPT 5: Core Modülü (Users)

```
Çok iyi!

Şimdi Users modülünü yazalım:

docs/04_API_ENDPOINTS_MASTER.md'den "2. CORE" bölümünü oku.

Şu endpoint'leri yaz:
1. GET /users/me
2. PATCH /users/me
3. PATCH /users/me/notifications

ÖNEMLİ:
- Kullanıcı adı değişikliği: Ayda 1 kere (son değişiklik tarihini kontrol et)
- Mahalle değişikliği: Ayda 1 kere
- Validation ekle (username 3-50 karakter, unique)

Testlerini de yaz.

Başla!
```

---

### PROMPT 6: Announcements Modülü

```
Mükemmel!

Announcements (Duyurular) modülüne geçelim:

docs/04_API_ENDPOINTS_MASTER.md'den "3. ANNOUNCEMENTS" bölümünü oku.

CRUD endpoint'lerini yaz + iş mantığı:

ÖNEMLİ İŞ KURALLARI:
1. Manuel duyurular: status = 'published' (otomatik yayınla)
2. Scraping duyurular: status = 'draft' (onay bekler)
3. Hedefleme: target_type = 'all' | 'neighborhoods' | 'users'
4. Zamanlama: scheduled_for kullan
5. Push notification: FCM ile gönder (batch: 500'er)

Firebase Admin SDK entegrasyonu ekle.

Testlerini de yaz.

Başla!
```

**BEKLENEN CEVAP:**
Announcements modülü tamamlanacak (45-60 dakika).

---

### PROMPT 7: Ads Modülü (En Karmaşık)

```
Harika ilerliyoruz!

Ads (İlanlar) modülü - en karmaşık modül:

docs/04_API_ENDPOINTS_MASTER.md'den "4. ADS" bölümünü oku.

Şu endpoint'leri yaz:
- GET /ads (filtreleme + pagination)
- GET /ads/:id
- POST /ads (CRUD)
- PATCH /ads/:id
- DELETE /ads/:id
- POST /ads/:id/extend (reklam bazlı uzatma)
- POST /ads/:id/favorite
- GET /users/me/ads
- GET /users/me/favorites

KRİTİK İŞ KURALLARI:
1. Yeni ilan: expires_at = NOW() + 7 days
2. Uzatma: 3 reklam izleme = 3 gün uzatma
3. Max uzatma: 3 kere
4. Günlük limit: 10 ilan/user
5. Fotoğraf limiti: 5 fotoğraf
6. Moderation: status = pending → admin onayı

Full-text search ekle (PostgreSQL pg_trgm).

Testlerini de yaz.

Başla!
```

**BEKLENEN CEVAP:**
Ads modülü tamamlanacak (60-90 dakika).

---

### PROMPT 8: Diğer Modüller (Hızlı)

```
Süper! Şimdi kalan modülleri hızlıca bitirelim:

Sırayla şunları yaz (her biri 20-30 dakika):

1. Deaths (Vefat İlanları)
   - Otomatik arşivleme: auto_archive_at = funeral_date + 7 days
   - Cron job ekle (her gün kontrol et)

2. Pharmacy (Nöbetçi Eczane)
   - Güncel nöbetçi: GET /pharmacy/current
   - Takvim: GET /pharmacy/schedule

3. Events (Etkinlikler)
   - Basit CRUD
   - Kategori filtreleme

4. Campaigns (Kampanyalar)
   - İşletme hesabı kontrolü
   - Kod görüntüleme tracking

5. Guide (Altın Rehber)
   - Basit CRUD + kategoriler

6. Places (Gezilecek Yerler)
   - Mesafe hesaplama (ST_Distance)

7. Transport (Ulaşım)
   - Sefer saatleri listeleme

Her modül için:
- CRUD endpoint'leri
- İş kuralları
- Testler

Sırayla başla, her biri bitince bana bildir!
```

---

### PROMPT 9: Admin Panel Başlangıç

```
Backend tamamlandı, tebrikler!

Şimdi Admin Panel'e geçelim:

admin/ klasöründe yeni bir Next.js 14 projesi oluştur:

1. npx create-next-app@latest kullan
2. App Router kullan
3. Tailwind CSS + shadcn/ui ekle
4. Klasör yapısı:
   - app/
     - (auth)/
       - login/
     - (dashboard)/
       - layout.tsx (sidebar + topbar)
       - page.tsx (dashboard)
       - announcements/
       - ads/
       - deaths/
       - campaigns/
       - events/
       - pharmacy/
       - users/
       - settings/
   - components/
     - ui/ (shadcn components)
     - dashboard/
       - sidebar.tsx
       - topbar.tsx
       - kpi-card.tsx
   - lib/
     - api.ts (axios instance)
     - utils.ts

Başla!
```

---

### PROMPT 10: Admin Dashboard

```
Harika!

Şimdi Dashboard sayfasını yazalım:

docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md'yi oku,
"1. Dashboard" bölümüne bak.

Dashboard'da olacaklar:
1. KPI Kartları (6 adet):
   - Toplam Kullanıcı
   - Aktif Kullanıcı (Bugün)
   - Onay Bekleyen
   - Aktif İlan
   - Duyuru (Bu hafta)
   - Scraper Hatası

2. Grafik:
   - Kullanıcı Artışı (Recharts LineChart)

3. Modül Kullanımı:
   - Progress bar'lar

4. Son Aktiviteler:
   - Activity feed

Responsive olsun (Tailwind breakpoints).

Başla!
```

---

### PROMPT 11: Admin Moderation Ekranları

```
Süper!

Şimdi en önemli kısım: Moderation ekranları:

1. app/(dashboard)/ads/page.tsx
   - Onay bekleyen ilanlar en üstte
   - Filtreleme (kategori, durum, tarih)
   - Pagination
   - "İncele" modal'ı
   - Onaylama/Reddetme butonları

2. app/(dashboard)/deaths/page.tsx
   - ACİL etiketli liste
   - Hızlı onay

3. app/(dashboard)/campaigns/page.tsx
   - İşletme kampanyaları
   - İstatistik gösterimi

Her ekran için:
- Responsive design
- Loading states
- Error handling
- Toast notifications

docs/05_ADMIN_PANEL_WIREFRAME_MASTER.md'deki 
tasarımlara sadık kal!

Başla!
```

---

### PROMPT 12: Flutter App (Son Aşama)

```
Admin panel tamamlandı!

Şimdi Flutter mobil uygulamasına geçelim:

flutter-app/ klasöründe yeni Flutter projesi oluştur:

1. flutter create kullan
2. Klasör yapısı:
   - lib/
     - main.dart
     - app/
       - routes.dart
     - core/
       - api/
       - models/
       - utils/
     - features/
       - auth/
       - home/
       - announcements/
       - ads/
       - deaths/
       - pharmacy/
       - events/
       - campaigns/
     - shared/
       - widgets/

3. Package'ler ekle:
   - dio (HTTP)
   - provider (State)
   - shared_preferences (Storage)
   - firebase_messaging (Push)

Başla!
```

---

### PROMPT 13: Flutter Auth Screen

```
Mükemmel!

Authentication ekranlarını yazalım:

1. lib/features/auth/screens/
   - phone_input_screen.dart
   - otp_verification_screen.dart
   - registration_screen.dart

OTP Flow:
1. Telefon numarası gir
2. OTP al (5 dakika geçerli)
3. Doğrula
4. Yeni kullanıcıysa: Kayıt ekranı
5. Token'ı SharedPreferences'a kaydet

API entegrasyonu:
- POST /auth/request-otp
- POST /auth/verify-otp
- POST /auth/register

Başla!
```

---

### PROMPT 14: Flutter Ana Ekranlar

```
Harika!

Ana ekranları yazalım:

1. Home Screen:
   - Bottom navigation (5 tab)
   - Duyurular listesi
   - Pull-to-refresh

2. Announcements Screen:
   - Liste + filtreleme
   - Detay modal

3. Ads Screen:
   - Kategori listesi
   - İlan listesi
   - Detay sayfası
   - Favori ekleme

4. Create Ad Screen:
   - Multi-step form
   - Fotoğraf upload
   - Kategori özellikleri

Her ekran için:
- Loading states
- Error handling
- Responsive design

Başla!
```

---

### PROMPT 15: Push Notifications

```
Çok iyi!

Son olarak Push Notification'ları ekleyelim:

1. Firebase Console setup (bana rehber göster)
2. FCM token kaydetme
3. Foreground notification handling
4. Background notification handling
5. Notification tıklama -> Doğru ekrana yönlendirme

Backend'de:
- FCM token kaydetme endpoint'i zaten var
- Duyuru gönderilince push gönderilir

Flutter'da:
- firebase_messaging paketi
- Local notification gösterimi

Başla!
```

---

### PROMPT 16: Testing

```
Tüm kodlama tamamlandı!

Şimdi test yazalım:

Backend:
- Unit tests (her service için)
- Integration tests (API flow'lar)
- Coverage hedefi: %75+

docs/06_TEST_SCENARIOS_COMPLETE.md'yi oku ve 
testleri yaz.

Başla!
```

---

### PROMPT 17: Docker Setup

```
Testler de tamam!

Şimdi Docker setup:

1. backend/Dockerfile
2. admin/Dockerfile
3. Root'ta docker-compose.yml:
   - PostgreSQL
   - Redis
   - Backend
   - Admin Panel

Tek komutla tüm sistem ayağa kalksın:
docker-compose up -d

Başla!
```

---

## Modül Promptları

### Announcements için Detaylı Prompt

```
Announcements modülünü yazalım.

ENDPOINT'LER:
1. GET /announcements
   - Filtreleme: type_id, priority, neighborhood
   - Pagination: page, limit
   - Sıralama: -created_at (en yeni üstte)
   - User'ın mahallesine göre hedefleme kontrolü

2. GET /announcements/:id
   - Detay getir
   - View count arttır
   - announcement_views tablosuna kayıt ekle

3. POST /announcements (Admin)
   - type_id, title, body, priority, target_type zorunlu
   - Manuel ise: status = 'published'
   - Scraping ise: status = 'draft'
   - scheduled_for varsa: zamanla
   - Validation: title max 200 char

4. PATCH /announcements/:id (Admin)
   - Güncelleme

5. DELETE /announcements/:id (Admin)
   - Soft delete (deleted_at = NOW())

6. POST /announcements/:id/send (Admin)
   - Push notification gönder
   - 500'er batch'lerde
   - Bull queue kullan

İŞ KURALLARI:
- Manuel duyurular öncelikli (otomatik yayınla)
- Scraping duyurular onay bekler
- Hedefleme: 'all' > 'neighborhoods' > 'users'
- Push notification: send_push_notification = true ise gönder

TESTLER:
- OTP rate limiting (10/hour)
- Hedefleme hesaplama
- Batch gönderim

Başla!
```

---

## Hata Çözümleme

### Hata 1: "Module not found"

```
CLAUDE HATA VERDİ:
Error: Cannot find module '@nestjs/typeorm'

SENİN ÇÖZÜMÜN:
Claude, backend/ klasöründe şu komutu çalıştır:
npm install @nestjs/typeorm typeorm pg

Tekrar dene.
```

### Hata 2: "Port already in use"

```
CLAUDE HATA VERDİ:
Error: Port 3000 is already in use

SENİN ÇÖZÜMÜN:
Claude, .env dosyasında PORT=3000 yerine PORT=3001 yap.

Veya şu komutu çalıştır:
lsof -ti:3000 | xargs kill -9
```

### Hata 3: "Database connection failed"

```
CLAUDE HATA VERDİ:
Error: Connection to database failed

SENİN ÇÖZÜMÜN:
Claude, docker-compose.yml'deki PostgreSQL'i kontrol et.

Şu komutu çalıştır:
docker-compose up -d postgres

.env'deki DATABASE_HOST=localhost olmalı.
```

### Hata 4: "TypeORM entity not found"

```
CLAUDE HATA VERDİ:
Error: Entity "User" not found

SENİN ÇÖZÜMÜN:
Claude, src/app.module.ts'de TypeOrmModule.forRoot içinde
entities: ['dist/**/*.entity.js'] ekle.

Veya:
entities: [User, Announcement, Ad, ...] şeklinde import et.
```

---

## İpuçları ve Püf Noktaları

### 1. Claude'u Yavaşlat

❌ YANLIŞ:
```
Tüm backend'i yaz
```

✅ DOĞRU:
```
Önce Auth modülünü yaz.
Bitince bana haber ver.
```

### 2. Dokümantasyonu Göster

❌ YANLIŞ:
```
Announcements API'sini yaz
```

✅ DOĞRU:
```
docs/04_API_ENDPOINTS_MASTER.md'yi oku,
"3. ANNOUNCEMENTS" bölümünü incele.
Sonra endpoint'leri yaz.
```

### 3. Test İste

❌ YANLIŞ:
```
Auth modülünü yaz
```

✅ DOĞRU:
```
Auth modülünü yaz.
Testlerini de yaz (auth.service.spec.ts).
Coverage %80+ olmalı.
```

### 4. Git Commit At

Her modül bitince:
```
Harika! Şimdi git commit at:
git add .
git commit -m "feat: Auth module completed"
```

### 5. Düzenli Test Et

Her 2-3 modülde bir:
```
Şimdi test edelim:
npm run test
npm run start:dev

API çalışıyor mu kontrol et:
curl http://localhost:3000/health
```

### 6. Hataları Logla

```
Claude, tüm hataları şuraya logla:
- backend/logs/error.log
- backend/logs/combined.log

Winston logger kullan.
```

### 7. Progress Takibi

Her modül bitince:
```
Mükemmel! 

Tamamlanan modüller:
✅ Auth
✅ Users
✅ Announcements
🔄 Ads (devam ediyor)
⏳ Deaths
⏳ Pharmacy
...

Şimdi Ads modülünü bitir.
```

---

## Sık Sorulan Sorular

### S1: Claude çok yavaş çalışıyor
**C:** Normal. Büyük dosyalar okuduğunda 2-3 dakika sürebilir. Sabırlı ol.

### S2: Claude hata verdi ve durdu
**C:** Hatayı kopyala, Claude'a göster: "Bu hatayı çöz: [hata mesajı]"

### S3: Claude yanlış kod yazdı
**C:** "Hayır, bu yanlış. Şöyle olmalı: [açıklama]" de, düzeltsin.

### S4: Claude dosyaları okumadı
**C:** "Lütfen önce docs/04_API_ENDPOINTS_MASTER.md'yi oku" de, bekle.

### S5: Claude token limiti doldu
**C:** Yeni session başlat: `Ctrl+C` → `claude` yeniden başlat.

---

## Özet Checklist

Proje başlamadan önce kontrol et:

- [ ] Claude Code kuruldu (`claude --version`)
- [ ] API key alındı ve login yapıldı
- [ ] Proje klasörü oluşturuldu (`kadirliapp/`)
- [ ] Tüm 10 dosya docs/'a kopyalandı
- [ ] Git başlatıldı (`git init`)
- [ ] Docker kuruldu (opsiyonel ama önerilen)
- [ ] Node.js 20+ yüklü
- [ ] PostgreSQL Docker image'i çekildi

Hepsi tamam mı? Başla!

---

**SON NOT:**

Bu promptları sırayla ver. Her prompt'tan sonra Claude'un işini bitirmesini bekle. Acele etme. Her modül 20-90 dakika sürebilir. Bu normal.

Toplam süre: **8-10 hafta** (günde 2-3 saat çalışırsan)

Başarılar! 🚀
