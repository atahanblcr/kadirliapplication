# KadirliApp - API Endpoints Documentation

**Version:** 1.0  
**Base URL:** `https://api.kadirliapp.com/v1`  
**Date:** 16 Şubat 2026

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Core](#core)
3. [Announcements](#announcements)
4. [Ads](#ads)
5. [Taxi](#taxi)
6. [Deaths](#deaths)
7. [Pharmacy](#pharmacy)
8. [Events](#events)
9. [Campaigns](#campaigns)
10. [Guide](#guide)
11. [Places](#places)
12. [Transport](#transport)
13. [Notifications](#notifications)
14. [Admin](#admin)

---

## General Information

### Authentication

**Bearer Token (JWT):**
```
Authorization: Bearer <token>
```

**Token Payload:**
```json
{
  "user_id": "uuid",
  "role": "user|taxi_driver|business|moderator|admin|super_admin",
  "phone": "05331234567",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Response Format

**Success (200 OK):**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-16T10:30:00Z"
  }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Telefon numarası geçersiz",
    "details": {
      "field": "phone",
      "value": "invalid"
    }
  },
  "meta": {
    "timestamp": "2026-02-16T10:30:00Z"
  }
}
```

### Pagination

**Query Parameters:**
```
?page=1&limit=20&sort=-created_at
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

**Limits:**
- Public endpoints: 100 req/min
- Authenticated: 300 req/min
- Admin: 1000 req/min

---

## 1. AUTHENTICATION

### 1.1. Request OTP

**Endpoint:** `POST /auth/request-otp`  
**Auth:** ❌ No  
**Rate Limit:** 10 req/hour per phone

**Request:**
```json
{
  "phone": "05331234567"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "OTP gönderildi",
    "expires_in": 300,
    "retry_after": 60
  }
}
```

**Errors:**
- `400` - Invalid phone format
- `429` - Too many requests (10 OTP/hour limit)

---

### 1.2. Verify OTP

**Endpoint:** `POST /auth/verify-otp`  
**Auth:** ❌ No

**Request:**
```json
{
  "phone": "05331234567",
  "otp": "123456"
}
```

**Response (200) - New User:**
```json
{
  "success": true,
  "data": {
    "is_new_user": true,
    "temp_token": "eyJhbGc...",
    "message": "Kayıt tamamlayın"
  }
}
```

**Response (200) - Existing User:**
```json
{
  "success": true,
  "data": {
    "is_new_user": false,
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 2592000,
    "user": {
      "id": "uuid",
      "phone": "05331234567",
      "username": "ahmet123",
      "role": "user",
      "primary_neighborhood": {
        "id": "uuid",
        "name": "Merkez Mahallesi"
      }
    }
  }
}
```

**Errors:**
- `400` - Invalid OTP
- `401` - OTP expired
- `429` - Too many attempts (3 wrong → 5 min block)

---

### 1.3. Complete Registration

**Endpoint:** `POST /auth/register`  
**Auth:** ✅ Yes (temp_token)

**Request:**
```json
{
  "username": "ahmet123",
  "age": 25,
  "location_type": "neighborhood",
  "primary_neighborhood_id": "uuid",
  "accept_terms": true,
  "marketing_consent": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 2592000,
    "user": {
      "id": "uuid",
      "phone": "05331234567",
      "username": "ahmet123",
      "age": 25,
      "role": "user",
      "primary_neighborhood": {
        "id": "uuid",
        "name": "Merkez Mahallesi",
        "type": "neighborhood"
      }
    }
  }
}
```

**Validation:**
- `username`: 3-50 chars, alphanumeric + underscore, unique
- `age`: 13-120
- `location_type`: "neighborhood" or "village"
- `primary_neighborhood_id`: Must exist
- `accept_terms`: Must be true

**Errors:**
- `400` - Validation error
- `409` - Username already taken

---

### 1.4. Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Auth:** ❌ No

**Request:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "expires_in": 2592000
  }
}
```

---

### 1.5. Logout

**Endpoint:** `POST /auth/logout`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "fcm_token": "optional-fcm-token-to-remove"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Çıkış başarılı"
  }
}
```

---

## 2. CORE

### 2.1. Get Neighborhoods

**Endpoint:** `GET /neighborhoods`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Query Params:**
```
?type=neighborhood|village
?search=mer
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "neighborhoods": [
      {
        "id": "uuid",
        "name": "Merkez Mahallesi",
        "slug": "merkez",
        "type": "neighborhood",
        "population": 15000
      }
    ]
  }
}
```

---

### 2.2. Get Current User

**Endpoint:** `GET /users/me`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phone": "05331234567",
      "username": "ahmet123",
      "age": 25,
      "role": "user",
      "primary_neighborhood": {
        "id": "uuid",
        "name": "Merkez Mahallesi",
        "type": "neighborhood"
      },
      "notification_preferences": {
        "announcements": true,
        "deaths": true,
        "pharmacy": true,
        "events": true,
        "ads": false,
        "campaigns": false
      },
      "profile_photo_url": null,
      "is_active": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  }
}
```

---

### 2.3. Update Profile

**Endpoint:** `PATCH /users/me`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "username": "new_username",
  "age": 26,
  "primary_neighborhood_id": "new-uuid",
  "profile_photo": "base64_image_or_file_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

**Validation:**
- `username`: Can change once per month
- `primary_neighborhood_id`: Can change once per month
- Check `username_last_changed_at` and `neighborhood_last_changed_at`

**Errors:**
- `400` - Validation error
- `409` - Username taken
- `429` - "Kullanıcı adını bu ay değiştirdiniz"

---

### 2.4. Update Notification Preferences

**Endpoint:** `PATCH /users/me/notifications`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "announcements": true,
  "deaths": false,
  "pharmacy": true,
  "events": true,
  "ads": false,
  "campaigns": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification_preferences": { ... }
  }
}
```

---

### 2.5. Upload File

**Endpoint:** `POST /files/upload`  
**Auth:** ✅ Yes  
**Content-Type:** `multipart/form-data`

**Request:**
```
file: (binary)
module_type: "ad" | "announcement" | "death" | "event" | "campaign" | "place"
module_id: "uuid" (optional)
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "uuid",
      "original_name": "photo.jpg",
      "file_name": "1234567890_abc123.jpg",
      "mime_type": "image/jpeg",
      "size_bytes": 245678,
      "cdn_url": "https://cdn.kadirliapp.com/...",
      "thumbnail_url": "https://cdn.kadirliapp.com/.../thumb.jpg",
      "metadata": {
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

**Validation:**
- Max size: 10 MB
- Allowed types: image/jpeg, image/png, image/webp, application/pdf
- Auto compress: 80% quality
- Auto resize: max 1920x1080
- Generate thumbnail: 400x400

---

## 3. ANNOUNCEMENTS

### 3.1. List Announcements

**Endpoint:** `GET /announcements`  
**Auth:** ✅ Yes  
**Cache:** 5 minutes

**Query Params:**
```
?page=1
?limit=20
?type_id=uuid
?priority=emergency|high|normal|low
?neighborhood=merkez
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "uuid",
        "type": {
          "id": "uuid",
          "name": "Elektrik Kesintisi",
          "slug": "power-outage",
          "icon": "flash_on",
          "color": "#FFC107"
        },
        "title": "Merkez Mahallesi Elektrik Kesintisi",
        "body": "15 Şubat Pazartesi günü saat 10:00-16:00 arası...",
        "priority": "high",
        "has_pdf": true,
        "pdf_url": "https://cdn.kadirliapp.com/...",
        "has_link": true,
        "external_link": "https://toroslaedas.com.tr/...",
        "view_count": 1234,
        "created_at": "2026-02-10T08:00:00Z",
        "is_viewed": false
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

**Filtering Logic:**
```
1. status = 'published'
2. deleted_at IS NULL
3. visible_until IS NULL OR visible_until > NOW()
4. Hedefleme kontrolü:
   - target_type = 'all' → Herkese
   - target_type = 'neighborhoods' → Kullanıcının mahallesine
   - target_type = 'users' → Spesifik kullanıcı ID'si
```

---

### 3.2. Get Announcement Details

**Endpoint:** `GET /announcements/:id`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcement": {
      "id": "uuid",
      "type": { ... },
      "title": "...",
      "body": "...",
      "priority": "high",
      "target_neighborhoods": ["merkez", "akdam"],
      "pdf_file": {
        "id": "uuid",
        "name": "kesinti_listesi.pdf",
        "url": "https://cdn.kadirliapp.com/...",
        "size_bytes": 123456
      },
      "external_link": "https://...",
      "view_count": 1234,
      "created_at": "2026-02-10T08:00:00Z",
      "created_by": {
        "id": "uuid",
        "username": "admin",
        "role": "admin"
      }
    }
  }
}
```

**Side Effect:**
- Create `announcement_views` record
- Increment `view_count`

---

### 3.3. Get Announcement Types

**Endpoint:** `GET /announcements/types`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "types": [
      {
        "id": "uuid",
        "name": "Elektrik Kesintisi",
        "slug": "power-outage",
        "icon": "flash_on",
        "color": "#FFC107",
        "description": "Planlı elektrik kesintileri"
      }
    ]
  }
}
```

---

### 3.4. Create Announcement (Admin)

**Endpoint:** `POST /announcements`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `announcements.create`

**Request:**
```json
{
  "type_id": "uuid",
  "title": "Merkez Mahallesi Elektrik Kesintisi",
  "body": "15 Şubat Pazartesi günü saat 10:00-16:00 arası elektrik kesintisi uygulanacaktır.",
  "priority": "high",
  "target_type": "neighborhoods",
  "target_neighborhoods": ["merkez", "akdam"],
  "scheduled_for": "2026-02-15T08:00:00Z",
  "send_push_notification": true,
  "visible_until": "2026-02-16T18:00:00Z",
  "pdf_file_id": "uuid",
  "external_link": "https://toroslaedas.com.tr/...",
  "is_recurring": false,
  "recurrence_pattern": null
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "announcement": { ... },
    "estimated_recipients": 1234
  }
}
```

**Validation:**
- `type_id`: Must exist
- `title`: Max 200 chars
- `body`: Required
- `priority`: enum
- `target_type`: enum
- `target_neighborhoods`: Must exist if target_type = 'neighborhoods'
- `scheduled_for`: Optional, future date
- `recurrence_pattern`: Cron format if is_recurring = true

---

### 3.5. Update Announcement (Admin)

**Endpoint:** `PATCH /announcements/:id`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `announcements.update`

**Request:** (Same as create, partial update)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcement": { ... }
  }
}
```

---

### 3.6. Delete Announcement (Admin)

**Endpoint:** `DELETE /announcements/:id`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `announcements.delete`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Duyuru silindi"
  }
}
```

**Note:** Soft delete (set deleted_at)

---

### 3.7. Send Announcement Now (Admin)

**Endpoint:** `POST /announcements/:id/send`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `announcements.send`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Duyuru gönderiliyor",
    "job_id": "uuid",
    "estimated_recipients": 1234
  }
}
```

**Note:** 
- Updates `sent_at = NOW()`
- Sends push notifications in batches (500/batch)
- Returns job_id for status tracking

---

## 4. ADS

### 4.1. List Ads

**Endpoint:** `GET /ads`  
**Auth:** ❌ No (public)  
**Cache:** 1 minute

**Query Params:**
```
?page=1
?limit=20
?category_id=uuid
?min_price=1000
?max_price=50000
?sort=-created_at|price|-price|view_count
?search=iphone 13
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ads": [
      {
        "id": "uuid",
        "title": "iPhone 13 Pro Max 256GB",
        "description": "Tertemiz, hiç çizmesi yok...",
        "price": 35000,
        "category": {
          "id": "uuid",
          "name": "Telefon",
          "parent": {
            "id": "uuid",
            "name": "Elektronik"
          }
        },
        "cover_image": {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "https://cdn.kadirliapp.com/.../thumb.jpg"
        },
        "images_count": 5,
        "view_count": 234,
        "created_at": "2026-02-10T14:30:00Z",
        "expires_at": "2026-02-17T14:30:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Filtering:**
- `status = 'approved'`
- `expires_at > NOW()`
- `deleted_at IS NULL`

---

### 4.2. Get Ad Details

**Endpoint:** `GET /ads/:id`  
**Auth:** ❌ No (public)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ad": {
      "id": "uuid",
      "title": "iPhone 13 Pro Max 256GB",
      "description": "Tertemiz, hiç çizmesi yok. Kutusu ve aksesuarları mevcut.",
      "price": 35000,
      "category": {
        "id": "uuid",
        "name": "Telefon",
        "slug": "telefon",
        "parent": {
          "id": "uuid",
          "name": "Elektronik",
          "slug": "elektronik"
        }
      },
      "properties": [
        {
          "name": "Marka",
          "value": "Apple"
        },
        {
          "name": "Model",
          "value": "iPhone 13 Pro Max"
        },
        {
          "name": "Hafıza",
          "value": "256 GB"
        },
        {
          "name": "Renk",
          "value": "Siyah"
        }
      ],
      "images": [
        {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "https://cdn.kadirliapp.com/.../thumb.jpg",
          "is_cover": true,
          "order": 0
        }
      ],
      "seller": {
        "id": "uuid",
        "username": "ahmet123",
        "phone": "05331234567"
      },
      "view_count": 234,
      "phone_click_count": 45,
      "whatsapp_click_count": 23,
      "expires_at": "2026-02-17T14:30:00Z",
      "extension_count": 1,
      "max_extensions": 3,
      "created_at": "2026-02-10T14:30:00Z"
    }
  }
}
```

**Side Effect:**
- Increment `view_count`

---

### 4.3. Track Phone Click

**Endpoint:** `POST /ads/:id/track-phone`  
**Auth:** ❌ No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "phone": "05331234567"
  }
}
```

**Side Effect:**
- Increment `phone_click_count`

---

### 4.4. Track WhatsApp Click

**Endpoint:** `POST /ads/:id/track-whatsapp`  
**Auth:** ❌ No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "whatsapp_url": "https://wa.me/905331234567?text=..."
  }
}
```

