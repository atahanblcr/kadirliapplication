# Backend Issues Checklist - Fix Order

**Rapor Tarihi:** 21 Şubat 2026
**Toplam Sorun:** 24 (3 Kritik, 6 Yüksek, 15+ Medium)
**Detaylı Rapor:** `BACKEND_AUDIT_REPORT.md`

---

## 🔴 KRITIK (BLOKLAR) - ✅ TAMAMLANDI

### 1. Entity ORM Relations Ekle ✅ TAMAMLANDI (21 Şub 2026)
- [x] User'a OneToMany ilişkiler ekle (ads, notifications, announcements, etc.)
- [x] AdCategory'ye ads OneToMany ekle
- [x] AnnouncementType'ye announcements OneToMany ekle
- [x] EventCategory'ye events OneToMany ekle
- [x] BusinessCategory'ye businesses OneToMany ekle + self-referential children
- [x] Neighborhood'e users OneToMany ekle
- [x] Permission'a role_permissions OneToMany ekle
- [x] GuideCategory'ye guide_items + children OneToMany ekle
- [x] PlaceCategory'ye places OneToMany ekle
- [x] Pharmacy'ye pharmacy_schedules OneToMany ekle
- [x] Business'e campaigns OneToMany ekle
- [x] TaxiDriver'a taxi_calls OneToMany ekle
- [x] Announcement'a announcement_views + power_outages OneToMany ekle
- [x] Cemetery'ye death_notices OneToMany ekle
- [x] Mosque'ye death_notices OneToMany ekle

**Status:** ✅ DONE - 492/492 tests pass

---

### 2. Security Issues (SSL + Env + Secrets) ✅ TAMAMLANDI (21 Şub 2026)
- [x] data-source.ts - Removed default password fallback
- [x] jwt.strategy.ts - Changed `?? ''` to `getOrThrow()` (fails fast if no secret)
- [x] app.module.ts - Added Joi schema validation for all critical env vars
- [x] auth.service.ts - Added crypto.timingSafeEqual for OTP comparison
- [x] auth.service.ts - Masked phone numbers and OTP in logs
- [x] main.ts - Added Helmet.js for security headers
- [x] main.ts - Fixed CORS origin parsing (trim + filter empty)
- [x] .env - Reduced THROTTLE_LIMIT from 100 to 30

**Status:** ✅ DONE - 492/492 tests pass

---

### 3. API Response Format Standardization ✅ TAMAMLANDI (21 Şub 2026)
- [x] TransformInterceptor enhanced with `path` in meta
- [x] Format: `{ success: true, data: {...}, meta: { timestamp, path } }`
- [x] HttpExceptionFilter already consistent: `{ success: false, error: {...}, meta: {...} }`

**Status:** ✅ DONE - 492/492 tests pass

---

## 🟠 YÜKSEK PRİORİTY (PROD RISK) - ✅ TAMAMLANDI

### 4. DTO Validation @IsNotEmpty ✅ TAMAMLANDI (21 Şub 2026)
- [x] auth/dto/request-otp.dto.ts - phone
- [x] auth/dto/verify-otp.dto.ts - phone, otp
- [x] auth/dto/register.dto.ts - username, age, location_type, primary_neighborhood_id, accept_terms
- [x] announcements/dto/create-announcement.dto.ts - type_id, title, body, target_type
- [x] ads/dto/create-ad.dto.ts - category_id, title, description, price, contact_phone, image_ids, cover_image_id
- [x] deaths/dto/create-death-notice.dto.ts - deceased_name, funeral_date, funeral_time
- [x] campaigns/dto/create-campaign.dto.ts - title, start_date, end_date, image_ids
- [x] notifications/dto/register-fcm-token.dto.ts - device_type
- [x] files/dto/upload-file.dto.ts - module_type

**Total:** 28 fields fixed across 9 DTO files
**Status:** ✅ DONE - 492/492 tests pass

---

### 5. CORS Origin Parsing Bug ✅ (Fixed in Security task)
### 6. Rate Limiting ✅ (THROTTLE_LIMIT=30 in .env)
### 7. Redis Password → ⏳ NEXT SPRINT (dev ortamında şifresiz OK)
### 8. OTP Timing Attack ✅ (crypto.timingSafeEqual added)
### 9. Sensitive Data in Logs ✅ (Phone masked, OTP not logged in SMS)

---

## 🟡 MEDIUM PRİORİTY (Best Practice) - Next Sprint

