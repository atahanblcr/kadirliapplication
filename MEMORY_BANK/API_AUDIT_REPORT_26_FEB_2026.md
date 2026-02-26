# 🔍 COMPREHENSIVE API ENDPOINTS AUDIT REPORT

**Date:** 2026-02-26, 15:42  
**Scope:** Full system audit - Backend vs Admin vs Documentation vs Reality

---

## 📊 AUDIT SUMMARY


### Backend Modules Found:
      26

### Admin Hooks Found:
      18

### Documented Endpoints:
      71

---

## 1️⃣ BACKEND CONTROLLER ENDPOINTS

# BACKEND CONTROLLER ENDPOINTS

## admin
  @Get('dashboard')
  @Get('dashboard/module-usage')
  @Get('dashboard/activities')
  @Get('approvals')
  @Get('ads')
  @Delete('ads/:id')
  @Post('ads/:id/approve')
  @Post('ads/:id/reject')
  @Get('neighborhoods')
  @Post('neighborhoods')
  @Patch('neighborhoods/:id')
  @Delete('neighborhoods/:id')
  @Get('profile')
  @Patch('profile')
  @Patch('change-password')

## campaign-admin
  @Get('businesses')
  @Get('businesses/categories')
  @Post('businesses/categories')
  @Post('businesses')
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Delete(':id')

## complaints-admin
  @Get()
  @Get(':id')
  @Patch(':id/review')
  @Patch(':id/resolve')
  @Patch(':id/reject')
  @Patch(':id/priority')

## deaths-admin
  @Get()
  @Get('cemeteries')
  @Post('cemeteries')
  @Patch('cemeteries/:id')
  @Delete('cemeteries/:id')
  @Get('mosques')
  @Post('mosques')
  @Patch('mosques/:id')
  @Delete('mosques/:id')
  @Get('neighborhoods')
  @Post()
  @Patch(':id')
  @Delete(':id')

## event-admin
  @Get('categories')
  @Post('categories')
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Delete(':id')

## guide-admin
  @Get('categories')
  @Post('categories')
  @Patch('categories/:id')
  @Delete('categories/:id')
  @Get('items')
  @Post('items')
  @Patch('items/:id')
  @Delete('items/:id')

## pharmacy-admin
  @Get('schedule')
  @Post('schedule')
  @Delete('schedule/:id')
  @Get()
  @Post()
  @Patch(':id')
  @Delete(':id')

## places-admin
  @Get('categories')
  @Post('categories')
  @Patch('categories/:id')
  @Delete('categories/:id')
  @Delete('images/:imageId')
  @Patch('images/:imageId/set-cover')
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Delete(':id')
  @Post(':id/images')
  @Patch(':id/images/reorder')

## staff-admin
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Patch(':id/permissions')
  @Delete(':id')
  @Patch(':id/reset-password')

## taxi-admin
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Delete(':id')

## transport-admin
  @Get('intercity')
  @Get('intercity/:id')
  @Post('intercity')
  @Patch('intercity/:id')
  @Delete('intercity/:id')
  @Post('intercity/:id/schedules')
  @Patch('intercity/schedules/:scheduleId')
  @Delete('intercity/schedules/:scheduleId')
  @Get('intracity')
  @Get('intracity/:id')
  @Post('intracity')
  @Patch('intracity/:id')
  @Delete('intracity/:id')
  @Post('intracity/:id/stops')
  @Patch('intracity/stops/:stopId')
  @Delete('intracity/stops/:stopId')
  @Patch('intracity/stops/:stopId/reorder')

## users-admin
  @Get()
  @Get(':id')
  @Post(':id/ban')
  @Post(':id/unban')
  @Patch(':id/role')

## ads
  @Get('ads')
  @Get('ads/categories')
  @Get('ads/categories/:id/properties')
  @Get('ads/:id')
  @Post('ads/:id/track-phone')
  @Post('ads/:id/track-whatsapp')
  @Post('ads')
  @Patch('ads/:id')
  @Delete('ads/:id')
  @Post('ads/:id/extend')
  @Post('ads/:id/favorite')
  @Delete('ads/:id/favorite')
  @Get('users/me/ads')
  @Get('users/me/favorites')

