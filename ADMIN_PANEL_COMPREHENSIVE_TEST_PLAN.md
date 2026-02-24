# Admin Panel - Comprehensive Test Plan (24 Şubat 2026)

**Test Sürü:** Manual interactive test
**Admin URL:** http://localhost:3001
**Backend API:** http://localhost:3000/v1 ✅ (Operational)
**Admin Credentials:** admin@kadirliapp.com / Admin123a ✅ (Verified)

---

## 📋 GENEL TEST CHECKLIST

### Pre-Login Tests
- [ ] **Login Page Erişim**
  - [ ] http://localhost:3001/login sayfası yükleniyor
  - [ ] Email/password input'ları var
  - [ ] "Giriş Yap" butonu var
  - [ ] CSS/styling düzgün görünüyor

- [ ] **Login Fonksiyonalitesi**
  - [ ] Email: admin@kadirliapp.com, Password: Admin123a ile giriş
  - [ ] Giriş başarılı, dashboard'a yönlendiriliyor
  - [ ] URL: http://localhost:3001/dashboard (NOT /)
  - [ ] Cookies set ediliyor (accessToken, refreshToken, user)

---

## 🎯 MODULE TESTS (Post-Login)

### 1. 📊 DASHBOARD
**Location:** http://localhost:3001/dashboard

**Tests:**
- [ ] **Page Load & Layout**
  - [ ] Sayfa yükleniyor (loading skeleton gösteriliyor)
  - [ ] "Dashboard" başlığı var
  - [ ] Tüm bileşenler render ediliyor

- [ ] **KPI Cards**
  - [ ] Toplam Kullanıcılar (Total Users)
  - [ ] Aktif İlanlar (Active Ads)
  - [ ] Beklemede Onaylar (Pending Approvals)
  - [ ] Bugün Duyuruları (Announcements Today)
  - [ ] Değişim yüzdeleri gösteriliyor

- [ ] **User Growth Chart**
  - [ ] Grafik render ediliyor
  - [ ] X eksen (date): 2026-01-01 → 2026-02-21
  - [ ] Y eksen (users): 10200 → 12847
  - [ ] Trend gösteriyor

- [ ] **Module Usage Chart**
  - [ ] Pie/bar chart gösteriliyor
  - [ ] 8 modül listeli (İlanlar, Duyurular, Eczane, vb)
  - [ ] Sayılar gösteriliyor

- [ ] **Quick Actions**
  - [ ] Hızlı erişim butonları (3-4 tane)
  - [ ] Butonlara click yapılabiliyor

- [ ] **Recent Activities**
  - [ ] Son 6 aktivite listesi
  - [ ] Timestamp'ler görünüyor
  - [ ] Activity type ikonları var

- [ ] **Pending Approvals**
  - [ ] 4 ilan/kampanya/vefat beklemede
  - [ ] "Detay Gör" butonu click edince modal açılıyor
  - [ ] Pagination var (Total > 4 ise)

---

### 2. 📢 ANNOUNCEMENTS
**Location:** http://localhost:3001/announcements

**Tests:**
- [ ] **List View**
  - [ ] Anlaşılır tablo görüntüleniyor
  - [ ] Sütunlar: ID, Başlık, Kaynak, Durum, Oluşturma Tarihi
  - [ ] Pagination çalışıyor
  - [ ] Aramaya göre filtreleme yapılıyor

- [ ] **CRUD Operations**
  - [ ] "Yeni Duyuru" butonu → form açılıyor
  - [ ] Form: Başlık, İçerik (textarea), Kaynak (manuel/scraping), Kategoriler
  - [ ] "Kaydet" → API çağrısı yapılıyor
  - [ ] Başarılı save → tablo güncelleniyor
  - [ ] Row üzerine gelince edit/delete butonları çıkıyor
  - [ ] Edit → form aynı verilerle doldurulmuş
  - [ ] Delete → confirmation dialog → siliniyor

- [ ] **Status Management**
  - [ ] İlanlar: draft, published, archived
  - [ ] Durum değişikliği yapılabiliyor
  - [ ] Durum değişince row'da color update

- [ ] **Type Management**
  - [ ] Duyuru türleri varsa gösteriliyor
  - [ ] Type ekleme/silme yapılabiliyor

