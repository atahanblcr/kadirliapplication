# Admin Panel Endpoints - Quick Reference

## Base URL
```
http://localhost:3000/v1
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

---

## Dashboard Module

### Get Dashboard Overview
```
GET /admin/dashboard
```

**Response:** Dashboard statistics (users, ads, campaigns, etc.)

---

## Approvals Module

### Get Pending Approvals
```
GET /admin/approvals?page=1&limit=10
```

### Approve Ad
```
POST /admin/ads/:id/approve
```

### Reject Ad
```
POST /admin/ads/:id/reject
Body: { reason: string }
```

---

## Deaths Module

### Get Death Notices
```
GET /admin/deaths?page=1&limit=10
```

### Get Death Neighborhoods
```
GET /admin/deaths/neighborhoods
```

### Create Death Notice
```
POST /admin/deaths
Body: {
  deceased_name: string (required),
  funeral_date: string (YYYY-MM-DD, required),
  funeral_time: string (HH:mm, required),
  age?: number,
  cemetery_id?: UUID,
  mosque_id?: UUID,
  condolence_address?: string,
  photo_file_id?: UUID,
  neighborhood_id?: UUID
}
```

### Update Death Notice
```
PATCH /admin/deaths/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Death Notice
```
DELETE /admin/deaths/:id
```

---

## Cemeteries Module

### Get Cemeteries
```
GET /admin/deaths/cemeteries?page=1&limit=10
```

### Create Cemetery
```
POST /admin/deaths/cemeteries
Body: {
  name: string (required),
  address?: string,
  latitude?: number,
  longitude?: number,
  is_active?: boolean
}
```

### Update Cemetery
```
PATCH /admin/deaths/cemeteries/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Cemetery
```
DELETE /admin/deaths/cemeteries/:id
```

---

## Mosques Module

### Get Mosques
```
GET /admin/deaths/mosques?page=1&limit=10
```

### Create Mosque
```
POST /admin/deaths/mosques
Body: {
  name: string (required),
  address?: string,
  latitude?: number,
  longitude?: number,
  is_active?: boolean
}
```

### Update Mosque
```
PATCH /admin/deaths/mosques/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Mosque
```
DELETE /admin/deaths/mosques/:id
```

---

## Campaigns Module

### Get Campaigns
```
GET /admin/campaigns?page=1&limit=10&status=approved
```

Query params:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: "draft" | "approved" | "rejected"
- `search`: string (business name)
- `business_id`: UUID

### Get Businesses for Dropdown
```
GET /admin/campaigns/businesses
```

### Create Campaign
```
POST /admin/campaigns
Body: {
  business_id: UUID (required),
  title: string (required),
  description: string,
  discount_rate: number (0-100),
  valid_from: string (YYYY-MM-DD),
  valid_until: string (YYYY-MM-DD),
  code: string
}
```

**Note:** Auto-approved when created by admin

### Update Campaign
```
PATCH /admin/campaigns/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Campaign
```
DELETE /admin/campaigns/:id
```

---

## Users Module

### Get Users
```
GET /admin/users?page=1&limit=10
```

Query params:
- `page`: number
- `limit`: number
- `search`: string (phone/username)
- `role`: "user" | "taxi_driver" | "business" | "moderator" | "admin" | "super_admin"
- `is_banned`: boolean

**Known Issue:** Empty `role` parameter causes 400 error - omit param if not filtering

### Get User Detail
```
GET /admin/users/:id
```

### Ban User
```
POST /admin/users/:id/ban
Body: {
  ban_reason: string,
  duration_days?: number
}
```

### Unban User
```
POST /admin/users/:id/unban
```

---

## Pharmacy Module

### Get Pharmacies
```
GET /admin/pharmacy?page=1&limit=10
```

Query params:
- `page`: number
- `limit`: number
- `search`: string (name/address)

### Create Pharmacy
```
POST /admin/pharmacy
Body: {
  name: string (required),
  phone: string,
  address: string,
  latitude?: number,
  longitude?: number
}
```

### Update Pharmacy
```
PATCH /admin/pharmacy/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Pharmacy
```
DELETE /admin/pharmacy/:id
```