**Side Effect:**
- Increment `whatsapp_click_count`

---

### 4.5. Get Categories

**Endpoint:** `GET /ads/categories`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Query Params:**
```
?parent_id=uuid  (Alt kategorileri getir)
?level=1         (Sadece ana kategoriler)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Elektronik",
        "slug": "elektronik",
        "icon": "devices",
        "parent_id": null,
        "subcategories_count": 5,
        "ads_count": 234
      }
    ]
  }
}
```

---

### 4.6. Get Category Properties

**Endpoint:** `GET /ads/categories/:id/properties`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "uuid",
      "name": "Telefon",
      "slug": "telefon"
    },
    "properties": [
      {
        "id": "uuid",
        "name": "Marka",
        "type": "dropdown",
        "is_required": true,
        "options": [
          {
            "id": "uuid",
            "value": "Apple",
            "order": 0
          },
          {
            "id": "uuid",
            "value": "Samsung",
            "order": 1
          }
        ]
      },
      {
        "id": "uuid",
        "name": "Hafıza",
        "type": "dropdown",
        "is_required": true,
        "options": [
          {
            "id": "uuid",
            "value": "64 GB",
            "order": 0
          },
          {
            "id": "uuid",
            "value": "128 GB",
            "order": 1
          }
        ]
      },
      {
        "id": "uuid",
        "name": "Renk",
        "type": "dropdown",
        "is_required": false,
        "options": [ ... ]
      }
    ]
  }
}
```

---

### 4.7. Create Ad

**Endpoint:** `POST /ads`  
**Auth:** ✅ Yes  
**Rate Limit:** 10/day per user

**Request:**
```json
{
  "category_id": "uuid",
  "title": "iPhone 13 Pro Max 256GB",
  "description": "Tertemiz, hiç çizmesi yok...",
  "price": 35000,
  "contact_phone": "05331234567",
  "properties": [
    {
      "property_id": "uuid",
      "value": "Apple"
    },
    {
      "property_id": "uuid",
      "value": "iPhone 13 Pro Max"
    }
  ],
  "image_ids": ["uuid1", "uuid2", "uuid3"],
  "cover_image_id": "uuid1"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "ad": {
      "id": "uuid",
      "status": "pending",
      "title": "...",
      "expires_at": "2026-02-17T14:30:00Z",
      "message": "İlanınız incelemeye alındı. 6 saat içinde onaylanacak."
    }
  }
}
```

**Validation:**
- `category_id`: Must be leaf category (no children)
- `title`: Max 200 chars
- `description`: Required
- `price`: Required, > 0
- `contact_phone`: Valid Turkish phone
- `properties`: All required properties must be filled
- `image_ids`: 1-5 images (admin configurable)
- `cover_image_id`: Must be in image_ids

**Errors:**
- `400` - Validation error
- `429` - Daily limit reached (10 ads/day)

---

### 4.8. Update My Ad

**Endpoint:** `PATCH /ads/:id`  
**Auth:** ✅ Yes (owner only)

**Request:** (Same as create, partial)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ad": { ... }
  }
}
```