- [ ] **Approval Workflow**
  - [ ] Scraping kaynağından gelmiş duyuru draft başlıyor
  - [ ] Manuel duyuru otomatik published
  - [ ] İçeriği beğenilmezse reject edilebiliyor

---

### 3. 📰 ADS (İlanlar)
**Location:** http://localhost:3001/ads

**Tests:**
- [ ] **List View**
  - [ ] Ilan tablosu yükleniyor
  - [ ] Sütunlar: ID, Başlık, Kategori, Fiyat, Durum, Sahibi
  - [ ] Pagination çalışıyor

- [ ] **Filtering & Search**
  - [ ] Arama box'ına yazı yazınca filtrele
  - [ ] Status filter (draft, pending, approved, rejected, expired)
  - [ ] Category filter
  - [ ] Price range filter (min-max)
  - [ ] Date range filter

- [ ] **Pending Approvals Tab**
  - [ ] "Onay Bekleyen" tab'ı var
  - [ ] Pending ilan'lar gösteriliyor
  - [ ] Approve butonu → "Onayla" dialog → API → ilan approved
  - [ ] Reject butonu → "Reddet" dialog (reason field) → API → ilan rejected

- [ ] **CRUD Operations**
  - [ ] İlan detayı modal/page'de açılıyor
  - [ ] Edit → form doldurulmuş → save → update
  - [ ] Delete → confirmation → removed from table

- [ ] **Expiration Logic**
  - [ ] Yeni ilan: expires_at = NOW() + 7 gün
  - [ ] Uzatma: "Uzat" butonu (3 reklam izledikten sonra)
  - [ ] Max 3 uzatma sınırı var mı?
  - [ ] 3 gün ekleniyor her uzatmada

- [ ] **Image Management**
  - [ ] İlan'da multiple images var
  - [ ] İlk image cover image'dı
  - [ ] Image reorder (drag-drop)
  - [ ] Image delete

---

### 4. ⚰️ DEATHS (Vefat İlanları)
**Location:** http://localhost:3001/deaths

**Tests:**
- [ ] **List View**
  - [ ] Vefat ilan tablosu
  - [ ] Sütunlar: İsim, Tarih, Cenaze Yıkama, Defin, Durum
  - [ ] Pagination

- [ ] **Filtering**
  - [ ] Durum filter (pending, approved, rejected, archived)
  - [ ] Tarih range filter
  - [ ] Arama (kişi adına göre)

- [ ] **CRUD Operations**
  - [ ] "Yeni Vefat" → form açılıyor
  - [ ] Form alanları:
    - [ ] Ölen Kişi Adı
    - [ ] Cenaze Yıkama Meseleri (Mosques - multi-select)
    - [ ] Defin Meselesi (Cemetery - select)
    - [ ] Cenaze Yıkama Tarihi/Saati
    - [ ] Defin Tarihi/Saati
  - [ ] Save → tablo güncelleniyor
  - [ ] Edit → form doldurulmuş
  - [ ] Delete

- [ ] **Cemetery & Mosque Management**
  - [ ] "Mezarlıklar" tab'ı var
  - [ ] Mezarlık listesi gösteriliyor
  - [ ] CRUD operations (add/edit/delete)
  - [ ] "Cenaze Yıkama Meseleri" tab'ı
  - [ ] Mosque listesi
  - [ ] CRUD operations

- [ ] **Auto Archiving**
  - [ ] Defin tarihi + 7 gün = auto_archive_at
  - [ ] Archived ilan'lar "Arşiv" tab'ında
  - [ ] Eski ilan'lar otomatik arşivleniyor

- [ ] **Approval Workflow**
  - [ ] Yeni vefat pending başlıyor
  - [ ] Approve/Reject yapılabiliyor
  - [ ] Rejected ilan'lar gözükmüyor (list'ten filtre ile)

---

### 5. 📣 CAMPAIGNS
**Location:** http://localhost:3001/campaigns

**Tests:**
- [ ] **List View**
  - [ ] Kampanya tablosu
  - [ ] Sütunlar: İsim, Hedef Mahalles, Başl. Tarihi, Bit. Tarihi, Durum
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Kampanya" → form
  - [ ] Form alanları:
    - [ ] Kampanya Adı
    - [ ] Açıklama (textarea)
    - [ ] Hedef Mahalleler (multi-select)
    - [ ] Başlangıç Tarihi
    - [ ] Bitiş Tarihi
    - [ ] Kategorisi (select)
  - [ ] Save → list update
  - [ ] Edit/Delete

