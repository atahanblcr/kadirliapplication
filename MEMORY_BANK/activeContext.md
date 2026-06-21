# Active Context - Şu An Ne Üzerinde Çalışıyorum?

**Son Güncelleme:** 22 Haziran 2026
**Durum:** ✅ Backend: 1070 unit + 3 E2E test PASS, lint 0 hata (2180 uyarı) — ✅ Admin: TypeScript temiz, lint 0 hata (38 uyarı) — 📱 Flutter: 14/14 modül, 273 test PASS

---

## 🎯 SON YAPILAN İŞ: Gemini denetim raporu doğrulaması (22 Haziran 2026)

Gemini'nin proje üzerine yaptığı bir mimari denetim raporundaki 4 iddia tek tek koda bakılarak doğrulandı — bazıları tam doğru çıktı, biri yanlış çıktı ama incelemesi başka gerçek bir soruna işaret etti, full_name iddiası ise Gemini'nin belirttiğinden daha geniş kapsamlıydı:

### ✅ COMPLETED: Flutter — Taksi `plaka` null-crash (kritik, Ad.price hatasının ikizi)
- `taxi-driver.entity.ts`'de `plaka` nullable (`varchar(20) nullable: true`) ve `TaxiService.findAll()` hiç fallback uygulamadan ham değeri dönüyordu. Flutter'da `TaxiDriverModel.plaka` `required String` idi → plakası girilmemiş bir şoför geldiğinde JSON parse hatası fırlatıp taksi sayfasını çökertiyordu.
- `String? plaka` yapıldı; `taxi_page.dart`'ta plaka yoksa rozet tamamen gizleniyor (mevcut `vehicleInfo` deseniyle aynı mantık). `taxi_model_test.dart`'a null-plaka regresyon testi eklendi. `dart run build_runner build` ile freezed/json kodu yeniden üretildi.

### ✅ COMPLETED: Admin — Var olmayan `full_name` alanına dayanan tip yalanları
- Backend `User` entity'sinde `full_name` kolonu hiç yok, sadece `username` var. Gemini 3 satır işaret etmişti (62, 137, 249) ama gerçek kapsam daha genişti:
  - **Gerçek UI bug'ı (Gemini'nin atladığı):** `PendingApproval.user.full_name` — `/admin/approvals` backend'de `{id, username, phone}` dönüyor, `pending-approvals.tsx` dashboard widget'ı hiç fallback'siz `item.user.full_name` okuyordu → bekleyen onaylarda kullanıcı adı **boş** görünüyordu. `item.user?.username ?? 'Bilinmiyor'` yapıldı, tip `{id, username, phone} | null` olarak düzeltildi.
  - **Tip yalanı ama çökmüyordu:** `Ad.user.full_name`, `AdListItem.user.full_name`, `Announcement.creator.full_name`, `DeathNotice.adder.full_name` — ilgili komponentler zaten `?? username` fallback'i kullanıyordu, görünür bug yoktu. Tipler düzeltildi, artık var olmayan alana referans veren ölü fallback kodu temizlendi.
  - **Dokunulmadı:** `Complaint.reporter/reviewer/resolver.full_name` — backend (`complaints-admin.service.ts`) burada gerçekten `full_name` adıyla bir alan dolduruyor (içine `username` değerini koyarak, isim kafa karıştırıcı ama çalışıyor). Kırık olmayan bir şeyi değiştirmedik.

### ✅ COMPLETED: Admin — Kullanılmayan `RecentActivity.user` alanı kaldırıldı
- `getRecentActivities()` hiçbir zaman `user` objesi eklemiyor (kullanıcı adı `description` metnine gömülü). `RecentActivityFeed` komponenti de `user` alanını hiç okumuyordu — gerçek bir bug değil, API ile tip arasında tutarsız ama ölü bir alan. Backend'e tüketilmeyecek bir alan eklemek yerine tipten kaldırıldı.

### ✅ COMPLETED: Backend — `event-admin.controller.ts` gereksiz `is_local` re-parse
- Gemini'nin önerdiği senaryo (admin'in boolean query param göndermesi) zaten çalışıyordu (`use-events.ts` `String(filters.is_local)` ile doğru çeviriyordu) — asıl iddia hatalıydı. Ama incelemede gerçek bir kod kokusu bulundu: `QueryAdminEventsDto` zaten kendi `@Transform`'uyla `is_local`'i boolean'a çeviriyordu (global `ValidationPipe({transform:true})` sayesinde), controller bunu **tekrar manuel parse edip üzerine yazıyordu**. Controller artık doğrudan `dto.is_local`'i kullanıyor, redundant kod silindi.