**Note:**
- Only owner can update
- If status = 'approved', update → status = 'pending' (re-moderation)

---

### 4.9. Delete My Ad

**Endpoint:** `DELETE /ads/:id`  
**Auth:** ✅ Yes (owner only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "İlan silindi"
  }
}
```

**Note:** Soft delete (set deleted_at)

---

### 4.10. Extend Ad (Watch Ads)

**Endpoint:** `POST /ads/:id/extend`  
**Auth:** ✅ Yes (owner only)

**Request:**
```json
{
  "ads_watched": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ad": {
      "id": "uuid",
      "expires_at": "2026-02-20T14:30:00Z",
      "extension_count": 2,
      "max_extensions": 3,
      "remaining_extensions": 1
    },
    "message": "İlanınız 3 gün uzatıldı"
  }
}
```

**Business Logic:**
```
1 reklam izleme = 1 gün uzatma
3 reklam izleme = 3 gün uzatma

expires_at = expires_at + (ads_watched * 1 day)
extension_count = extension_count + 1

Max: 3 uzatma
```

**Errors:**
- `400` - Max extensions reached
- `403` - Not ad owner

---

### 4.11. Get My Ads

**Endpoint:** `GET /users/me/ads`  
**Auth:** ✅ Yes

**Query Params:**
```
?status=pending|approved|rejected|expired
?page=1
?limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ads": [
      {
        "id": "uuid",
        "title": "...",
        "status": "approved",
        "view_count": 234,
        "phone_click_count": 45,
        "expires_at": "2026-02-17T14:30:00Z",
        "created_at": "2026-02-10T14:30:00Z"
      }
    ]
  },
  "meta": { ... }
}
```

---

### 4.12. Add to Favorites

**Endpoint:** `POST /ads/:id/favorite`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Favorilere eklendi"
  }
}
```