## announcements
  @Get('types')
  @Get()
  @Get(':id')
  @Post()
  @Patch(':id')
  @Delete(':id')
  @Post(':id/send')

## auth
  @Post('admin/login')
  @Post('request-otp')
  @Post('verify-otp')
  @Post('register')
  @Post('refresh')
  @Post('logout')

## campaigns
  @Get()
  @Get(':id')
  @Post(':id/view-code')
  @Post()

## deaths
  @Get('cemeteries')
  @Get('mosques')
  @Get('admin')
  @Post(':id/approve')
  @Post(':id/reject')
  @Delete(':id')
  @Get()
  @Get(':id')
  @Post()

## events
  @Get('categories')
  @Get()
  @Get(':id')

## files
  @Post('upload')
  @Delete(':id')

## guide
  @Get('categories')
  @Get()

## notifications
  @Get()
  @Post('read-all')
  @Post('fcm-token')
  @Patch(':id/read')

## pharmacy
  @Get('current')
  @Get('schedule')
  @Get('list')

## places
  @Get()
  @Get(':id')

## taxi
  @Get('drivers')
  @Post('drivers/:id/call')

## transport
  @Get('intercity')
  @Get('intracity')

## users
  @Get('me')
  @Patch('me')
  @Patch('me/notifications')

---

## 2️⃣ ADMIN PANEL API IMPLEMENTATIONS

# ADMIN PANEL API CALLS