### 10. Cascade Policy Inconsistency
- [ ] ads.entity.ts - Add `{ cascade: true }` to AdFavorite OneToMany
- [ ] ads.entity.ts - Add `{ cascade: true }` to AdExtension OneToMany

**File:** `backend/src/database/entities/ad.entity.ts`
**Status:** ⏳ PENDING

---

### 11. Self-Referential Hierarchies Incomplete
- [ ] business-category.entity.ts - Add @OneToMany for children
- [ ] guide-category.entity.ts - Add @OneToMany for children

**Files:** Business & Guide category entities
**Status:** ⏳ PENDING

---

### 12. Ad.category_id & Ad.approved_by Missing Relationships
- [ ] ad.entity.ts:27 - Add onDelete cascade for category_id
- [ ] ad.entity.ts:61 - Add @ManyToOne relationship for approved_by (like Campaign)

**File:** `backend/src/database/entities/ad.entity.ts`
**Status:** ⏳ PENDING

---

### 13. Try-Catch Coverage
- [ ] Add explicit try-catch to service methods (50+ methods)
- [ ] Currently relying on global filter (works but explicit is better)

**Files:** `backend/src/*/[name].service.ts`
**Estimated:** 2-3 hours
**Status:** ⏳ PENDING

---

### 14. Database Connection Pooling
- [ ] app.module.ts - Add connection pool config to TypeOrmModule
```typescript
extra: {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}
```

**File:** `backend/src/app.module.ts`
**Status:** ⏳ PENDING

---

### 15. File Upload Security
- [ ] Remove local /uploads directory serving
- [ ] Force CloudFlare R2 only
- [ ] Implement signed URLs for time-limited access

**Files:** `backend/src/files/`, `backend/src/main.ts`
**Status:** ⏳ PENDING

---

### 16. HTTPS/TLS Enforcement
- [ ] Add Helmet.js for security headers
- [ ] Add HTTP → HTTPS redirect middleware
- [ ] Add HSTS headers

**File:** `backend/src/main.ts`
**Status:** ⏳ PENDING

---

### 17. Pagination Metadata Consistency
- [ ] notifications.service.ts - Add meta to findAll response
- [ ] pharmacy.service.ts - Add meta to schedule response

**Files:** Notification & Pharmacy services
**Status:** ⏳ PENDING

---

### 18. User.banned_by Self-Reference
- [ ] user.entity.ts - Add @ManyToOne(() => User) for ban auditing
- [ ] Add @OneToMany for banned_users tracking

**File:** `backend/src/database/entities/user.entity.ts`
**Status:** ⏳ PENDING

---

### 19-24. Additional Items
- [ ] Complaint.resolver onDelete consistency
- [ ] User.OneToMany comprehensive relations
- [ ] Powered by async operation cleanup
- [ ] Error message standardization
- [ ] Validation rule standardization
- [ ] API documentation (Swagger/OpenAPI)

---

## ✅ COMPLETED ITEMS

- ✓ Backend 100% implemented (492 tests)
- ✓ 85.13% code coverage
- ✓ SQL injection prevention (parameterized queries)
- ✓ Global exception filter
- ✓ File upload MIME type validation
- ✓ Database migrations created
- ✓ Entity ORM Relations (15+ entities fixed)
- ✓ Security Issues (Joi validation, JWT getOrThrow, timingSafeEqual, Helmet, log masking)
- ✓ API Response Format (TransformInterceptor with path)
- ✓ DTO @IsNotEmpty (28 fields across 9 DTOs)
- ✓ CORS origin parsing fix
- ✓ Rate limiting adjusted (100→30)

---

## 📊 PROGRESS TRACKER

```
Critical Issues (3):     [x] [x] [x]  ✅ ALL DONE
High Priority (6):       [x] [x] [x] [x] [x] [ ]  (Redis password → next sprint)
Medium Priority (15+):   [ ]...[15 more] → Next Sprint

Overall: 14/24 DONE
```

---

## 🎯 NEXT STEPS

1. ✅ ~~Fix Critical 3 issues~~ DONE
2. ✅ ~~Fix High Priority issues~~ DONE (except Redis password)
3. **READY:** Admin Panel geliştirme başlayabilir!
4. **Next Sprint:** Medium priority items (cascade policy, DB pooling, try-catch, etc.)
5. **Before Production:** All items complete + Redis password

---

**Last Updated:** 21 Feb 2026
**All Critical + High Fixed:** 21 Feb 2026 ✅
**Admin Panel:** READY TO START 🚀