**Errors:**
- `400` - Already favorited
- `429` - Max 30 favorites

---

### 4.13. Remove from Favorites

**Endpoint:** `DELETE /ads/:id/favorite`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Favorilerden çıkarıldı"
  }
}
```

---

### 4.14. Get My Favorites

**Endpoint:** `GET /users/me/favorites`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "uuid",
        "ad": {
          "id": "uuid",
          "title": "...",
          "price": 35000,
          "cover_image": { ... },
          "status": "approved"
        },
        "added_at": "2026-02-12T10:00:00Z"
      }
    ]
  }
}
```

---

## 5. TAXI

### 5.1. List Taxi Drivers

**Endpoint:** `GET /taxi/drivers`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "id": "uuid",
        "name": "Mehmet Taksi",
        "phone": "05331234567",
        "plaka": "01 ABC 123",
        "vehicle_info": "Beyaz Renault Megane",
        "total_calls": 234
      }
    ]
  }
}
```

**Note:** 
- **RANDOM sıralama!** (ORDER BY RANDOM())
- Sadece verified ve active olanlar

---

### 5.2. Call Taxi

**Endpoint:** `POST /taxi/drivers/:id/call`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "driver": {
      "id": "uuid",
      "name": "Mehmet Taksi",
      "phone": "05331234567"
    }
  }
}
```

**Side Effect:**
- Create `taxi_calls` record
- Increment `total_calls` counter

---

## 6. DEATHS

### 6.1. List Death Notices

**Endpoint:** `GET /deaths`  
**Auth:** ✅ Yes

**Query Params:**
```
?page=1
?limit=20
?funeral_date=2026-02-15
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notices": [
      {
        "id": "uuid",
        "deceased_name": "Ahmet YILMAZ",
        "age": 75,
        "photo_url": "https://cdn.kadirliapp.com/...",
        "funeral_date": "2026-02-15",
        "funeral_time": "14:00",
        "cemetery": {
          "id": "uuid",
          "name": "Kadirli Merkez Mezarlığı",
          "address": "...",
          "latitude": 37.3667,
          "longitude": 36.1000
        },
        "mosque": {
          "id": "uuid",
          "name": "Merkez Camii",
          "address": "..."
        },
        "condolence_address": "Merkez Mah. Atatürk Cad. No:12",
        "created_at": "2026-02-14T08:00:00Z"
      }
    ]
  },
  "meta": { ... }
}
```

**Filtering:**
- `status = 'approved'`
- `deleted_at IS NULL` (Not archived yet)
- Order by `funeral_date DESC, funeral_time DESC`

---

### 6.2. Get Death Notice Details