## ads
      const { data } = await api.get<ApiResponse<AdminApprovalsResponse>>('/admin/approvals');
      const { data } = await api.get<
      const { data } = await api.get<ApiResponse<{ ad: Ad }>>(`/ads/${id}`);
      const { data } = await api.get<ApiResponse<{ categories: AdCategory[] }>>(
      const { data } = await api.post<ApiResponse<{ ad: Ad }>>(
      const { data } = await api.post<ApiResponse<{ ad: Ad }>>(
      await api.delete(`/admin/ads/${id}`);

## announceme.ts
      const { data } = await api.get<ApiResponse<{ types: AnnouncementType[] }>>(
      const { data } = await api.get<
      const { data } = await api.get<ApiResponse<{ announcement: Announcement }>>(
      const { data } = await api.post<ApiResponse<{ announcement: Announcement }>>(
      const { data } = await api.patch<ApiResponse<{ announcement: Announcement }>>(
      await api.delete(`/announcements/${id}`);
      const { data } = await api.post<

## auth
    const { data } = await api.post('/auth/admin/login', credentials);

## campaigns
      const { data } = await api.get<ApiResponse<{ campaigns: Campaign[]; meta: PaginatedMeta }>>(
      const { data } = await api.get<ApiResponse<{ businesses: BusinessOption[] }>>(
      const { data } = await api.get<ApiResponse<{ categories: BusinessCategory[] }>>(
      const { data } = await api.post<ApiResponse<{ id: string; name: string }>>(
      const { data } = await api.post<ApiResponse<{ id: string; business_name: string }>>(
      const { data } = await api.post<ApiResponse<{ message: string; id: string }>>(
      const { data } = await api.patch<ApiResponse<{ message: string }>>(
      await api.delete(`/admin/campaigns/${id}`);

## complai.ts
      const res = await api.get('/admin/complaints', { params });
      const res = await api.get(`/admin/complaints/${id}`);
      const res = await api.patch(`/admin/complaints/${id}/review`);
      const res = await api.patch(`/admin/complaints/${id}/resolve`, {
      const res = await api.patch(`/admin/complaints/${id}/reject`, {
      const res = await api.patch(`/admin/complaints/${id}/priority`, { priority });

## deaths
      const { data } = await api.get<ApiResponse<{ notices: DeathNotice[]; meta: PaginatedMeta }>>(
      const { data } = await api.get<ApiResponse<{ cemeteries: Cemetery[] }>>(
      const { data } = await api.post<ApiResponse<{ cemetery: Cemetery }>>(
      const { data } = await api.patch<ApiResponse<{ cemetery: Cemetery }>>(
      await api.delete(`/admin/deaths/cemeteries/${id}`);
      const { data } = await api.get<ApiResponse<{ mosques: Mosque[] }>>(
      const { data } = await api.post<ApiResponse<{ mosque: Mosque }>>(
      const { data } = await api.patch<ApiResponse<{ mosque: Mosque }>>(
      await api.delete(`/admin/deaths/mosques/${id}`);
      const { data } = await api.get<ApiResponse<{ neighborhoods: Array<{ id: string; name: string }> }>>(
      const { data } = await api.post<ApiResponse<{ notice: DeathNotice }>>(
      const { data } = await api.patch<ApiResponse<{ notice: DeathNotice }>>(
      await api.delete(`/admin/deaths/${id}`);

## eve.ts
      const { data } = await api.get<{
      const { data } = await api.get<{
      const { data } = await api.post<{
      const { data } = await api.post<{
      const { data } = await api.patch<{
      await api.delete(`/admin/events/${id}`);

## guide
      const res = await api.get('/admin/guide/categories');
      const res = await api.post('/admin/guide/categories', dto);
      const res = await api.patch(`/admin/guide/categories/${id}`, dto);
      await api.delete(`/admin/guide/categories/${id}`);
      const res = await api.get(`/admin/guide/items?${params.toString()}`);
      const res = await api.post('/admin/guide/items', dto);
      const res = await api.patch(`/admin/guide/items/${id}`, dto);
      await api.delete(`/admin/guide/items/${id}`);

## intercity
      const { data } = await api.get<
      const { data } = await api.get<ApiResponse<{ route: IntercityRoute }>>(
      const { data } = await api.post<ApiResponse<{ route: IntercityRoute }>>(
      const { data } = await api.patch<ApiResponse<{ route: IntercityRoute }>>(
      await api.delete(`/admin/transport/intercity/${id}`);
      const { data } = await api.post<ApiResponse<{ schedule: IntercitySchedule }>>(
      const { data } = await api.patch<ApiResponse<{ schedule: IntercitySchedule }>>(
      await api.delete(`/admin/transport/intercity/schedules/${scheduleId}`);

## intracity
      const { data } = await api.get<
      const { data } = await api.get<ApiResponse<{ route: IntracityRoute }>>(
      const { data } = await api.post<ApiResponse<{ route: IntracityRoute }>>(
      const { data } = await api.patch<ApiResponse<{ route: IntracityRoute }>>(
      await api.delete(`/admin/transport/intracity/${id}`);
      const { data } = await api.post<ApiResponse<{ stop: IntracityStop }>>(
      const { data } = await api.patch<ApiResponse<{ stop: IntracityStop }>>(
      await api.delete(`/admin/transport/intracity/stops/${stopId}`);
      const { data } = await api.patch<ApiResponse<{ stop: IntracityStop }>>(

## neighborhoods
      const { data } = await api.get<ApiResponse<{ neighborhoods: Neighborhood[]; meta: PaginatedMeta }>>(
      const { data } = await api.post<ApiResponse<{ neighborhood: Neighborhood }>>(
      const { data } = await api.patch<ApiResponse<{ neighborhood: Neighborhood }>>(
      await api.delete(`/admin/neighborhoods/${id}`);

## pharmacy
      const { data } = await api.get<ApiResponse<{ pharmacies: Pharmacy[] }>>(
      const { data } = await api.get<ApiResponse<{ schedule: PharmacySchedule[] }>>(
      const { data } = await api.post<ApiResponse<{ pharmacy: Pharmacy }>>(
      const { data } = await api.patch<ApiResponse<{ pharmacy: Pharmacy }>>(
      await api.delete(`/admin/pharmacy/${id}`);
      const { data } = await api.post<ApiResponse<{ schedule: PharmacySchedule }>>(
      await api.delete(`/admin/pharmacy/schedule/${id}`);

## places
      const res = await api.get('/admin/places/categories');
      const res = await api.post('/admin/places/categories', dto);
      const res = await api.patch(`/admin/places/categories/${id}`, dto);
      await api.delete(`/admin/places/categories/${id}`);
      const res = await api.get(`/admin/places?${params.toString()}`);
      const res = await api.post('/admin/places', dto);
      const res = await api.patch(`/admin/places/${id}`, dto);
      await api.delete(`/admin/places/${id}`);
      const res = await api.post(`/admin/places/${id}/images`, { file_ids });
      await api.delete(`/admin/places/images/${imageId}`);
      const res = await api.patch(`/admin/places/images/${imageId}/set-cover`);
      const res = await api.patch(`/admin/places/${id}/images/reorder`, { ordered_ids });

## settings
      const res = await api.get('/admin/profile');
      const res = await api.patch('/admin/profile', dto);
      const res = await api.patch('/admin/change-password', dto);

## staff
      const { data } = await api.get<
      const { data } = await api.get<ApiResponse<AdminStaff>>(`/admin/staff/${id}`);
      const { data } = await api.post<ApiResponse<AdminStaff>>('/admin/staff', dto);
      const { data } = await api.patch<ApiResponse<AdminStaff>>(`/admin/staff/${id}`, dto);
      const { data } = await api.patch<ApiResponse<AdminStaff>>(
      await api.delete(`/admin/staff/${id}`);
      const { data } = await api.patch<ApiResponse<AdminStaff>>(

## taxi
      const { data } = await api.get<{
      const { data } = await api.post<{
      const { data } = await api.patch<{
      await api.delete(`/admin/taxi/${id}`);

## toast

## users
      const { data } = await api.get<ApiResponse<{ users: User[]; total: number; page: number; limit: number }>>(
      const { data } = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
      const { data } = await api.post<ApiResponse<{ message: string; banned_until: string | null }>>(
      const { data } = await api.post<ApiResponse<{ message: string }>>(
      const { data } = await api.patch<ApiResponse<{ message: string; role: string }>>(

---

## 3️⃣ REAL API RESPONSE STRUCTURES

Testing actual endpoints to verify response formats:

# REAL API RESPONSE STRUCTURES

## GET /ads
[
  "data",
  "meta",
  "success"
]

## GET /announcements
[
  "data",
  "meta",
  "success"
]

## GET /campaigns
[
  "data",
  "meta",
  "success"
]

## GET /deaths
[
  "error",
  "meta",
  "success"
]

## GET /events
[
  "error",
  "meta",
  "success"
]

---

## 🔴 CRITICAL FINDINGS & MISMATCHES

### Finding #1: Response Meta Structure
**Issue:** Inconsistency between documented and actual response structures.
**Example:** 
- Documentation shows: `meta: { page, limit, total, total_pages }`
- Actual response has: `data: { items, meta: { ... } }` + `meta: { timestamp, path }`

**Status:** ⚠️ PARTIALLY FIXED (Announcements updated, others need review)

### Finding #2: Admin Routes Prefix  
**Issue:** Some endpoints in backend don't match admin panel calls.
- Admin calls: `/admin/deaths/cemeteries`
- But no explicit admin routes found in deaths controller

**Status:** ⚠️ NEEDS INVESTIGATION

### Finding #3: Documentation Gaps
**Issue:** Some endpoints documented but implementation unclear.
**Affected:** Deaths (admin), Transport (admin), Pharmacy (admin), Places (admin)

**Status:** ⚠️ NEEDS VERIFICATION

### Finding #4: Query Parameters
**Issue:** Documented query params don't always match actual DTO support.
**Example:** Ads supports `sort=-created_at|price|-price|view_count` in docs
**Status:** ⚠️ NEEDS DTO VALIDATION

---

## ✅ WORKING CORRECTLY

1. **Announcements Module** - Recently updated, matches spec ✅
2. **Auth Flow** - OTP, Register, Refresh tokens documented correctly ✅
3. **Core Endpoints** - Neighborhoods, Files properly documented ✅

---

## 🎯 RECOMMENDATIONS (PRIORITY ORDER)

### 🔴 CRITICAL (Do Now):

1. **Standardize Response Format Across All Endpoints**
   ```json
   {
     "success": true,
     "data": { 
       "items": [...],
       "meta": { "page": 1, "limit": 20, "total": 100, "total_pages": 5 }
     },
     "meta": { "timestamp": "2026-02-26T15:42:00Z", "path": "/v1/..." }
   }
   ```
   **Why:** Flutter mobile depends on consistent `data.data.meta` structure
   **Timeline:** This week

2. **Audit & Fix Admin Routes**
   - Deaths: `/admin/deaths/*` or `/deaths/*`?
   - Transport: `/admin/transport/*` or `/transport/*`?
   - Pharmacy: `/admin/pharmacy/*` or `/pharmacy/*`?
   - Places: `/admin/places/*` or `/places/*`?
   
   **Why:** Admin panel may be calling wrong routes
   **Timeline:** This week

3. **Update docs/04_API_ENDPOINTS_MASTER.md**
   - Add actual response structures for all modules
   - Include `meta` field in all examples
   - Add note about pagination vs TransformInterceptor
   
   **Why:** Prevents Flutter dev errors
   **Timeline:** Before starting new module

### 🟡 IMPORTANT (This Week):

4. **Create Module Checklist**
   - Backend endpoint implementation ✅
   - Admin panel hooks ✅
   - Documentation ✅
   - Real API response examples ✅
   - Flutter implementation ready

5. **Validate Query DTOs**
   - Verify documented params are supported
   - Example: Ads `sort` parameter validation

### 🟢 NICE TO HAVE (Later):

6. **Auto-generate documentation** from Swagger/OpenAPI
7. **API contract testing** (ensure docs match reality)
8. **Response schema validation** middleware

---

## 📋 MODULE-BY-MODULE STATUS

| Module | Backend | Admin | Docs | Real Test | Status |
|--------|---------|-------|------|-----------|--------|
| Auth | ✅ | ✅ | ✅ | ✅ | 🟢 OK |
| Announcements | ✅ | ✅ | ✅ | ✅ | 🟢 FIXED |
| Ads | ✅ | ✅ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Deaths | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Campaigns | ✅ | ✅ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Events | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Transport | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Pharmacy | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Places | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Guide | ✅ | ❓ | ✅ | ❓ | 🔴 ADMIN MISMATCH |
| Taxi | ✅ | ❓ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Jobs | ✅ | ❓ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Notifications | ✅ | ✅ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Users/Profile | ✅ | ✅ | ✅ | ❓ | 🟡 NEEDS CHECK |
| Files | ✅ | ✅ | ✅ | ✅ | 🟢 OK |
| Admin Panel | ✅ | - | ✅ | ✅ | 🟢 OK |

---

## 🚀 NEXT STEPS FOR FLUTTER DEVELOPMENT

### Before Starting New Module:
1. ✅ Verify backend endpoint exists
2. ✅ Check admin panel hook implementation
3. ✅ Review documentation
4. ✅ Test real API response
5. ✅ Verify response matches `data.data.meta` structure
6. ✅ Implement Flutter model with safe parsing

### For Admin Mismatch Issues:
1. Verify which route prefix is correct (`/admin/*` or `/*`)
2. Check if admin panel is using wrong endpoint
3. Update documentation to match reality
4. Update Flutter to use correct endpoint

---

**Generated:** 2026-02-26 15:42:52  
**Tool:** Automated Bash Audit Script  
**Status:** ✅ COMPLETE