- [ ] **Approval Workflow**
  - [ ] Pending kampanya'lar görünüyor
  - [ ] Approve → active
  - [ ] Reject → rejected

- [ ] **Filtering**
  - [ ] Durum filter
  - [ ] Tarihe göre filter

---

### 6. 👥 USERS
**Location:** http://localhost:3001/users

**Tests:**
- [ ] **List View**
  - [ ] Kullanıcı tablosu
  - [ ] Sütunlar: İsim, Email, Telefon, Rol, Durum, Kayıt Tarihi
  - [ ] Pagination
  - [ ] Toplam kullanıcı sayısı gösteriliyor

- [ ] **CRUD Operations**
  - [ ] User detayı modal/page'de açılıyor
  - [ ] Edit → user bilgileri update
  - [ ] Delete → user soft-delete (account_status = deleted)

- [ ] **Role Management**
  - [ ] Kullanıcı role'ü var (user, premium, banned)
  - [ ] Role change → "Rolü Değiştir" dialog → API → update
  - [ ] Roller: user, premium, banned

- [ ] **Ban/Unban**
  - [ ] "Kullanıcıyı Engelle" butonu
  - [ ] Ban → banned, hesap kapalı
  - [ ] Unban → unbanned, hesap açılıyor

- [ ] **Search & Filter**
  - [ ] İsme, email'e, telefona göre arama
  - [ ] Durum filter (active, banned, deleted)
  - [ ] Rol filter

---

### 7. 💊 PHARMACY
**Location:** http://localhost:3001/pharmacy

**Tests:**
- [ ] **List View**
  - [ ] Eczane tablosu
  - [ ] Sütunlar: Adı, Telefon, Adres, Durum
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Eczane" → form
  - [ ] Form: İsim, Telefon, Adres, Email
  - [ ] Save/Edit/Delete

- [ ] **Schedule Management**
  - [ ] "Açık Eczaneler" tab'ı
  - [ ] Schedule ekleme (gün/saat)
  - [ ] Week view'de açık eczaneler gösteriliyor
  - [ ] Renkli highlight (open)

- [ ] **Search & Filter**
  - [ ] İsme göre arama
  - [ ] Adreste ara
  - [ ] Filtreleme

---

### 8. 🚐 TRANSPORT
**Location:** http://localhost:3001/transport

**Tests:**

#### 8A. INTERCITY (Şehirlerarası)
- [ ] **List View**
  - [ ] Şehirlerarası taşıyıcı tablosu
  - [ ] Sütunlar: Kalkış, Varış, Kapasite, Fiyat
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Rota" → form
  - [ ] Form: Kalkış şehri, varış şehri, kapasite, fiyat/km
  - [ ] Save/Edit/Delete

- [ ] **Schedule Management**
  - [ ] "Sefer Saatleri" tab'ı
  - [ ] Rota için sefer ekleme (gün/saat)
  - [ ] Sefer silme

#### 8B. INTRACITY (Şehir içi)
- [ ] **List View**
  - [ ] Şehir içi taşıyıcı tablosu
  - [ ] Sütunlar: Adı, Duraklar, Kapasite
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Hat" → form
  - [ ] Form: Hat adı, durak sayısı, kapasitesi
  - [ ] Save/Edit/Delete

- [ ] **Stops Management**
  - [ ] Hattın durakları listesi
  - [ ] Duraklara tıkla → detay gösteriliyor
  - [ ] Duraklara yeni duraç ekleme
  - [ ] Duraç silme
  - [ ] Duraç sırasını değiştir (drag-drop reorder)

---

### 9. 🏘️ NEIGHBORHOODS
**Location:** http://localhost:3001/neighborhoods

**Tests:**
- [ ] **List View**
  - [ ] Mahalle listesi
  - [ ] Sütunlar: İsim, Kod, Nüfus
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Mahalle" → form
  - [ ] Form: İsim, Kod, Açıklama
  - [ ] Save/Edit/Delete