**Endpoint:** `GET /deaths/:id`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notice": {
      "id": "uuid",
      "deceased_name": "Ahmet YILMAZ",
      "age": 75,
      "photo": {
        "id": "uuid",
        "url": "https://cdn.kadirliapp.com/...",
        "thumbnail_url": "..."
      },
      "funeral_date": "2026-02-15",
      "funeral_time": "14:00",
      "cemetery": { ... },
      "mosque": { ... },
      "condolence_address": "...",
      "auto_archive_at": "2026-02-22T14:00:00Z",
      "created_at": "2026-02-14T08:00:00Z"
    }
  }
}
```

---

### 6.3. Create Death Notice

**Endpoint:** `POST /deaths`  
**Auth:** ✅ Yes  
**Rate Limit:** 2/day per user

**Request:**
```json
{
  "deceased_name": "Ahmet YILMAZ",
  "age": 75,
  "photo_file_id": "uuid",
  "funeral_date": "2026-02-15",
  "funeral_time": "14:00",
  "cemetery_id": "uuid",
  "mosque_id": "uuid",
  "condolence_address": "Merkez Mah. Atatürk Cad. No:12"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "notice": {
      "id": "uuid",
      "status": "pending",
      "auto_archive_at": "2026-02-22T14:00:00Z",
      "message": "Vefat ilanınız incelemeye alındı. 2-6 saat içinde onaylanacak."
    }
  }
}
```

**Validation:**
- `deceased_name`: Required, max 150 chars
- `funeral_date`: Must be today or future
- `funeral_time`: Required
- `photo_file_id`: Optional
- `cemetery_id` or `mosque_id`: At least one required

**Business Logic:**
- `auto_archive_at = funeral_date + INTERVAL '7 days'` (Trigger)

**Errors:**
- `400` - Validation error
- `429` - Daily limit (2 death notices/day)

---

### 6.4. Get Cemeteries

**Endpoint:** `GET /deaths/cemeteries`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cemeteries": [
      {
        "id": "uuid",
        "name": "Kadirli Merkez Mezarlığı",
        "address": "...",
        "latitude": 37.3667,
        "longitude": 36.1000
      }
    ]
  }
}
```

---

### 6.5. Get Mosques

**Endpoint:** `GET /deaths/mosques`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "mosques": [
      {
        "id": "uuid",
        "name": "Merkez Camii",
        "address": "...",
        "latitude": 37.3667,
        "longitude": 36.1000
      }
    ]
  }
}
```

---

## 7. PHARMACY

### 7.1. Get Current Duty Pharmacy

**Endpoint:** `GET /pharmacy/current`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pharmacy": {
      "id": "uuid",
      "name": "Merkez Eczanesi",
      "address": "Atatürk Cad. No:45",
      "phone": "03283211234",
      "latitude": 37.3667,
      "longitude": 36.1000,
      "duty_date": "2026-02-16",
      "duty_hours": "19:00 - 09:00",
      "pharmacist_name": "Ecz. Ali YILMAZ"
    }
  }
}
```

**Business Logic:**
- `duty_date = CURRENT_DATE`
- If multiple, return first one

---

### 7.2. Get Duty Schedule

**Endpoint:** `GET /pharmacy/schedule`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Query Params:**
```
?start_date=2026-02-01
?end_date=2026-02-28
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "schedule": [
      {
        "date": "2026-02-16",
        "pharmacy": {
          "id": "uuid",
          "name": "Merkez Eczanesi",
          "phone": "03283211234",
          "address": "..."
        }
      },
      {
        "date": "2026-02-17",
        "pharmacy": {
          "id": "uuid",
          "name": "Yeni Eczane",
          "phone": "03283211235",
          "address": "..."
        }
      }
    ]
  }
}
```

---

### 7.3. Get All Pharmacies

**Endpoint:** `GET /pharmacy/list`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pharmacies": [
      {
        "id": "uuid",
        "name": "Merkez Eczanesi",
        "address": "...",
        "phone": "03283211234",
        "latitude": 37.3667,
        "longitude": 36.1000,
        "working_hours": "08:30-19:00",
        "pharmacist_name": "Ecz. Ali YILMAZ"
      }
    ]
  }
}
```

---

## 8. EVENTS

### 8.1. List Events

**Endpoint:** `GET /events`  
**Auth:** ❌ No  
**Cache:** 5 minutes

**Query Params:**
```
?page=1
?limit=20
?category_id=uuid
?city=Kadirli|Adana|Osmaniye
?start_date=2026-02-01
?end_date=2026-02-28
?is_free=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Kadirli Yazlık Sinema Gecesi",
        "description": "Açık havada sinema keyfi...",
        "category": {
          "id": "uuid",
          "name": "Sinema",
          "slug": "sinema"
        },
        "event_date": "2026-02-20",
        "event_time": "20:00",
        "venue_name": "Öğretmenevi Bahçesi",
        "city": "Kadirli",
        "is_free": true,
        "cover_image": {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "..."
        },
        "created_at": "2026-02-10T10:00:00Z"
      }
    ]
  },
  "meta": { ... }
}
```

**Filtering:**
- `status = 'published'`
- `deleted_at IS NULL`
- `event_date >= CURRENT_DATE` (Future events)

---

### 8.2. Get Event Details

**Endpoint:** `GET /events/:id`  
**Auth:** ❌ No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "title": "Kadirli Yazlık Sinema Gecesi",
      "description": "Açık havada sinema keyfi...",
      "category": { ... },
      "event_date": "2026-02-20",
      "event_time": "20:00",
      "duration_minutes": 120,
      "venue_name": "Öğretmenevi Bahçesi",
      "venue_address": "Merkez Mah. ...",
      "city": "Kadirli",
      "latitude": 37.3667,
      "longitude": 36.1000,
      "organizer": "Kadirli Belediyesi",
      "ticket_price": null,
      "is_free": true,
      "age_restriction": "all",
      "capacity": 200,
      "website_url": null,
      "images": [
        {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "order": 0
        }
      ],
      "created_at": "2026-02-10T10:00:00Z"
    }
  }
}
```

