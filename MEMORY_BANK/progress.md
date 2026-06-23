# Progress Tracker - Proje İlerlemesi

**Proje Başlangıcı:** 20 Şubat 2026
**Son Güncelleme:** 22 Haziran 2026

> Bu dosyadaki sayılar `npm test` / `flutter test` / `npm run lint` çalıştırılarak doğrudan doğrulanmıştır. Eski versiyonlarda (9 Mart 2026) birbiriyle çelişen rakamlar vardı (1045 vs 1073 test) — bu artık düzeltildi.

---

## 📊 Genel İlerleme

```
Backend:      [██████████] 100% ✅ (1070 unit + 3 E2E PASS, lint 0 hata)
Admin Panel:  [██████████] 100% ✅ (TypeScript temiz, lint 0 hata, build başarılı)
Flutter App:  [██████████] 100% ✅ (14/14 modül, 273 test PASS) — Favoriler sekmesi placeholder
Testing:      [██████████] 100% ✅ (Backend coverage %95.33 stmt, hedef %75 — fazlasıyla geçiyor)
Deployment:   [██░░░░░░░░]  20% (Docker + CI/CD dosyaları hazır, henüz hiçbir ortama deploy edilmedi)
```

---

## 🧪 Detaylı Test Denetim Raporu (21 Haziran 2026)

### 1. Backend Testleri
- **Unit Tests:** 1070 test, 58 suite, %100 başarı.
- **E2E Tests:** 3 spec dosyası (`app`, `auth`, `admin-neighborhoods`) — gerçek PostgreSQL kullanır.
- **Lint:** 0 hata, 2180 uyarı (20-21 Haziran'da CI gate'i bloklayan 3315 hata düzeltildi).
- **Coverage:** %95.33 statements / %80.59 branch / %94.79 function / %96.07 line — hedef %75'in çok üzerinde.
- **Sonuç:** ✅ Backend mantığı ve CI pipeline'ı tam çalışır durumda.

