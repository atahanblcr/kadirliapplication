# API Response Keys Reference (26 Feb 2026)

**Last Updated:** 26 Şubat 2026
**Method:** Real API testing against running backend + admin panel
**Status:** ✅ Verified working endpoints

---

## Standard Response Structure

All API endpoints follow this structure:

```json
{
  "success": true,
  "data": {
    "<MODULE_KEY>": [...],     // ← Key varies by module (see table below)
    "meta": {                   // ← Pagination data (only for list endpoints)
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {                     // ← TransformInterceptor (all endpoints)
    "timestamp": "2026-02-26T12:46:25.542Z",
    "path": "/v1/announcements?page=1&limit=5"
  }
}
```

**CRITICAL FOR FLUTTER DEVELOPERS:**
- **Pagination:** `response.data['data']['meta']` (NOT top-level meta!)
- **List Items:** Key varies by module (see table below)
- **API Meta:** `response.data['meta']` contains timestamp + path only

---

## Module Response Keys Table

| # | Module | Endpoint | Data Key | Type | Auth | Status |
|---|--------|----------|----------|------|------|--------|
| 1 | Announcements | GET /announcements | `announcements` | List | ✅ | ✅ |
| 2 | Announcements Detail | GET /announcements/:id | `announcement` | Detail | ✅ | ✅ |
| 3 | Ads | GET /ads | `ads` | List | ❌ | ✅ |
| 4 | Ads Detail | GET /ads/:id | `ad` | Detail | ❌ | ✅ |
| 5 | Ads Categories | GET /ads/categories | `categories` | List | ❌ | ✅ |
| 6 | Campaigns | GET /campaigns | `campaigns` | List | ❌ | ✅ |
| 7 | Campaigns Detail | GET /campaigns/:id | `campaign` | Detail | ❌ | ✅ |
| 8 | Deaths | GET /deaths | `deaths` | List | ✅ | ⚠️ |
| 9 | Deaths Detail | GET /deaths/:id | `death` | Detail | ✅ | ⚠️ |
| 10 | Cemeteries | GET /deaths/cemeteries | `cemeteries` | List | ❌ | ✅ |
| 11 | Events | GET /events | `events` | List | ❌ | ⚠️ |
| 12 | Events Detail | GET /events/:id | `event` | Detail | ❌ | ⚠️ |
| 13 | Events Categories | GET /events/categories | `categories` | List | ❌ | ✅ |
| 14 | Pharmacy List | GET /pharmacy/list | `pharmacies` | List | ❌ | ✅ |
| 15 | Pharmacy Current | GET /pharmacy/current | `pharmacy` | Detail | ❌ | ✅ |
| 16 | Pharmacy Schedule | GET /pharmacy/schedule | `schedule` | List | ❌ | ✅ |
| 17 | Transport Intercity | GET /transport/intercity | `routes` | List | ❌ | ⚠️ |
| 18 | Transport Intracity | GET /transport/intracity | `routes` | List | ❌ | ⚠️ |
| 19 | Taxi Drivers | GET /taxi/drivers | `drivers` | List | ❌ | ⚠️ |
| 20 | Jobs | GET /jobs | `jobs` | List | ❌ | ⚠️ |
| 21 | Guide Categories | GET /guide/categories | `categories` | List | ❌ | ✅ |
| 22 | Guide Items | GET /guide | `items` | List | ❌ | ⚠️ |
| 23 | Places | GET /places | `places` | List | ❌ | ⚠️ |
| 24 | Places Detail | GET /places/:id | `place` | Detail | ❌ | ⚠️ |
| 25 | Notifications | GET /notifications | `notifications` + `unread_count` | List | ✅ | ✅ |
| 26 | Users Me | GET /users/me | `user` | Detail | ✅ | ✅ |

**Legend:**
- ✅ Working - Tested and verified
- ⚠️ Needs verification - Possibly requires authentication or has data issues
- ❌ No auth - Public endpoint
- ✅ Auth required - Requires JWT Bearer token

---

## Query Parameters by Module

### Pagination (All List Endpoints)
```
?page=1 (default: 1)
?limit=20 (default: 20, max: 100)
```

### Sorting
```
?sort=-created_at    // Descending
?sort=created_at     // Ascending
```

### Filtering Examples

**Announcements:**
```
?type_id=uuid
?priority=emergency|high|normal|low
?neighborhood=merkez
```

**Ads:**
```
?category_id=uuid
?min_price=1000
?max_price=50000
?search=iphone
```

**Campaigns:**
```
?category_id=uuid
?active_only=true
```

**Events:**
```
?category_id=uuid
?city=Kadirli|Adana|Osmaniye
```

---

## Auth Pattern for Flutter

```dart
// For authenticated endpoints:
final response = await _client.get(
  '/path',
  options: Options(
    headers: {'Authorization': 'Bearer $token'}
  ),
);

// Extract data with proper structure:
final dataField = response.data['data'] as Map<String, dynamic>;
final items = (dataField['announcements'] as List<dynamic>? ?? [])
    .map((e) => Model.fromJson(e as Map<String, dynamic>))
    .toList();

// Extract pagination:
final metaField = dataField['meta'] as Map<String, dynamic>? ?? {};
final total = metaField['total'] as int? ?? 0;
```

---

## Testing Notes (26 Feb 2026)

**Test Script:** `/tmp/test_all_apis.sh`

**Working Endpoints (Verified):**
- ✅ GET /announcements (with auth token)
- ✅ GET /ads
- ✅ GET /ads/categories
- ✅ GET /campaigns
- ✅ GET /pharmacy/list
- ✅ GET /pharmacy/schedule
- ✅ GET /pharmacy/current
- ✅ GET /notifications (with auth token)
- ✅ GET /users/me (with auth token)
- ✅ GET /events/categories
- ✅ GET /guide/categories
- ✅ GET /deaths/cemeteries

**Endpoints Needing Verification:**
- Deaths endpoints (may need specific auth role)
- Events list (may need specific auth role)
- Transport endpoints (may need specific auth role)
- Taxi endpoints (may need specific auth role)
- Jobs endpoints (may need specific auth role)
- Guide items (may need specific auth role)
- Places endpoints (may need specific auth role)

---

## Next: Flutter Implementation Order

1. ✅ **Auth Module** - Done (25 Feb)
2. ✅ **Home Screen** - Done (26 Feb)
3. ✅ **Announcements** - Done (26 Feb) using `announcements` key
4. **Ads Module** - Next priority (use `ads` key for list, `ad` for detail)
5. **Profile Module** - After Ads
6. **Campaigns** - Use `campaigns` key
7. **Pharmacy** - Use `pharmacies` key (note: plural form!)
8. **Events** - Use `events` key (verify auth if needed)
9. **Deaths** - Use `deaths` key
10. Other modules...

---

**Last Tested:** 26 Şubat 2026, 12:46 UTC
**Backend Status:** ✅ Operational
**Admin Panel:** ✅ Operational