- [ ] **Search & Filter**
  - [ ] İsme göre arama çalışıyor

---

### 10. 🚕 TAXI
**Location:** http://localhost:3001/taxi

**Tests:**
- [ ] **List View**
  - [ ] Taksi listesi
  - [ ] Sütunlar: Adı, Telefon, Plaka
  - [ ] Pagination
  - [ ] **KRITIK:** ORDER BY RANDOM() (not order column) - liste sırası random'dur

- [ ] **CRUD Operations**
  - [ ] "Yeni Taksi" → form
  - [ ] Form: Adı, Telefon, Plaka, Vehikül Tipi
  - [ ] Save/Edit/Delete

- [ ] **Search & Filter**
  - [ ] İsme/telefona göre arama
  - [ ] Plakaya göre filtre

---

### 11. 🎉 EVENTS
**Location:** http://localhost:3001/events

**Tests:**
- [ ] **List View**
  - [ ] Etkinlik tablosu
  - [ ] Sütunlar: İsim, Kategori, Tarihi, Yeri, Durum
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Etkinlik" → form
  - [ ] Form: İsim, Kategori, Tarih/Saat, Yer, Açıklama, Organizer
  - [ ] Save/Edit/Delete

- [ ] **Category Management**
  - [ ] "Kategoriler" tab'ı
  - [ ] Kategori listesi
  - [ ] Kategori CRUD (add/edit/delete)

- [ ] **Search & Filter**
  - [ ] İsme göre arama
  - [ ] Kategori filter
  - [ ] Tarih range filter

---

### 12. 📖 GUIDE
**Location:** http://localhost:3001/guide

**Tests:**

#### 12A. CATEGORIES (Kategoriler)
- [ ] **Hierarchical Structure**
  - [ ] Kategori tablosu (parent-child)
  - [ ] Parent kategori düzeyi 1
  - [ ] Child kategori düzeyi 2
  - [ ] Max 2 seviye hiyerarşi
  - [ ] Circular reference kontrol

- [ ] **CRUD Operations**
  - [ ] "Yeni Kategori" → form
  - [ ] Form: Adı, Parent kategori (nullable)
  - [ ] Save/Edit/Delete
  - [ ] **Circular check:** Parent = child ise error
  - [ ] Alt kategor'si olan kategoriyi sileme engel
  - [ ] Alt item'i olan kategoriyi sileme engel

#### 12B. ITEMS (Rehber Öğeleri)
- [ ] **List View**
  - [ ] Kategori açınca item'ler gösteriliyor
  - [ ] Sütunlar: İsim, Telefon, Koordinatlar
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Öğe" → form
  - [ ] Form alanları:
    - [ ] İsim
    - [ ] Telefon
    - [ ] Latitude (gerekli)
    - [ ] Longitude (gerekli)
    - [ ] Açıklama
    - [ ] Kategori
  - [ ] **Adres alanı YOK** (koordinat girişine taşındı)
  - [ ] Koordinat girdikten sonra "Haritada Gör" link çıkıyor
  - [ ] Save/Edit/Delete

- [ ] **Coordination Link**
  - [ ] Item detayında "Konumu Gör" Maps linki
  - [ ] Link format: https://maps.google.com/?q=lat,lng
  - [ ] Maps açılıyor ve lokasyon gösteriliyor

---

### 13. 🏢 PLACES (Mekanlar)
**Location:** http://localhost:3001/places

**Tests:**

#### 13A. CATEGORIES (Mekan Kategorileri)
- [ ] **List View**
  - [ ] Kategori listesi
  - [ ] Sütunlar: İsim, Ikon
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Kategori" → form
  - [ ] Form: İsim, İkon (select/upload)
  - [ ] Save/Edit/Delete

#### 13B. PLACES (Mekanlar)
- [ ] **List View**
  - [ ] Mekan tablosu
  - [ ] Sütunlar: İsim, Kategori, Koordinatlar, Cover Foto
  - [ ] Pagination

- [ ] **CRUD Operations**
  - [ ] "Yeni Mekan" → form
  - [ ] Form alanları:
    - [ ] İsim (zorunlu)
    - [ ] Kategori (select)
    - [ ] Lat/Lng (zorunlu, koordinat giriş)
    - [ ] Açıklama (textarea)
  - [ ] Save/Edit/Delete

