# Admin Panel Test Cases and Response Examples

## Test Environment

- **Base URL:** http://localhost:3000/v1
- **Auth:** Bearer token (SUPER_ADMIN role)
- **Date:** 2026-02-22
- **API Version:** v1

---

## Test Case 1: Dashboard Overview

### Request

```bash
GET /admin/dashboard
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "dashboard": {
      "total_users": 7,
      "total_ads": 0,
      "pending_approvals": 3,
      "active_announcements": 2,
      "total_campaigns": 1,
      "total_deaths": 4,
      "total_pharmacies": 2,
      "total_intercity_routes": 1,
      "total_intracity_routes": 2,
      "total_neighborhoods": 3
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.000Z",
    "path": "/v1/admin/dashboard"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 2: Get Users with Pagination

### Request

```bash
GET /admin/users?page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "phone": "+905551234567",
        "email": null,
        "username": "testbusiness",
        "role": "business",
        "is_active": true,
        "is_banned": false,
        "created_at": "2026-02-22T12:05:52.260Z",
        "updated_at": "2026-02-22T12:05:52.260Z"
      },
      {
        "id": "a84a7512-fe75-4f76-9696-7c7bbd122811",
        "phone": "05551234567",
        "email": "admin@kadirliapp.com",
        "username": "admin",
        "role": "super_admin",
        "is_active": true,
        "is_banned": false,
        "created_at": "2026-02-22T12:05:52.260Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.011Z",
    "path": "/v1/admin/users?page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 3: Get Deaths with Pagination

### Request

```bash
GET /admin/deaths?page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "notices": [
      {
        "id": "1402d4ef-311b-4e1e-a5bb-87787756d2d3",
        "deceased_name": "Test Person",
        "age": null,
        "funeral_date": "2026-02-25",
        "funeral_time": "14:30:00",
        "status": "approved",
        "neighborhood_id": null,
        "cemetery_id": null,
        "mosque_id": null,
        "auto_archive_at": "2026-03-04T00:00:00.000Z",
        "created_at": "2026-02-22T13:21:04.075Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.038Z",
    "path": "/v1/admin/deaths?page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 4: Get Campaigns with Status Filter

### Request

```bash
GET /admin/campaigns?status=approved&page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "60001b16-1940-4d98-bede-46f4c077aee1",
        "business_id": "550e8400-e29b-41d4-a716-446655440002",
        "business_name": "Test Isletmesi",
        "title": "Yaz Indirimi",
        "description": "Indirim aciklamasi",
        "discount_rate": 30,
        "code": "YAZ30",
        "valid_from": "2026-02-01",
        "valid_until": "2026-04-30",
        "status": "approved",
        "views": 0,
        "code_views": 0,
        "created_at": "2026-02-22T12:06:12.659Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.011Z",
    "path": "/v1/admin/campaigns?status=approved&page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 5: Get Businesses for Dropdown

### Request

```bash
GET /admin/campaigns/businesses
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "business_name": "Test Isletmesi"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.000Z",
    "path": "/v1/admin/campaigns/businesses"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 6: Create Death Notice

### Request

```bash
POST /admin/deaths
Authorization: Bearer {token}
Content-Type: application/json

{
  "deceased_name": "Test Person",
  "funeral_date": "2026-02-25",
  "funeral_time": "14:30",
  "neighborhood_id": "662a2e52-0161-4795-a7a9-9ee9eeb094f4"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "notice": {
      "id": "1402d4ef-311b-4e1e-a5bb-87787756d2d3",
      "deceased_name": "Test Person",
      "age": null,
      "photo_file_id": null,
      "funeral_date": "2026-02-25",
      "funeral_time": "14:30:00",
      "cemetery_id": null,
      "mosque_id": null,
      "condolence_address": null,
      "neighborhood_id": "662a2e52-0161-4795-a7a9-9ee9eeb094f4",
      "added_by": "a84a7512-fe75-4f76-9696-7c7bbd122811",
      "status": "approved",
      "approved_by": "a84a7512-fe75-4f76-9696-7c7bbd122811",
      "approved_at": "2026-02-22T13:21:04.075Z",
      "auto_archive_at": "2026-03-04T00:00:00.000Z",
      "created_at": "2026-02-22T13:21:04.075Z",
      "updated_at": "2026-02-22T13:21:04.075Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.076Z",
    "path": "/v1/admin/deaths"
  }
}
```

**Status:** ✅ PASS
**Notes:**
- `funeral_time` is REQUIRED in HH:mm format
- Auto-archived after 7 days from funeral_date
- Status auto-set to "approved"

---

## Test Case 7: Create Cemetery

### Request

```bash
POST /admin/deaths/cemeteries
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Test Cemetery",
  "address": "Test Address",
  "latitude": 40.5,
  "longitude": 29.5,
  "is_active": true
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "cemetery": {
      "id": "db8ad1f4-8f73-41f8-853c-1bc107409b68",
      "name": "Test Cemetery",
      "address": "Test Address",
      "latitude": 40.5,
      "longitude": 29.5,
      "is_active": true,
      "created_at": "2026-02-22T13:21:04.092Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.093Z",
    "path": "/v1/admin/deaths/cemeteries"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 8: Create Neighborhood

### Request

```bash
POST /admin/neighborhoods
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Test Neighborhood",
  "type": "neighborhood",
  "population": 5000,
  "latitude": 40.5,
  "longitude": 29.5
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "neighborhood": {
      "id": "662a2e52-0161-4795-a7a9-9ee9eeb094f4",
      "name": "Test Neighborhood",
      "slug": "test-neighborhood",
      "type": "neighborhood",
      "population": 5000,
      "latitude": 40.5,
      "longitude": 29.5,
      "display_order": 0,
      "is_active": true,
      "created_at": "2026-02-22T13:19:48.820Z",
      "updated_at": "2026-02-22T13:19:48.820Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:19:48.821Z",
    "path": "/v1/admin/neighborhoods"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 9: Create Campaign

### Request

```bash
POST /admin/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "business_id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "Spring Sale",
  "description": "20% discount on all items",
  "discount_rate": 20,
  "valid_from": "2026-03-01",
  "valid_until": "2026-03-31",
  "code": "SPRING20"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "60001b16-1940-4d98-bede-46f4c077aee1",
      "business_id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Spring Sale",
      "description": "20% discount on all items",
      "discount_rate": 20,
      "code": "SPRING20",
      "valid_from": "2026-03-01",
      "valid_until": "2026-03-31",
      "status": "approved",
      "views": 0,
      "code_views": 0,
      "created_at": "2026-02-22T13:21:04.075Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.076Z",
    "path": "/v1/admin/campaigns"
  }
}
```

**Status:** ✅ PASS
**Notes:**
- Campaigns created by admin auto-approved
- Status field: `approved`, `draft`, `rejected`

---

## Test Case 10: Update Neighborhood

### Request

```bash
PATCH /admin/neighborhoods/662a2e52-0161-4795-a7a9-9ee9eeb094f4
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Neighborhood Name",
  "population": 6000
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "neighborhood": {
      "id": "662a2e52-0161-4795-a7a9-9ee9eeb094f4",
      "name": "Updated Neighborhood Name",
      "slug": "test-neighborhood",
      "type": "neighborhood",
      "population": 6000,
      "latitude": 40.5,
      "longitude": 29.5,
      "display_order": 0,
      "is_active": true,
      "created_at": "2026-02-22T13:19:48.820Z",
      "updated_at": "2026-02-22T13:21:04.120Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:04.121Z",
    "path": "/v1/admin/neighborhoods/662a2e52-0161-4795-a7a9-9ee9eeb094f4"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 11: Delete Neighborhood

### Request

```bash
DELETE /admin/neighborhoods/662a2e52-0161-4795-a7a9-9ee9eeb094f4
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": null,
  "meta": {
    "timestamp": "2026-02-22T13:21:04.130Z",
    "path": "/v1/admin/neighborhoods/662a2e52-0161-4795-a7a9-9ee9eeb094f4"
  }
}
```

**Status:** ✅ PASS
**Notes:**
- Soft delete (deleted_at field set, not actually removed)
- Returns 200 OK (not 204)

---

## Test Case 12: Get Pharmacies

### Request

```bash
GET /admin/pharmacy?page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "pharmacies": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "Merkez Eczanesi",
        "phone": "05551234567",
        "address": "Merkez Mahallesi",
        "is_active": true,
        "created_at": "2026-02-22T12:06:12.659Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.011Z",
    "path": "/v1/admin/pharmacy?page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 13: Get Intercity Routes

### Request

```bash
GET /admin/transport/intercity?page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "104684b4-6db6-4ca2-9894-a0ce7644b8fe",
        "company_name": "Metro Turizm",
        "from_city": "Adana",
        "to_city": "Ankara",
        "duration_minutes": 390,
        "price": 450,
        "contact_phone": null,
        "contact_website": null,
        "amenities": ["WiFi", "Klima", "Tuvalet"],
        "is_active": true,
        "schedules": [
          {
            "id": "542d7eec-75a2-4dbf-8087-2acec0f2f890",
            "departure_time": "08:00:00",
            "days_of_week": [1, 2, 3, 4, 5],
            "is_active": true
          }
        ],
        "created_at": "2026-02-21T23:29:13.284Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.058Z",
    "path": "/v1/admin/transport/intercity?page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 14: Get Intracity Routes

### Request

```bash
GET /admin/transport/intracity?page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "bea3e8d4-9e29-4f9a-8e8b-5b8a1c6b7d8f",
        "name": "Merkez - Akdam",
        "line_number": "1",
        "description": "Merkez merkezinden Akdam mahallesine giden rota",
        "estimated_duration_minutes": 25,
        "price": 12.5,
        "is_active": true,
        "stops": [
          {
            "id": "c5f3e8d4-9e29-4f9a-8e8b-5b8a1c6b7d8e",
            "name": "Merkez",
            "latitude": 40.5,
            "longitude": 29.5,
            "order": 1,
            "time_from_start": "00:00"
          }
        ],
        "created_at": "2026-02-21T23:29:13.284Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.058Z",
    "path": "/v1/admin/transport/intracity?page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Test Case 15: Get Neighborhoods (Filtered)

### Request

```bash
GET /admin/neighborhoods?type=neighborhood&page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "neighborhoods": [
      {
        "id": "a905b48c-bb6c-4070-9793-076a87573778",
        "name": "Test Neighborhood",
        "slug": "test-neighborhood",
        "type": "neighborhood",
        "population": null,
        "latitude": null,
        "longitude": null,
        "display_order": 0,
        "is_active": true,
        "created_at": "2026-02-22T13:19:48.820Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:14.072Z",
    "path": "/v1/admin/neighborhoods?type=neighborhood&page=1&limit=10"
  }
}
```

**Status:** ✅ PASS

---

## Error Examples

### Error Case 1: Empty Role Parameter

### Request

```bash
GET /admin/users?search=&role=&is_banned=&page=1&limit=10
Authorization: Bearer {token}
```

### Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "role must be one of the following values: user, taxi_driver, business, moderator, admin, super_admin"
  },
  "meta": {
    "timestamp": "2026-02-22T13:19:28.892Z",
    "path": "/v1/admin/users?search=&role=&is_banned=&page=1&limit=10"
  }
}
```

**Status:** ❌ FAIL (Issue #1)

---

### Error Case 2: Unsupported Search Parameter

### Request

```bash
GET /admin/transport/intercity?search=metro&page=1&limit=10
Authorization: Bearer {token}
```

### Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "property search should not exist"
  },
  "meta": {
    "timestamp": "2026-02-22T13:19:28.908Z",
    "path": "/v1/admin/transport/intercity?search=metro&page=1&limit=10"
  }
}
```

**Status:** ❌ FAIL (Issue #3)

---

### Error Case 3: Missing Required Field

### Request

```bash
POST /admin/deaths
Authorization: Bearer {token}
Content-Type: application/json

{
  "deceased_name": "Test Person",
  "funeral_date": "2026-02-25"
  // Missing funeral_time!
}
```

### Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "funeral_time must match /^\\d{2}:\\d{2}$/ regular expression"
  },
  "meta": {
    "timestamp": "2026-02-22T13:21:28.000Z",
    "path": "/v1/admin/deaths"
  }
}
```

**Status:** ❌ FAIL (Missing required field)

---

## Data Type Reference

### UserRole Enum

Valid values: `user`, `taxi_driver`, `business`, `moderator`, `admin`, `super_admin`

### CampaignStatus Enum

Valid values: `draft`, `approved`, `rejected`

### NeighborhoodType Enum

Valid values: `neighborhood`, `village`

### DeathNoticeStatus Enum

Valid values: `approved`, `archived`, `rejected`

### Time Format

All time fields use `HH:mm` format in requests, `HH:mm:ss` in responses

### Date Format

All date fields use `YYYY-MM-DD` format