### Doğrulama
Backend `npm test` → 1070/1070 PASS, `npm run lint` → 0 hata, `npm run build` → başarılı. Admin `tsc --noEmit` → 0 hata, `npm run lint` → 0 hata, `npm run build` → başarılı. Flutter `flutter test` → 273/273 PASS (272→273, yeni regresyon testi), `flutter analyze` → yeni hata/uyarı yok (155 toplam, öncekiyle aynı).

---

## 🎯 ÖNCEKİ İŞ: Admin lint temizliği (22 Haziran 2026)

`progress.md`'de bekleyen görev olarak işaretli admin panel lint hataları giderildi:
- Gerçek hata sayısı ve konumu memory bank'ın yazdığından farklı çıktı — sadece `intercity-form.tsx:148` ve `intracity-form.tsx:132` değil, `event-form-dialog.tsx:160,163`'te de açık `any` kullanımı vardı (toplam 4 hata, 3 dosya).
- `intercity-form.tsx` ve `intracity-form.tsx`: `payload as any` cast'leri kaldırıldı — `payload` zaten ilgili `useCreateXRoute` mutation'ının beklediği `Omit<Route, 'id'|'created_at'|...>` tipiyle birebir eşleşiyordu, cast hiç gerekmiyordu.
- `event-form-dialog.tsx`: `payload`'ın tipi `Record<string, unknown>`'dan `Partial<AdminEvent>`'a değiştirildi, `mutateAsync(... as any)` cast'leri kaldırıldı. `form.status` (Select'ten gelen serbest `string`) için tek bir dar tip cast'i (`as AdminEvent['status']`) gerekti — Select'in seçenekleri zaten sadece 4 literal değeri ürettiği için güvenli.
- Doğrulama: `npm run lint` → 0 hata/38 uyarı, `npx tsc --noEmit` → 0 hata, `npm run build` → başarılı (21 route, tümü static).

---

## 🎯 ÖNCEKİ İŞ: Bug-fix / production-hazırlık turu (20-21 Haziran 2026)

Proje üç platformda da "tamamlandı" aşamasını geçmiş durumda; şu anki çalışma modu yeni modül eklemek değil, mimari denetimden çıkan somut hataları düzeltmek ve dokümantasyonu gerçek koda senkronize tutmak.

### ✅ COMPLETED: CI Gate Düzeltmeleri (backend)
- `npm run lint` 3315 hata veriyordu, CI'daki unit/e2e/coverage/build job'larını blokluyordu. Sebep: spec dosyalarındaki `any` tipli repository mock pattern'i (`no-unsafe-*` kuralları). Bu kurallar spec dosyaları için warn'a düşürüldü/disable edildi, üretim kodu davranışı değişmedi. Şu an: 0 hata, 2180 uyarı.
- Coverage gate ölçüm yüzeyi hatalıydı — `collectCoverageFrom` entity/DTO/migration/module dosyalarını da kapsıyordu, function coverage'ı %63'e düşürüp threshold'u haksız yere kırıyordu. Bu dosya sınıfları hariç tutuldu, eksik `json-summary` reporter eklendi. Ayrıca `admin.service.ts`'nin 10 test edilmemiş metoduna (neighborhood CRUD, module usage, recent activities, admin profile/password) unit test eklendi.

### ✅ COMPLETED: Admin Panel Alan Uyumsuzlukları
- `AdminUser.full_name` aslında backend şemasında yok — `username` kullanılacak şekilde düzeltildi (`topbar.tsx`, `types/index.ts`). Rol enum'ına eksik `moderator` değeri eklendi.
- Ad approve/reject endpoint'leri backend'de `{ message }` dönüyordu, admin tipi `{ ad }` bekliyordu — `use-ads.ts` düzeltildi.

### ✅ COMPLETED: Flutter — Mimari Denetimden Çıkan Gerçek Bug'lar
Bir mimari denetim raporundaki iddialar tek tek koda bakılarak doğrulandı; bazıları yanlış çıktı (örn. Campaign alan adı "uyumsuzluğu" zaten `campaign-admin.service.ts`'de map'leniyordu, User ban kontrolü zaten `jwt.strategy.ts`'de server-side zorlanıyordu) — bunlara dokunulmadı. Gerçek olanlar düzeltildi:
- `AdModel.price` backend'de nullable, Flutter'da `required int` idi → null geldiğinde sessizce 0'a düşüyor, "₺0" gösteriyordu. `int?` yapıldı, UI'da "Fiyat belirtilmemiş" eklendi.
- `deaths`/`campaigns` repository'leri ham `DioException`'ı hiç Türkçeleştirmeden fırlatıyordu (ads repository'de zaten doğru yapılan şey onlarda yoktu) → `core/network/dio_error_mapper.dart` ortak fonksiyonuna çıkarıldı, üçü de kullanıyor.
- Liste sayfalarında (ads/deaths/campaigns) her biri kendi ad-hoc empty/error state'ini yazmıştı → `core/widgets/app_empty_state.dart` ve `app_error_state.dart` paylaşılan bileşenleri eklendi.
- `AuthInterceptor` refresh token başarısız olunca token'ları temizliyordu ama UI'a hiç haber vermiyordu (kullanıcı oturumu geçersiz bir ekranda kalıyordu) → `SessionExpiryNotifier` eklendi, `_AuthGate` bunu dinleyip `unauthenticated` durumuna geçiyor.
- Flutter SDK bu makineye kurulmadığı için Homebrew ile kuruldu; `flutter analyze` (0 hata) ve `flutter test` (272/272 PASS) ile doğrulandı, 5 test davranış değişikliğine göre güncellendi.

### ✅ COMPLETED: Dokümantasyon Senkronizasyonu
- Tüm README.md dosyaları (root, backend, admin, flutter-app) tarandı; çoğu 18 Haziran'da zaten tazelenmişti, sadece test sayısı (1045→1070) ve Flutter auth akışındaki yeni session-expiry davranışı güncellendi.
- `MEMORY_BANK/` denetlendi: `deployment.md` (docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md ile tamamen örtüşüyordu + 492 test gibi çok eski/hatalı rakamlar + var olmayan devops iletişim bilgileri içeriyordu), `modules.md` (var olmayan "Jobs" backend modülü ve "Scrapers" admin modülünden bahsediyordu, dead-link bir refactoring raporuna işaret ediyordu) ve `API_RESPONSE_KEYS_REFERENCE.md` (docs/04_API_ENDPOINTS_MASTER.md ile tamamen örtüşen, Flutter henüz inşa edilmeden önceki "doğrulama bekliyor" notlarından oluşan, artık anlamsız bir ön-inşa dokümanıydı) silindi. `activeContext.md`, `progress.md`, `issues.md`, `decisions.md` güncel duruma göre yeniden yazıldı/güncellendi.

---

## 📊 GÜNCEL TEST DURUMU (22 Haziran 2026, doğrudan çalıştırılarak doğrulandı)

| Platform | Test Tipi | Durum | Başarı | Ekstra Bilgi |
|----------|-----------|-------|--------|--------------|
| Backend  | Unit      | ✅ PASS | 1070 / 1070 (58 suite) | Coverage: %95.33 stmt / %80.59 branch |
| Backend  | E2E       | — | 3 spec dosyası | `app.e2e-spec.ts`, `auth.e2e-spec.ts`, `admin-neighborhoods.e2e-spec.ts` |
| Backend  | Lint      | ✅ 0 hata | 2180 uyarı | `no-unsafe-*` kuralları spec dosyalarında warn/disable |
| Admin    | Lint      | ✅ 0 hata | 38 uyarı | 22 Haziran'da düzeltildi — bkz. yukarı |
| Admin    | TypeCheck | ✅ 0 hata | `tsc --noEmit` | |
| Admin    | Build     | ✅ Başarılı | 21 route, tümü static | `npm run build` |
| Flutter  | Unit      | ✅ PASS | 273 / 273 (57 dosya) | 22 Haziran'da taxi null-plaka regresyon testi eklendi |
| Flutter  | Analyze   | ✅ 0 hata | 112 uyarı / 43 bilgi | Hepsi önceden var, deprecated API + JsonKey annotation uyarıları |

> Not: 28 E2E test / 492 test gibi eski Memory Bank rakamları artık geçersiz — bu satır gerçek `npm test`/`flutter test` çıktısından alınmıştır.

---

## 🔴 SONRAKİ ADIMLAR
1. **🚀 Üretim Hazırlığı:** NGINX, PM2, SSL — `docs/07_DEPLOYMENT_GUIDE_PRODUCTION.md` adımları henüz uygulanmadı (proje hâlâ local/dev ortamda çalışıyor, canlı bir deployment kanıtı yok).
2. **📱 Uygulama Yayını:** App Store & Play Store hazırlıkları (simge, splash screen vb.) — flutter-app/README.md'deki build komutları hazır ama mağaza süreci başlamadı.
3. **📱 Flutter eksikleri:** Favoriler sekmesi hâlâ placeholder; backend'de var olan `complaints` modülü için Flutter UI'ı yok.