---

### 8.3. Get Event Categories

**Endpoint:** `GET /events/categories`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Müzik / Konser",
        "slug": "muzik-konser",
        "icon": "music_note",
        "events_count": 12
      }
    ]
  }
}
```

---

## 9. CAMPAIGNS

### 9.1. List Campaigns

**Endpoint:** `GET /campaigns`  
**Auth:** ❌ No  
**Cache:** 5 minutes

**Query Params:**
```
?page=1
?limit=20
?category_id=uuid
?active_only=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "uuid",
        "business": {
          "id": "uuid",
          "name": "Merkez Kafe",
          "category": "Yeme-İçme"
        },
        "title": "Kahvelerde %50 İndirim",
        "description": "Tüm kahvelerde geçerli...",
        "discount_percentage": 50,
        "start_date": "2026-02-15",
        "end_date": "2026-02-28",
        "cover_image": {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "..."
        },
        "created_at": "2026-02-10T10:00:00Z"
      }
    ]
  },
  "meta": { ... }
}
```

**Filtering:**
- `status = 'approved'`
- `start_date <= CURRENT_DATE`
- `end_date >= CURRENT_DATE`
- `deleted_at IS NULL`

---

### 9.2. Get Campaign Details

**Endpoint:** `GET /campaigns/:id`  
**Auth:** ❌ No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "uuid",
      "business": {
        "id": "uuid",
        "name": "Merkez Kafe",
        "category": "Yeme-İçme",
        "address": "...",
        "phone": "05331234567",
        "instagram_handle": "@merkezkafe"
      },
      "title": "Kahvelerde %50 İndirim",
      "description": "...",
      "discount_percentage": 50,
      "discount_code": "KAHVE50",
      "terms": "Sadece Pazartesi-Çarşamba geçerli",
      "minimum_amount": 50,
      "start_date": "2026-02-15",
      "end_date": "2026-02-28",
      "images": [ ... ],
      "created_at": "2026-02-10T10:00:00Z"
    }
  }
}
```

---

### 9.3. View Discount Code

**Endpoint:** `POST /campaigns/:id/view-code`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "discount_code": "KAHVE50",
    "terms": "Sadece Pazartesi-Çarşamba geçerli"
  }
}
```

**Side Effect:**
- Create `campaign_code_views` record
- Increment `code_view_count`

**Note:** 
- Sadece admin istatistikleri görebilir (admin panel)
- İşletme GÖREMEZ

---

### 9.4. Create Campaign (Business)

**Endpoint:** `POST /campaigns`  
**Auth:** ✅ Yes (business role)  
**Rate Limit:** 5/month per business

**Request:**
```json
{
  "title": "Kahvelerde %50 İndirim",
  "description": "Tüm kahvelerde geçerli...",
  "discount_percentage": 50,
  "discount_code": "KAHVE50",
  "terms": "Sadece Pazartesi-Çarşamba geçerli",
  "minimum_amount": 50,
  "stock_limit": 100,
  "start_date": "2026-02-15",
  "end_date": "2026-02-28",
  "image_ids": ["uuid1", "uuid2"],
  "cover_image_id": "uuid1"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "uuid",
      "status": "pending",
      "message": "Kampanyanız incelemeye alındı."
    }
  }
}
```

**Validation:**
- `title`: Max 200 chars
- `discount_percentage`: 1-99
- `discount_code`: Max 50 chars
- `start_date` <= `end_date`
- `image_ids`: 1-3 images

**Errors:**
- `429` - Monthly limit (5 campaigns/month)

---

## 10. GUIDE

### 10.1. List Guide Items

**Endpoint:** `GET /guide`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Query Params:**
```
?category_id=uuid
?search=elektrikçi
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Ali Elektrik",
        "category": {
          "id": "uuid",
          "name": "Elektrikçi",
          "parent": {
            "id": "uuid",
            "name": "Usta & Sanayi"
          }
        },
        "phone": "05331234567",
        "address": "Merkez Mah. ...",
        "working_hours": "08:00-18:00"
      }
    ]
  }
}
```

---

### 10.2. Get Guide Categories

**Endpoint:** `GET /guide/categories`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Muhtarlıklar",
        "slug": "muhtarliklar",
        "icon": "account_balance",
        "color": "#2196F3",
        "items_count": 15
      }
    ]
  }
}
```

---

## 11. PLACES

### 11.1. List Places

**Endpoint:** `GET /places`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Query Params:**
```
?category_id=uuid
?is_free=true
?sort=distance|name
?user_lat=37.3667
?user_lng=36.1000
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Karatepe-Aslantaş Açıkhava Müzesi",
        "description": "Geç Hitit dönemi...",
        "category": {
          "id": "uuid",
          "name": "Tarihi Yerler"
        },
        "is_free": false,
        "entrance_fee": 20,
        "distance_from_center": 22,
        "user_distance": 25.5,
        "cover_image": {
          "id": "uuid",
          "url": "https://cdn.kadirliapp.com/...",
          "thumbnail_url": "..."
        }
      }
    ]
  }
}
```