### 2. Admin Panel Kontrolleri
- **Lint:** `npm run lint` → **0 hata + 38 uyarı** (22 Haziran 2026'da düzeltildi — bkz. Phase 12). Uyarılar: kullanılmayan import'lar, `next/image` önerisi.
- **Type Check:** `tsc --noEmit` → 0 hata.
- **Build:** `npm run build` → başarılı, 21 route, tümü static.
- **Otomatik test:** Yok — Jest/Vitest/Playwright kurulu değil.
- **Sonuç:** ✅ Fonksiyonel, type-safe ve lint-temiz.

### 3. Flutter App Testleri
- **Test Kapsamı:** 57 test dosyası — data model, repository, datasource, provider katmanları.
- **Başarı Oranı:** 273 test, %100 PASS (22 Haziran'da taxi null-plaka regresyon testi eklendi, 272→273).
- **Analyze:** 0 hata, 112 uyarı / 43 bilgi (hepsi önceden var olan deprecated API/annotation uyarıları).
- **Sonuç:** ✅ Mobil uygulamanın veri, network ve iş katmanı hatasız. Coverage % için CI'da üretilen bir rapor yok (manuel hesaplanmış %88 rakamı doğrulanamıyor — bkz. flutter-app/README.md).

---

## ✅ Tamamlanmış Aşamalar (Özet)

- **Phase 1-6:** Backend (15 iş modülü + admin) ve Admin Panel (16 modül) sıfırdan inşa edildi.
- **Phase 7 (Mobil):** Flutter — 14 modül tamamlandı, entegre edildi ve test edildi.
- **Phase 8 (Refactoring):** Monolitik `AdminService` 11 domain-specific servise bölündü.
- **Phase 9 (Cleanup):** E2E testleri onarıldı, admin panel lint hataları büyük ölçüde sıfırlandı (4 tanesi hâlâ açık).
- **Phase 10 (Final Flutter Features):** Transport ve Notifications tamamlandı (9 Mart 2026).
- **Phase 11 (Bug-fix / CI sağlamlaştırma, 20-21 Haziran 2026):** CI lint gate (3315→0 hata) ve coverage gate ölçüm hatası düzeltildi; admin alan adı uyumsuzlukları (username/full_name, ad approval response tipi) giderildi; Flutter'da mimari denetimden çıkan gerçek bug'lar (Ad.price nullable, DioException Türkçeleştirme eksikliği, auth session-expiry yönlendirmesi) düzeltildi; tüm README'ler ve Memory Bank gerçek koda senkronize edildi.
- **Phase 12 (Admin lint temizliği, 22 Haziran 2026):** Admin panelde kalan 4 lint hatası (`event-form-dialog.tsx`'te 2, `intercity-form.tsx`/`intracity-form.tsx`'te 1'er — hepsi açık `any` kullanımı) giderildi. `payload as any` cast'leri kaldırıldı, ilgili mutation hook'larının zaten beklediği tiplerle (`Partial<AdminEvent>`, `Omit<IntercityRoute,...>`, `Omit<IntracityRoute,...>`) eşleştirildi. `npm run lint` → 0 hata, `tsc --noEmit` → 0 hata, `npm run build` → başarılı.
- **Phase 15 (User Raporu kalemleri #1/#3/#4/#5, 23-24 Haziran 2026):** Tüm proje canlı ayağa kaldırılarak (Docker Postgres+Redis, backend :3000, admin :3001, Flutter Pixel 9 emülatörü) sırasıyla ele alındı. **#1 (overflow):** emülatörde tüm modül ekranları gezildi; tek gerçek overflow ana ekran "Bildirimler" banner'ındaydı (`module_card.dart` `_FilledTile` dikey Column, 26px) → `horizontal` yatay düzen eklendi, banner ona + height 96'ya geçirildi, emülatörde 0 overflow doğrulandı. **#3 (eksik aksiyon):** ortak `core/utils/map_launcher.dart` eklendi; pharmacy/places/guide/events/campaigns/deaths gerçek "Yol Tarifi" (`maps/dir`) + adres fallback'ine geçti (places'ın "Yol Tarifi Al" etiketi aslında `maps/search` açıyordu — yalancıydı). Eczane yön tarifi butonu emülatörde canlı kanıtlandı. **#4 (ghost column):** `schema:log` ile entity↔DB drift'i ölçüldü, ghost column yok; tek kozmetik `pharmacy_schedules` time-default quirk'i entity'yi `'HH:00:00'` formatına hizalayarak giderildi (schema artık "up to date"); 266 kolonun tamamı kodda referanslı. **#5 (hata/refresh):** 7 repository ham `DioException` yerine ortak Türkçe `mapDioError`'a geçirildi; pull-to-refresh tüm liste sayfalarında zaten mevcuttu. Doğrulama: backend build + pharmacy testleri 40/40 PASS, `flutter analyze` değişen dosyalarda 0 yeni hata. ⚠️ #3'ün places/guide/events/campaigns/deaths yayılımı ve #5 mapper değişiklikleri canlı test EDİLMEDİ (sadece statik analiz) — push sonrası emülatörde elle test gerekiyor. Kalan: UI overhaul (#1 tasarım turu), form validasyonları, cache senaryoları.
- **Phase 14 (Veri görünürlüğü "Veri Yok" kök neden + canlı uçtan-uca doğrulama, 23 Haziran 2026):** Kullanıcı raporundaki #2 (admin'de veri var ama mobilde "Veri Yok") araştırıldı. **Kök neden:** `backend/scripts/create-all-mock.ts` mock announcement'ı `status` set etmiyordu → entity default `'draft'`, ama public endpoint `status='published'` filtreliyor; ayrıca seeder çoğu modülü (ads/deaths/campaigns/pharmacy/guide/transport/places) hiç doldurmuyordu. **Admin panel create akışlarının hepsi doğru görünürlük defaultı atıyor** (announcements/events→published, deaths/campaigns→approved, taxi→is_verified+is_active, geri kalan entity'ler DB-level `is_active=true` default) — yani admin akışı sağlamdı, sorun yalnızca seeder'daydı. Seeder, **her kayıt ilgili public görünürlük filtresini geçecek** şekilde tüm modülleri kapsayacak biçimde yeniden yazıldı (idempotent, count===0 kontrollü). Çalıştırırken yakalanan gerçek hata: `death_notices.auto_archive_at` NOT NULL + DB-default yok → admin akışıyla aynı şekilde (cenaze+7gün) eklendi. `package.json`'a `seed:mock` script'i eklendi. **Canlı doğrulama (API):** Docker Postgres+Redis ayağa kaldırıldı, migration + seed + seed:mock çalıştırıldı, backend dev server'a gerçek JWT ile tüm public endpoint'ler tek tek vuruldu — hepsi veri döndürdü: announcements 1, events 1, places 1, taxi/drivers 1, ads 3, deaths 2, campaigns 1, pharmacy/current ✓, guide 2, transport/intercity 1, transport/intracity 1. Tip kontrolü: `tsc --noEmit` seeder için 0 hata.
**Canlı doğrulama (uçtan uca, gerçek cihaz):** Admin paneli (`:3001`, aynı `/v1` API) + Flutter uygulaması Pixel 9 Android emülatöründe (`10.0.2.2:3000`) çalıştırıldı. Flutter'da Etkinlikler ekranı "Kadirli Yaz Festivali"ni, Vefat İlanları ekranı seeder'ın eklediği "Hüseyin Demir" kaydını gerçekten **render etti** — backend→API→Flutter zinciri kanıtlandı, "Veri Yok" gitti.
**Bonus — canlı testte yakalanan gerçek UI bug'ı (#1'in bir parçası):** Ana ekrandaki "Bildirimler" wide-banner'ı (`module_card.dart` `_FilledTile`, dikey Column, height 110) emülatörde **26px bottom overflow** veriyordu (52px ikon + başlık + 2-satır alt başlık 70px alana sığmıyordu). `_FilledTile`'a `horizontal` düzen eklendi (ikon solda, metin sağda, `mainAxisSize.min`), banner bu düzene + height 96'ya geçirildi. Emülatörde yeniden çalıştırıldı: 0 overflow, banner temiz render oldu. `flutter analyze` (değişen dosyalar) → 0 sorun.
- **Phase 13 (Gemini denetim raporu doğrulaması, 22 Haziran 2026):** Gemini'nin 4 iddiası tek tek koda bakılarak doğrulandı. Gerçek çıkanlar düzeltildi: (1) Flutter `TaxiDriverModel.plaka` backend'de nullable olduğu halde `required String` idi → plakasız şoför gelince taksi sayfası çöküyordu, `String?` yapıldı + regresyon testi eklendi (Ad.price hatasının ikizi). (2) Admin'de backend'de hiç var olmayan `full_name` alanına dayanan tip yalanları — Gemini'nin işaret ettiğinden daha geniş kapsamlı çıktı; en önemlisi `PendingApproval.user.full_name`'in dashboard'daki "Bekleyen Onaylar" widget'ında fallback'siz kullanılıp kullanıcı adını boş göstermesiydi (gerçek bug, Gemini bunu atlamıştı), diğerleri (`Ad`, `AdListItem`, `Announcement.creator`, `DeathNotice.adder`) zaten `?? username` fallback'i sayesinde görünür hata vermiyordu. Hepsi `username`'e göre düzeltildi; `Complaint.reporter/reviewer/resolver.full_name` bilerek dokunulmadı çünkü backend orada gerçekten dolduruyor. (3) Kullanılmayan `RecentActivity.user` alanı kaldırıldı (backend hiç doldurmuyor, UI hiç okumuyor). (4) Gemini'nin `is_local` query-string iddiası yanlış çıktı (zaten doğru çalışıyordu) ama inceleme `event-admin.controller.ts`'de DTO'nun zaten yaptığı dönüşümün gereksiz yere tekrar manuel parse edildiğini ortaya çıkardı, sadeleştirildi. Doğrulama: backend 1070/1070 test + 0 lint hatası + build başarılı; admin 0 tip/lint hatası + build başarılı; Flutter 273/273 test (yeni regresyon testiyle) + analyze'de yeni hata yok.

---

## 🔴 Bekleyen Görevler (Öncelik Sırasıyla)

1. **🚀 Production deployment:** `docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md` adımları (NGINX + PM2 + SSL) henüz hiçbir ortamda uygulanmadı.
2. **📱 Store Hazırlıkları:** İkon, App Store/Play Store meta verileri, gerçek bir build/release henüz yapılmadı.
3. **Flutter eksikleri:** Favoriler sekmesi hâlâ placeholder; backend'de var olan `complaints` modülü için Flutter UI'ı yok.

---

## 🛠️ Yakın Zamanda Tespit Edilen Kritik Hatalar ve Yapılacaklar (User Raporu - 23 Haziran 2026)

Kullanıcı geri bildirimlerine ve tespitlere dayalı olarak acilen ele alınması gereken iyileştirme kalemleri aşağıdadır:

1. **📱 Mobil UI/UX ve Ana Ekran (Home) Hataları:** 🟡 KISMEN (Phase 15, 23-24 Haziran 2026)
   - ✅ Overflow taraması: emülatörde tüm modül ekranları gezildi. Tek gerçek overflow ana ekrandaki "Bildirimler" banner'ındaydı (26px, `module_card.dart` `_FilledTile` dikey Column) — yatay düzene çevrildi, emülatörde 0 overflow doğrulandı.
   - ⬜ Tasarım/hissiyat overhaul'u (animasyon, modern UI) hâlâ bekliyor — bu ayrı, büyük bir tur (Master Prompt ile planlanacak).

2. **🗃️ Veri Senkronizasyonu ve API Filtreleme (Data Visibility):** ✅ ÇÖZÜLDÜ (Phase 14, 23 Haziran 2026)
   - ~~Admin panelden eksiksiz şekilde veri girildiği halde mobil uygulamada "Veri Yok" mesajı alınan modüller var.~~
   - Kök neden bozuk mock seeder'dı (draft announcement + çoğu modül hiç doldurulmamış). Admin panel create akışları zaten doğru görünürlük defaultı atıyor. Seeder yeniden yazıldı, canlı backend'de tüm public endpoint'ler veri döndürüyor (uçtan uca doğrulandı). Detay: yukarıda Phase 14.

3. **🔗 Eksik Fonksiyonlar ve UX Zayıflıkları:** ✅ ÇÖZÜLDÜ (Phase 15)
   - ✅ Eczanede gerçek "Yol Tarifi" butonu eklendi. Ayrıca tüm modüllerde tutarsızlık vardı: places "Yol Tarifi Al" diyip aslında `maps/search` (arama) açıyordu (yalancı etiket); diğerleri "Haritada Gör" ile sadece konum gösteriyordu.
   - ✅ Ortak `core/utils/map_launcher.dart` eklendi (`openDirections`=`maps/dir`, `openLocation`=`maps/search`, `callPhone`). pharmacy/places/guide/events/campaigns/deaths hepsi gerçek yön tarifine geçti; koordinat yoksa **adres metniyle fallback** yapıyor (koordinatsız kayıtlarda da çalışır). Canlı kanıt: eczanede "Yol Tarifi" → Google Haritalar yön tarifi modunda açıldı (adres fallback'iyle).

4. **🗂️ Veritabanı ve Şema (Schema) Uyuşmazlıkları (Ghost Columns & Leftovers):** ✅ ÇÖZÜLDÜ (Phase 15)
   - Canlı DB'de TypeORM `schema:log` ile entity↔DB drift'i ölçüldü: **ghost column yok** (ne fazla ne eksik kolon). Tek fark `pharmacy_schedules.start_time/end_time` default'unun kozmetik `'19:00'` vs `'19:00:00'` quirk'iydi; entity Postgres formatına (`'19:00:00'`) hizalandı → `schema:log` artık "up to date".
   - Kod-ölü kolon taraması: 266 entity property'sinin tamamı kodda referanslı, tamamen ölü kolon yok.

5. **🔍 Tahmini Diğer Eksiklikler:** 🟡 KISMEN (Phase 15)
   - ✅ Ham hata Türkçeleştirme: 7 repository (guide/notifications/places/taxi/transport/events/pharmacy) ham `DioException`'ı UI'a fırlatıyordu → ortak `mapDioError`'a geçirildi (Türkçe `AppException`). ads/campaigns/deaths zaten kullanıyordu, announcements lokal `_handleDioError` ile çözüyordu.
   - ✅ Pull-to-refresh: tüm liste sayfaları zaten `RefreshIndicator`'a sahip (denetlendi, eksik yok).
   - ⬜ Form/input validasyonları (sayı/harf, tarih seçici) derin denetimi henüz yapılmadı.
   - ⬜ Cache (Redis)/local state anlık güncelleme senaryoları henüz incelenmedi.

> ⚠️ **CANLI TEST NOTU (24 Haziran 2026):** Phase 15'in #1 overflow düzeltmesi ve #3 eczane yön tarifi butonu emülatörde canlı doğrulandı. Ancak #3'ün diğer modüllere (places/guide/events/campaigns/deaths) yayılan değişiklikleri ve #5 hata-mapper değişiklikleri **canlı test edilmedi** — yalnızca `flutter analyze` (0 yeni hata) ile statik doğrulandı. Push sonrası bu ekranların emülatörde elle test edilmesi gerekiyor.