- [ ] **Image Management**
  - [ ] "Fotoğraflar" tab'ı
  - [ ] Upload butonu → multiple file select
  - [ ] Uploaded images tabloda
  - [ ] İlk image = cover image (ikon gösteriliyor)
  - [ ] "Kapak Yap" → image cover image oluyor
  - [ ] Drag-drop ile sıra değiştime
  - [ ] Delete butonu → image deleted
  - [ ] Cover image korunuyor (başka cover seç gerekir)

---

### 14. 📋 COMPLAINTS (Şikayetler)
**Location:** http://localhost:3001/complaints

**Tests:**
- [ ] **List View**
  - [ ] Şikayet tablosu
  - [ ] Sütunlar: ID, Konu, Şikayet Türü, Durum, Öncelik, Tarih
  - [ ] Pagination
  - [ ] URGENT (kırmızı öncelik) kırmızı highlight

- [ ] **Filtering & Search**
  - [ ] Durum filter (pending, under_review, resolved, rejected)
  - [ ] Öncelik filter (low, medium, high, urgent)
  - [ ] Hedef tip filter (ad, user, listing)
  - [ ] Tarih range filter
  - [ ] Raporcu user'a göre filter
  - [ ] Search box

- [ ] **Complaint Detail Modal**
  - [ ] Modal açılıyor, 3 section:
    - [ ] **Bilgiler:** ID, başlık, açıklama, durum, öncelik
    - [ ] **Belgeler:** evidence file'lar download link'i
    - [ ] **History:** review/resolve/reject history zaman sırasıyla
  - [ ] Tarih/saat gösteriliyor

- [ ] **Review Workflow**
  - [ ] "İnceleme Başlat" butonu → inceleme başlıyor
  - [ ] Status: pending → under_review
  - [ ] "Resolve" butonu → complaint resolved
  - [ ] "Reject" butonu → complaint rejected (reason)
  - [ ] Tarih otomatik güncelleniyor (reviewed_at)

- [ ] **Priority Management**
  - [ ] Öncelik butonu (dropdown)
  - [ ] low → medium → high → urgent
  - [ ] Update otomatik

---

### 15. ⚙️ SETTINGS
**Location:** http://localhost:3001/settings

**Tests:**
- [ ] **Tabs Structure**
  - [ ] 5 tab: Genel, Bildirimler, API Keys, Görünüm, Profil

#### 15A. GENEL (General)
- [ ] **Read-Only Info**
  - [ ] Sistem versiyonu
  - [ ] Database bilgisi
  - [ ] Active users count
  - [ ] API endpoints count
  - [ ] Edit butonları yok

#### 15B. BİLDİRİMLER (Notifications)
- [ ] **Checkboxes**
  - [ ] Email notifications (toggle)
  - [ ] Push notifications (toggle)
  - [ ] SMS notifications (toggle)
  - [ ] In-app notifications (toggle)
  - [ ] Seçimler localStorage'da persist ediyor
  - [ ] Page refresh'ten sonra seçimler korunuyor

#### 15C. API KEYS
- [ ] **API Key Management**
  - [ ] Mevcut API key listesi (masked)
  - [ ] "Generate New Key" butonu
  - [ ] "Copy to Clipboard" butonu
  - [ ] "Revoke" butonu

#### 15D. GÖRÜNÜM (Appearance)
- [ ] **Theme Picker**
  - [ ] Light theme → UI ışık rengine döner
  - [ ] Dark theme → UI koyu rengine döner
  - [ ] System (auto) → OS temasını takip ediyor
  - [ ] Seçim localStorage'da persist ediyor
  - [ ] CSS class: html.dark veya html (light)

- [ ] **Font Size**
  - [ ] Small / Medium / Large dropdown
  - [ ] UI fontsize değişiyor
  - [ ] Seçim persist

#### 15E. PROFİL (Profile)
- [ ] **Admin Profile Update**
  - [ ] Mevcut bilgiler: Email, Username, Telefon (read-only gösteriliyor)
  - [ ] "Profili Düzenle" butonu → form açılıyor
  - [ ] Form: Email (readonly), Username (edit), Telefon (edit)
  - [ ] Save → API PATCH /admin/profile
  - [ ] Success message
  - [ ] Bilgiler güncelleniyor