**Note:**
- `distance_from_center`: Static (db)
- `user_distance`: Calculated if user_lat/lng provided

---

### 11.2. Get Place Details

**Endpoint:** `GET /places/:id`  
**Auth:** ❌ No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "place": {
      "id": "uuid",
      "name": "Karatepe-Aslantaş Açıkhava Müzesi",
      "description": "...",
      "category": { ... },
      "address": "...",
      "latitude": 37.2345,
      "longitude": 36.5678,
      "entrance_fee": 20,
      "is_free": false,
      "opening_hours": "08:00-17:00",
      "best_season": "spring",
      "how_to_get_there": "Kadirli-Osmaniye yolundan...",
      "distance_from_center": 22,
      "images": [ ... ]
    }
  }
}
```

---

## 12. TRANSPORT

### 12.1. Get Intercity Routes

**Endpoint:** `GET /transport/intercity`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "uuid",
        "destination": "Adana",
        "price": 150,
        "duration_minutes": 90,
        "company": "Metro Turizm",
        "schedules": [
          { "departure_time": "06:00" },
          { "departure_time": "07:00" },
          { "departure_time": "08:00" }
        ]
      }
    ]
  }
}
```

---

### 12.2. Get Intracity Routes

**Endpoint:** `GET /transport/intracity`  
**Auth:** ❌ No  
**Cache:** 1 hour

**Response (200):**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "uuid",
        "route_number": "1",
        "route_name": "Otogar - Hastane - Fakülte",
        "first_departure": "06:00",
        "last_departure": "22:00",
        "frequency_minutes": 30,
        "stops": [
          {
            "stop_name": "Otogar",
            "stop_order": 1,
            "time_from_start": 0
          },
          {
            "stop_name": "Çarşı",
            "stop_order": 2,
            "time_from_start": 10
          }
        ]
      }
    ]
  }
}
```

---

## 13. NOTIFICATIONS

### 13.1. Get My Notifications

**Endpoint:** `GET /notifications`  
**Auth:** ✅ Yes

**Query Params:**
```
?page=1
?limit=20
?unread_only=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "title": "İlanınız onaylandı",
        "body": "iPhone 13 Pro Max ilanınız yayınlandı",
        "type": "ad_approved",
        "related_type": "ad",
        "related_id": "uuid",
        "is_read": false,
        "created_at": "2026-02-16T10:30:00Z"
      }
    ],
    "unread_count": 5
  },
  "meta": { ... }
}
```

---

### 13.2. Mark as Read

**Endpoint:** `PATCH /notifications/:id/read`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Okundu olarak işaretlendi"
  }
}
```

---

### 13.3. Mark All as Read

**Endpoint:** `POST /notifications/read-all`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Tüm bildirimler okundu"
  }
}
```

---

### 13.4. Register FCM Token

**Endpoint:** `POST /notifications/fcm-token`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "fcm_token": "firebase-cloud-messaging-token",
  "device_type": "android|ios"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Token kaydedildi"
  }
}
```

---

## 14. ADMIN

### 14.1. Dashboard Stats

**Endpoint:** `GET /admin/dashboard`  
**Auth:** ✅ Yes (admin+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_users": 15234,
      "active_users_today": 1234,
      "active_users_this_week": 5678,
      "pending_approvals": {
        "ads": 23,
        "deaths": 2,
        "campaigns": 5,
        "total": 30
      },
      "announcements_sent_today": 3,
      "new_ads_today": 45
    },
    "charts": {
      "user_growth": [
        { "date": "2026-02-01", "count": 100 },
        { "date": "2026-02-02", "count": 120 }
      ],
      "module_usage": {
        "announcements": 2345,
        "ads": 1234,
        "deaths": 567
      }
    }
  }
}
```

---

### 14.2. Pending Approvals

**Endpoint:** `GET /admin/approvals`  
**Auth:** ✅ Yes (admin+)

**Query Params:**
```
?type=ad|death|campaign
?page=1
?limit=50
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "approvals": [
      {
        "type": "ad",
        "id": "uuid",
        "content": {
          "title": "iPhone 13 Pro Max",
          "user": {
            "id": "uuid",
            "username": "ahmet123",
            "phone": "05331234567"
          }
        },
        "created_at": "2026-02-16T08:00:00Z",
        "hours_pending": 2
      }
    ]
  },
  "meta": { ... }
}
```

---

### 14.3. Approve Ad

**Endpoint:** `POST /admin/ads/:id/approve`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `ads.approve`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "İlan onaylandı",
    "ad": { ... }
  }
}
```

**Side Effect:**
- Update `status = 'approved'`
- Set `approved_by` and `approved_at`
- Send notification to user
- Send push notification

---

### 14.4. Reject Ad

**Endpoint:** `POST /admin/ads/:id/reject`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `ads.reject`

**Request:**
```json
{
  "rejected_reason": "Müstehcen içerik|Hatalı bilgiler|Kural dışı|Spam"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "İlan reddedildi"
  }
}
```

**Side Effect:**
- Update `status = 'rejected'`
- Set `rejected_reason` and `rejected_at`
- Send notification to user

---

### 14.5. User Management

**Endpoint:** `GET /admin/users`  
**Auth:** ✅ Yes (admin+)

**Query Params:**
```
?search=ahmet
?role=user|business|taxi_driver
?is_banned=true
?neighborhood_id=uuid
?page=1
?limit=50
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "phone": "05331234567",
        "username": "ahmet123",
        "role": "user",
        "primary_neighborhood": { ... },
        "is_active": true,
        "is_banned": false,
        "created_at": "2026-01-15T10:30:00Z",
        "stats": {
          "total_ads": 5,
          "total_complaints": 0
        }
      }
    ]
  },
  "meta": { ... }
}
```