### Get Pharmacy Schedule
```
GET /admin/pharmacy/schedule?start_date=2026-01-01&end_date=2026-12-31
```

### Assign Pharmacy Schedule
```
POST /admin/pharmacy/schedule
Body: {
  pharmacy_id: UUID (required),
  date: string (YYYY-MM-DD, required),
  start_time?: string (HH:mm, default: 19:00),
  end_time?: string (HH:mm, default: 09:00)
}
```

### Delete Schedule
```
DELETE /admin/pharmacy/schedule/:id
```

---

## Transport - Intercity Module

### Get Intercity Routes
```
GET /admin/transport/intercity?page=1&limit=10
```

Query params:
- `page`: number
- `limit`: number

**Known Issue:** Search parameter not supported - use frontend filtering

### Create Intercity Route
```
POST /admin/transport/intercity
Body: {
  company_name: string (required),
  from_city: string (required),
  to_city: string (required),
  duration_minutes: number,
  price: number,
  amenities?: string[],
  contact_phone?: string,
  contact_website?: string,
  is_active?: boolean
}
```

### Update Intercity Route
```
PATCH /admin/transport/intercity/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Intercity Route
```
DELETE /admin/transport/intercity/:id
```

### Add Schedule to Route
```
POST /admin/transport/intercity/:id/schedules
Body: {
  departure_time: string (HH:mm, required),
  days_of_week: number[] (0-6, required),
  is_active?: boolean
}
```

### Update Schedule
```
PATCH /admin/transport/intercity/schedules/:scheduleId
Body: { /* same fields as POST, all optional */ }
```

### Delete Schedule
```
DELETE /admin/transport/intercity/schedules/:scheduleId
```

---

## Transport - Intracity Module

### Get Intracity Routes
```
GET /admin/transport/intracity?page=1&limit=10
```

Query params:
- `page`: number
- `limit`: number

**Known Issue:** Search parameter not supported - use frontend filtering

### Create Intracity Route
```
POST /admin/transport/intracity
Body: {
  name: string (required),
  line_number: string,
  description?: string,
  estimated_duration_minutes?: number,
  price?: number,
  is_active?: boolean
}
```

### Update Intracity Route
```
PATCH /admin/transport/intracity/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Intracity Route
```
DELETE /admin/transport/intracity/:id
```

### Add Stop to Route
```
POST /admin/transport/intracity/:id/stops
Body: {
  name: string (required),
  latitude: number (required),
  longitude: number (required),
  order: number (required),
  time_from_start: string (HH:mm, required)
}
```

### Update Stop
```
PATCH /admin/transport/intracity/stops/:stopId
Body: { /* same fields as POST, all optional */ }
```

### Delete Stop
```
DELETE /admin/transport/intracity/stops/:stopId
```

### Reorder Stop
```
PATCH /admin/transport/intracity/stops/:stopId/reorder
Body: {
  new_order: number (required)
}
```

---

## Neighborhoods Module

### Get Neighborhoods
```
GET /admin/neighborhoods?page=1&limit=10
```

Query params:
- `page`: number
- `limit`: number
- `type`: "neighborhood" | "village"
- `is_active`: boolean
- `search`: string (name)

**Known Issue:** Empty `type` parameter causes 400 error - omit param if not filtering

### Create Neighborhood
```
POST /admin/neighborhoods
Body: {
  name: string (required),
  type: "neighborhood" | "village" (required),
  slug?: string (auto-generated if omitted),
  population?: number,
  latitude?: number,
  longitude?: number,
  display_order?: number,
  is_active?: boolean
}
```

### Update Neighborhood
```
PATCH /admin/neighborhoods/:id
Body: { /* same fields as POST, all optional */ }
```

### Delete Neighborhood
```
DELETE /admin/neighborhoods/:id
```

---

## Scrapers Module

### Get Scraper Logs
```
GET /admin/scrapers/logs?page=1&limit=10
```

### Run Scraper (Super Admin Only)
```
POST /admin/scrapers/:name/run
```

Available scraper names: `announcements`, `ads`, etc.

---

## Common Query Parameters

All paginated endpoints support:
```
?page=1&limit=10&search=term
```