- [ ] **Change Password**
  - [ ] "Şifreyi Değiştir" butonu → dialog
  - [ ] Form: Eski Şifre, Yeni Şifre, Tekrar Yeni Şifre
  - [ ] Eski şifre verify ediliyor (bcrypt)
  - [ ] Yeni şifre requirements (min 8 char, vb)
  - [ ] Save → API PATCH /admin/change-password
  - [ ] Success → automatic logout + login page'ye yönlendir

---

### 16. 🔧 SCRAPERS (Kazıyıcılar)
**Location:** http://localhost:3001/scrapers

**Tests:**
- [ ] **Scraper List**
  - [ ] Aktif scraper'lar listesi
  - [ ] Sütunlar: İsim, Son Çalışma Tarihi, Durum
  - [ ] Pagination

- [ ] **Run Scraper**
  - [ ] "Çalıştır" butonu → API POST /admin/scrapers/{name}/run
  - [ ] Toast: "Scraper çalıştırılıyor..."
  - [ ] Başarılı → green toast
  - [ ] Hata → red error toast

- [ ] **View Logs**
  - [ ] "Logs" tab'ı
  - [ ] Log listesi (timestamp, message, level)
  - [ ] Pagination
  - [ ] Filter by level (info, warn, error)
  - [ ] Filter by scraper name
  - [ ] "Clear Logs" butonu

---

### 17. 🔐 AUTHENTICATION & NAVIGATION
**Location:** http://localhost:3001

**Tests:**
- [ ] **Login Flow**
  - [ ] Login page → email/password → giriş
  - [ ] Redirect: /dashboard ✅ (NOT /)
  - [ ] Cookies set (accessToken, refreshToken, user)

- [ ] **Protected Routes**
  - [ ] Login olmadan /dashboard'a gidemiyorsun → /login redirect
  - [ ] Access token expire olunca → /login redirect
  - [ ] Refresh token ile auto-renewal

- [ ] **Logout**
  - [ ] Settings → Profil tab'ında "Çıkış Yap" butonu
  - [ ] Click → cookies deleted
  - [ ] Redirect: /login
  - [ ] Geri dön → protected (redirect to login)

- [ ] **Navigation Sidebar**
  - [ ] Tüm modülü link'leri var
  - [ ] Active link highlight
  - [ ] Collapse/expand responsive (mobile)
  - [ ] Modüller: Dashboard, Announcements, Ads, Deaths, Campaigns, Users, Pharmacy, Transport, Neighborhoods, Taxi, Events, Guide, Places, Complaints, Scrapers, Settings

- [ ] **Responsive Design**
  - [ ] Desktop (1920px) → full sidebar
  - [ ] Tablet (768px) → collapsed sidebar
  - [ ] Mobile (375px) → hamburger menu
  - [ ] All modüles accessible

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### Backend Test Failures (39 FAIL)
```
❌ admin/admin.service.spec.ts
   → GuideCategory/GuideItem injection missing
   → Fix: Add repository mocks to TestingModule

❌ files/files.service.spec.ts
   → 10MB validation test (file: undefined)
   → Fix: Mock MultipartFile properly
```

**Status:** ⚠️ Not blocking admin panel functionality

---

## 📊 SUCCESS CRITERIA

All tests must pass for each module:
- ✅ Component renders
- ✅ CRUD operations work
- ✅ API calls successful
- ✅ UI/UX smooth
- ✅ Error handling present
- ✅ Responsive design

---

## 📝 TEST RESULT TEMPLATE

For each module, fill in:

```markdown
### [MODULE_NAME] - Test Results
**Date:** 24 Şubat 2026
**Tester:** [Your Name]
**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

#### Tests
- [x] Feature A: PASS
- [x] Feature B: PASS
- [ ] Feature C: FAIL (description)

#### Notes
- Performance: Fast/Slow
- UI/UX: Good/Needs improvement
- Issues: None / List here

#### Screenshots
- [Link to screenshot 1]
- [Link to screenshot 2]
```

---

**Test başla!** Admin panel'i açarak başlayabilirsin:
http://localhost:3001/login (admin@kadirliapp.com / Admin123a)
