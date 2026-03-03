# Active Context - Şu An Ne Üzerinde Çalışıyorum?

**Son Güncelleme:** 3 Mart 2026
**Durum:** ✅ Backend: 1045+ tests (742 unit + 24 E2E), Coverage 78.82% — ✅ Admin Panel 100% (16/16) — 📱 Flutter: 65% (Auth ✅ + Home ✅ + Announcements ✅ + Ads ✅ + Deaths ✅ + Events ✅ + Pharmacy ✅)

---

## 🎯 SON YAPILAN İŞ

### ✅ COMPLETED: Events (Etkinlikler) ve Pharmacy (Nöbetçi Eczaneler) Modülleri (3 Mart 2026)
- **Events Modülü:**
  - `EventModel` ve `EventDetailModel` Freezed paketleri ile oluşturuldu. String olarak gelen decimal veriler için parse metodu eklendi.
  - `EventsListPage` sonsuz kaydırmalı (infinite scroll) liste görünümü sağlandı.
  - `EventDetailPage` üzerinde etkinlik detayları, harita (url_launcher ile Google Maps) ve paylaşma (share_plus) işlevleri eklendi.
- **Pharmacy Modülü:**
  - `PharmacyPage` üzerinde `table_calendar` kullanılarak "Bugün Nöbetçi" ve "Takvim" adında 2 sekme oluşturuldu.
  - `PharmacyModel` ve `PharmacyScheduleModel` Freezed ile entegre edildi.
  - Eczane kartı üzerine doğrudan arama (tel:) ve haritada görüntüleme işlevleri eklendi.
- **Home Yönlendirmeleri:**
  - `HomePage` içerisindeki grid modüllerinden "Etkinlikler" ve "Nöbetçi Eczaneler" sekmelerine `Navigator.push` yönlendirmeleri eklendi.

### ✅ COMPLETED: Deaths (Vefat İlanları) Modülü & Mimari Düzeltmeler (3 Mart 2026)
- **Flutter Deaths Modülü (Read-Only):**
  - `DeathsListPage`: Sonsuz kaydırmalı (infinite scroll) liste ve "Pull to Refresh" eklendi.
  - `DeathDetailPage`: Detay sayfası oluşturuldu.
  - 🚨 **Mimari Düzeltme:** Başlangıçta yanlışlıkla eklenen "Kullanıcı İlan Ekleme" (Create) özelliği silindi. Proje dokümantasyonunda belirtildiği üzere "Yalnızca ilanlar kullanıcı tarafından eklenebilir, diğer tüm modüller admin panelden yönetilir" kuralına sıkı sıkıya uyuldu.
- **Freezed & JSON Serializable Entegrasyonu:**
  - `pubspec.yaml` dosyasında `hive_generator` ve `riverpod_generator` ile çakışan `json_serializable` versiyon sorunları çözüldü (`json_annotation: ^4.8.1`, `freezed_annotation: ^2.4.1`, `json_serializable: ^6.7.1`).
  - `DeathNoticeModel`, `DeathNoticeDetailModel`, `CemeteryModel` ve `MosqueModel` yapıları baştan aşağı `Freezed` ile yeniden yazıldı.
- **Backend - Frontend JSON Uyumsuzluklarının Giderilmesi:**
  - Backend'den gelen `photo_file` (Obje) ve `photo_url` (String) farklılıklarını tolere edecek `@JsonKey(readValue: _readPhotoUrl)` mantığı modellere eklendi.
  - Backend'den "String" olarak gelen (TypeORM Decimal) `latitude` ve `longitude` değerleri için `_parseDouble` fonksiyonu yazılarak Tip (Type) hataları (String is not a subtype of double) önlendi.
- **Harita Yönlendirmeleri:**
  - `DeathDetailPage` içerisindeki Camii ve Mezarlık satırlarına, eğer koordinat verileri varsa `url_launcher` kullanarak Harita (Google Maps / Apple Maps) açma özelliği eklendi.
- **Test ve Geliştirme Ortamı:**
  - Repository Unit testleri MockDataSource ile yazılıp `%100 PASS` ile doğrulandı.
  - Android Emülatör ağ testi ve "Hesabınız aktif değil" (401 Unauthorized) hatası, PostgreSQL veritabanında test kullanıcısının aktif edilmesiyle (`UPDATE users SET is_active = true WHERE phone = '05551234567';`) çözüldü.

### ✅ COMPLETED: Ads (İlanlar) Modülü & Admin Panel Fixleri (2 Mart 2026)
- **Flutter Ads CRUD:** `AdCreatePage` (4 adımlı stepper) ve `AdEditPage` hayata geçirildi. Filtreleme, arama ve sonsuz kaydırma tam fonksiyonel.
- **API Entegrasyonu:** `files/upload` (UUID) eşleşme hatası ve `subtype of String` null-safety hataları giderildi.
- **Admin Panel Fixleri:** Tailwind v4 monorepo çakışması kök dizin temizliği ile çözüldü, listeleme null-pointer hataları düzeltildi.

---

## 📊 MEVCUT DURUM (3 MART 2026)

### ✅ Backend Test Status
```
Total Tests:    1045+
Status:         Çalışıyor ✅
Durum:          Ready for Flutter integration
```

### Backend API: ✅ OPERATIONAL
```
Base URL:  http://localhost:3000/v1
Auth:      JWT Bearer Token
Admin:     admin@kadirliapp.com / Admin123a
```

### Admin Panel: ✅ FULLY OPERATIONAL (100%)
```
URL:       http://localhost:3001
Framework: Next.js 14 + Tanstack Query
Modüller:  16/16 tamamlandı
```

---

## 🔴 SONRAKİ ADIMLAR

### PRIORITY 1: Flutter Mobile App — Sonraki Modüller
- ✅ Auth, Home, Announcements, Ads, Deaths, Events, Pharmacy modülleri tamamlandı.
- **Sırada:** Campaigns (Kampanyalar), Guide (Rehber), Places (Mekanlar), Taxi (Taksiler).
- Profile (View + Edit) modülünün detaylandırılması.

### PRIORITY 2: Production Deployment
- NGINX config + SSL (Let's Encrypt)
- PM2 configuration
- GitHub Actions: deploy-staging + deploy-production

---

## 🔧 TEKNİK NOTLAR

### API Response Format & Type Safety
- **Önemli:** Koordinat bilgileri (`latitude`, `longitude`) veya Decimal alanlar veritabanından JSON'a `String` olarak gelebilir. Modellerde daima `tryParse` veya özel çevirici kullan.
- **Önemli:** Modüllerde (Ads hariç) veri Ekleme/Düzenleme/Silme işlemi MOBİLDE YOKTUR. Mobil UI sadece gösterim ve detay odaklı olmalıdır.

### Docker Komutları
```bash
docker-compose build backend && docker-compose up -d backend
docker logs kadirliapp-backend --tail=50
```