Response pagination meta:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Common Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.000Z",
    "path": "/v1/admin/..."
  }
}
```

---

## Error Handling

400 Bad Request - Validation error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description of what failed"
  }
}
```

401 Unauthorized - Missing or invalid token
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

403 Forbidden - Insufficient permissions
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "This action requires higher permissions"
  }
}
```

404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

## Taxi Module

### List Taxi Drivers
```
GET /admin/taxi
```

**Query Params:**
| Param | Type | Açıklama |
|-------|------|----------|
| search | string | Ad, telefon veya plakada ILIKE arama |
| is_active | boolean | true / false |
| is_verified | boolean | true / false |
| page | number | Sayfa no (default: 1) |
| limit | number | Sayfa boyutu (default: 20) |

> ⚠️ **ÖNEMLI:** Sıralama her istekte `ORDER BY RANDOM()` — her refresh farklı sıra

**Response:**
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "id": "uuid",
        "name": "Ahmet Kaya",
        "phone": "05001234567",
        "plaka": "01AKY123",
        "vehicle_info": "Beyaz Fiat Egea",
        "registration_file_id": null,
        "registration_file_url": null,
        "license_file_id": null,
        "is_verified": true,
        "is_active": true,
        "total_calls": 0,
        "created_at": "2026-02-23T...",
        "updated_at": "2026-02-23T..."
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

---

### Get Taxi Driver Detail
```
GET /admin/taxi/:id
```

**Response:** `{ "success": true, "data": { "driver": { ...fields... } } }`

---

### Create Taxi Driver
```
POST /admin/taxi
```

**Request Body:**
```json
{
  "name": "Ahmet Kaya",
  "phone": "05001234567",
  "plaka": "01AKY123",
  "vehicle_info": "Beyaz Fiat Egea",
  "registration_file_id": "uuid-optional",
  "license_file_id": "uuid-optional",
  "is_active": true,
  "is_verified": true
}
```

> `name` ve `phone` zorunlu. `is_verified` default `true` (admin eklediyse otomatik doğrulanmış).

**Validation:** Plaka unique kontrolü — aynı plaka 2 sürücüde olamaz (`400 Bu plaka numarası zaten kayıtlı`)

**Response:** `{ "success": true, "data": { "driver": { ...fields... } } }`

---

### Update Taxi Driver
```
PATCH /admin/taxi/:id
```

**Request Body:** Tüm alanlar opsiyonel (Partial)
```json
{
  "vehicle_info": "Siyah VW Passat",
  "is_verified": false,
  "is_active": false
}
```

**Response:** `{ "success": true, "data": { "driver": { ...updated fields... } } }`

---

### Delete Taxi Driver
```
DELETE /admin/taxi/:id
```

**Response:** `204 No Content` (body yok)

> Soft delete (`deleted_at = NOW()`)

---

## Known Issues & Workarounds

### ~~Issue #1: Users Role Filter~~ ✅ FIXED (22 Şubat 2026)
**Fixed:** `query-users.dto.ts` - Empty string `role=` now treated as no-filter via `@Transform`

### ~~Issue #2: Neighborhoods Type Filter~~ ✅ FIXED (22 Şubat 2026)
**Fixed:** `query-neighborhoods.dto.ts` - Empty string `type=` now treated as no-filter via `@Transform`

### ~~Issue #3: Intercity Search~~ ✅ FIXED (22 Şubat 2026)
**Fixed:** `query-intercity-routes.dto.ts` - `search` field added + service ILIKE query

### ~~Issue #4: Intracity Search~~ ✅ FIXED (22 Şubat 2026)
**Fixed:** `query-intracity-routes.dto.ts` - `search` field added + service ILIKE query

---

## Testing Notes

- All timestamps are in ISO-8601 format
- All dates are in YYYY-MM-DD format
- All times are in HH:mm or HH:mm:ss format
- All UUIDs are in RFC 4122 format
- Soft deletes are used (deleted_at field, not hard deletion)
- Admin-created entities are auto-approved where applicable
- Pagination is 1-indexed (page 1 is first page)

---

**Last Updated:** 2026-02-23
**Status:** Production Ready
**Issues:** 4 minor (all non-critical)