---

### 14.6. Ban User

**Endpoint:** `POST /admin/users/:id/ban`  
**Auth:** ✅ Yes (admin+)  
**Permission:** `users.ban`

**Request:**
```json
{
  "ban_reason": "Spam içerik paylaşımı",
  "duration_days": 7
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Kullanıcı banlandı",
    "banned_until": "2026-02-23T10:30:00Z"
  }
}
```

---

### 14.7. Scraper Logs

**Endpoint:** `GET /admin/scrapers/logs`  
**Auth:** ✅ Yes (admin+)

**Query Params:**
```
?scraper_name=power_outage|pharmacy
?status=success|failed
?page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "scraper_name": "power_outage",
        "status": "success",
        "records_found": 5,
        "records_created": 3,
        "records_updated": 2,
        "duration_seconds": 12.5,
        "started_at": "2026-02-16T06:00:00Z",
        "completed_at": "2026-02-16T06:00:12Z"
      }
    ]
  }
}
```

---

### 14.8. Run Scraper Manually

**Endpoint:** `POST /admin/scrapers/:name/run`  
**Auth:** ✅ Yes (super_admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Scraper başlatıldı",
    "job_id": "uuid"
  }
}
```

---

## 14.9 Admin - Taksi Sürücüsü Listesi

**Endpoint:** `GET /v1/admin/taxi`

**Auth:** ✅ Yes (admin, super_admin)

**Query Parameters:**
| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| search | string | Ad, telefon veya plakada ILIKE arama |
| is_active | boolean | true / false filtresi |
| is_verified | boolean | true / false filtresi |
| page | number | Sayfa no (default: 1) |
| limit | number | Sayfa boyutu (default: 20) |

> ⚠️ **Sıralama:** Her istek `ORDER BY RANDOM()` — refresh'te her zaman farklı sıra (intentional iş kuralı)

**Response (200):**
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
        "created_at": "2026-02-23T10:00:00.000Z",
        "updated_at": "2026-02-23T10:00:00.000Z"
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

## 14.10 Admin - Taksi Sürücüsü Detayı

**Endpoint:** `GET /v1/admin/taxi/:id`

**Auth:** ✅ Yes (admin, super_admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "driver": {
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
      "created_at": "2026-02-23T10:00:00.000Z",
      "updated_at": "2026-02-23T10:00:00.000Z"
    }
  }
}
```

---

## 14.11 Admin - Taksi Sürücüsü Oluştur

**Endpoint:** `POST /v1/admin/taxi`

**Auth:** ✅ Yes (admin, super_admin)

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

**Validasyon Kuralları:**
- `name`: Zorunlu, max 100 karakter
- `phone`: Zorunlu, max 15 karakter
- `plaka`: Opsiyonel, unique (aynı plaka 2 sürücüde olamaz)
- `is_verified`: Default `true` (admin eklediği için otomatik doğrulanmış sayılır)
- `user_id`: NULL (admin eklerken mobil hesap bağlantısı zorunlu değil)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "driver": { "id": "uuid", "name": "Ahmet Kaya", "..." }
  }
}
```

**Hata Durumu - Plaka Zaten Kayıtlı (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Bu plaka numarası zaten kayıtlı"
  }
}
```

---

## 14.12 Admin - Taksi Sürücüsü Güncelle

**Endpoint:** `PATCH /v1/admin/taxi/:id`

**Auth:** ✅ Yes (admin, super_admin)

**Request Body:** (tüm alanlar opsiyonel)
```json
{
  "vehicle_info": "Siyah VW Passat",
  "is_verified": false,
  "is_active": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "driver": { "id": "uuid", "..." }
  }
}
```

---

## 14.13 Admin - Taksi Sürücüsü Sil

**Endpoint:** `DELETE /v1/admin/taxi/:id`

**Auth:** ✅ Yes (admin, super_admin)

**Response:** `204 No Content` (body yok)

> Soft delete: `deleted_at = NOW()` — sürücü veritabanından silinmez, gizlenir

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., username taken) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Auth (OTP) | 10 requests | 1 hour |
| Auth (Verify) | 3 attempts | 5 minutes |
| Ads Create | 10 ads | 1 day |
| Deaths Create | 2 notices | 1 day |
| Campaigns Create | 5 campaigns | 1 month |
| Public GET | 100 requests | 1 minute |
| Authenticated | 300 requests | 1 minute |
| Admin | 1000 requests | 1 minute |

---

## Pagination

**Default:** `page=1`, `limit=20`  
**Max Limit:** `100`

---

## Sorting

**Format:** `?sort=-created_at,price`
- Prefix `-` for DESC
- Multiple fields comma-separated

---

## Filtering

**Common Filters:**
- `?search=keyword` - Full-text search
- `?status=active` - Status filter
- `?created_after=2026-02-01` - Date range
- `?created_before=2026-02-28` - Date range

---

## WebSocket (Future)

**Not implemented yet**, but planned for:
- Real-time notifications
- Live scraper status
- Admin dashboard real-time updates

---

## Versioning

**Current:** `v1`  
**URL:** `/v1/endpoint`

Major version changes will be announced 3 months in advance.

---

## Support

**Developer:** Claude Code  
**Contact:** [Your email]  
**Docs:** https://docs.kadirliapp.com

---

**END OF API DOCUMENTATION**
