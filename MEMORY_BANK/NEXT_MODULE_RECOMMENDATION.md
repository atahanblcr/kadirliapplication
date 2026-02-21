# Next Module Recommendation - Admin Panel Development

**Date:** 21 Şubat 2026
**Status:** Ready for Implementation
**Prepared by:** Claude Code

---

## 📊 Project Status Summary

### ✅ Completed (100%)
1. **Dashboard** - KPI cards, user growth chart, module usage bar, quick actions, activity feed
2. **Announcements Module** - Liste sayfası, Detay modal, Create/Edit form, Delete dialog
3. **Ads Module** - List with 2 tabs (Pending+Approved), Detail modal with image gallery, Inline actions

### 📝 Placeholder Pages (Created but Empty)
- Deaths, Campaigns, Pharmacy, Guide, Places, Transport, Events, Taxi, Users, Complaints, Scrapers, Settings

### 🏗️ Architecture Established
- Next.js 14 App Router with route groups: `(auth)` & `(dashboard)`
- TypeScript with Zod validation
- React Hook Form for forms
- React Query with cache invalidation patterns
- Axios with JWT interceptor + auto-retry on 401
- shadcn/ui component library (23+ components)
- Custom MultiSelect component (Command + Popover)
- Sonner toast notifications
- Tailwind CSS styling

---

## 🎯 Recommendation: Build "Deaths" (Vefat İlanları) Module Next

### Why Deaths?

| Criterion | Score | Reason |
|-----------|-------|--------|
| **Wire frame Complete** | ✅ 100% | Detailed wireframe with all sections |
| **Backend Ready** | ✅ 100% | All endpoints implemented & tested |
| **Complexity** | ⭐⭐⭐ | MEDIUM - Similar to Ads (list + detail + approve/reject) |
| **Type Reusability** | ✅ High | Can reuse patterns from Ads module |
| **UI Pattern Familiar** | ✅ High | Same moderation workflow as Ads |
| **Development Time** | ⏱️ 2-3 hours | Fastest to implement, high-quality delivery |
| **Risk Level** | 🟢 Low | Well-defined, minimal unknowns |
| **User Value** | 📈 High | Critical death announcements need moderation |

### Alternative Modules (In Priority Order)

| Module | Complexity | Time | Why Next? |
|--------|-----------|------|-----------|
| **Campaigns** | 🟠 Medium-High | 4 hrs | Statistics dashboard is new UI pattern, but similar approval flow |
| **Users** | 🟠 Medium-High | 4-5 hrs | Operationally important, but larger data + more actions |
| **Pharmacy** | 🔴 High | 5-6 hrs | Calendar component is complex, multi-tab setup |
| **Complaints** | 🟡 Medium | 3-4 hrs | No wireframe yet, needs clarification |
| **Settings** | 🟡 Medium | 3 hrs | Tab-based form, but lower priority |

---

## 📋 Deaths Module - Detailed Workflow

### Module Overview
- **Purpose:** Moderate death announcements (automatic approval + archival)
- **Users:** Admin moderators only
- **Key Feature:** Auto-archive 7 days after funeral date
- **Approval Types:** Same as Ads (Onayla/Reddet with reason + optional note)

### Page Structure

```
/admin/deaths/
├── page.tsx (Main list view with 2 tabs)
├── detail-modal.tsx (View + Approve/Reject/Edit/Delete)
└── death-form.tsx (Create/Edit form)

Types:
├── DeathAnnouncement (from API)
├── DeathFilters
├── DeathCreateRequest
├── DeathUpdateRequest
└── AdminDeathApprovalResponse

Hooks:
├── usePendingDeaths() - 30sec auto-refresh like Ads
├── useDeaths() - Full list with pagination
├── useDeathDetail()
├── useApproveDeathAnnouncement()
├── useRejectDeathAnnouncement()
├── useDeleteDeathAnnouncement()
└── useUpdateDeathAnnouncement()

Utils:
└── death-utils.tsx (StatusBadge, REJECTION_REASONS array)
```

### UI Components Breakdown

#### 1. List Page (`/admin/deaths/page.tsx`)
**Features:**
- Header: "Vefat İlanları" + Create button
- Filter Bar: Search + Funeral date filter + Status filter
- Status Tabs: [Bekleyen] [Aktif] [Arşiv]
- Pending Section (ACİL! badge): Shows pending items with urgent styling
- Active Section: Current death announcements with auto-archive countdown
- Archive Section: Archived/deleted items (read-only)

**Row Structure:**
```
[📸] Name (Age) | Cenaze: Date - Time | Mezarlık: Location
👁️ Views | Days until archive | [👁️ Detay] [✓ Onayla] [✕ Reddet]
```

**Pagination:** Same as Ads (page + limit)

#### 2. Detail Modal (`/admin/deaths/detail-modal.tsx`)
**Layout:** Left image + Right details (like Ads)

**Left Side:**
- Photo (400x400) - Black & white preferred
- Deceased person

**Right Side - Sections:**
```
Kişi Bilgileri
- Ad Soyadı: [Name]
- Yaş: [Age]

Cenaze Bilgileri
- Tarih: [Date] (e.g., "17 Şubat 2026 (Cumartesi)")
- Saat: [Time]
- Mezarlık: [Cemetery Name]
  🗺️ Haritada Gör (Google Maps link)
- Cenaze Namazı: [Mosque Name]
  🗺️ Haritada Gör
- Taziye Evi: [Address]
  🗺️ Haritada Gör

Ekleyen
- 👤 Username
- 📱 Phone
- 📅 Posted 3 hours ago

Otomatik Arşivleme
- 📅 24 Şubat 2026 14:00'da arşivlenecek
- (Definden 7 gün sonra)
```

**Action Buttons:**
- [✓ Onayla] - Approve & notify users
- [✕ Reddet] - Inline dialog with 4 rejection reasons
- [📝 Düzenle] - Edit details (if needed)
- [🗑️ Sil] - Soft delete with confirmation (not permanent archive)

**Rejection Dialog** (inline, similar to Ads):
- Select dropdown: [Uygunsuz fotoğraf ▼]
- Text area: Optional note
- [İptal] [Reddet] buttons

#### 3. Create/Edit Form (`/admin/deaths/death-form.tsx`)
**Sheet Component:**

**Fields:**
```
Fotoğraf *
[Upload Button] - Single image, 400x400 preferred

Ad Soyadı *
[Input field]

Yaş *
[Number input]

Cenaze Tarihi *
[Date picker] [Time picker]

Mezarlık *
[Select/Search dropdown]
[🗺️] (Show on map button)

Cenaze Namazı Yeri *
[Select/Search dropdown]
[🗺️]

Taziye Evi Adresi
[Textarea] - Optional

Mahalle (Ekleyen) *
[Select dropdown]

İletişim Bilgileri
Telefon: [Readonly - from user]
Kullanıcı: [Readonly - from user]
```

**Validation (Zod):**
- Photo: Required, must be image
- Name: Required, string, max 100
- Age: Required, number, 1-150
- Funeral date/time: Required, future date or today
- Cemetery: Required
- Mosque: Required
- Condolence address: Optional, max 500
- Neighborhood: Required (targets notifications)

**Buttons:**
- [İptal] [Taslak] [Yayınla]

---

## 🔌 API Integration Points

### Endpoints Used (from API docs)

```
GET  /v1/admin/deaths
     ?page=1&limit=20&status=pending|approved|archived

GET  /v1/admin/deaths/:id

POST /v1/admin/deaths/approve/:id
     { message?: string }

POST /v1/admin/deaths/reject/:id
     { reason: string; note?: string }

DELETE /v1/admin/deaths/:id

PATCH /v1/admin/deaths/:id
      { ...updateData }
```

### Response Structure

**List Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ahmet YILMAZ",
      "age": 75,
      "photo_url": "...",
      "funeral_date": "2026-02-17T14:00:00Z",
      "cemetery_id": "uuid",
      "cemetery_name": "Merkez Mezarlığı",
      "mosque_id": "uuid",
      "mosque_name": "Merkez Camii",
      "condolence_address": "...",
      "status": "pending|approved|archived",
      "views": 567,
      "auto_archive_at": "2026-02-24T14:00:00Z",
      "created_by": { "id": "uuid", "username": "mehmet123", "phone": "..." },
      "created_at": "2026-02-16T10:00:00Z",
      "updated_at": "2026-02-16T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 💻 Code Structure Template

### File Creation Checklist

**Types** (`/admin/src/types/index.ts` - append):
```typescript
export interface DeathAnnouncement {
  id: string;
  name: string;
  age: number;
  photo_url: string;
  funeral_date: string;
  cemetery_id: string;
  cemetery_name: string;
  mosque_id: string;
  mosque_name: string;
  condolence_address?: string;
  status: 'pending' | 'approved' | 'archived';
  views: number;
  auto_archive_at: string;
  created_by: { id: string; username: string; phone: string };
  created_at: string;
  updated_at: string;
}

export interface DeathFilters {
  status?: 'pending' | 'approved' | 'archived';
  search?: string;
  funeral_date_from?: string;
  funeral_date_to?: string;
  page?: number;
  limit?: number;
}

export interface AdminDeathApprovalResponse {
  data: DeathAnnouncement[];
  meta: { page: number; limit: number; total: number; total_pages: number; has_next: boolean; has_prev: false };
}
```

**Hooks** (`/admin/src/hooks/use-deaths.ts` - new file):
```typescript
export function usePendingDeaths(autoRefresh = true) {
  // 30 second auto-refresh like usePendingAds
  // Invalidate on mutation
}

export function useDeaths(filters?: DeathFilters) {
  // Standard list with pagination
}

export function useDeathDetail(id: string) {
  // Single item detail
}

export function useApproveDeathAnnouncement() {
  // Mutate + invalidate list
}

export function useRejectDeathAnnouncement() {
  // Mutate + invalidate list
  // Pass: id, reason, note?
}

export function useDeleteDeathAnnouncement() {
  // Mutate + invalidate list
}

export function useUpdateDeathAnnouncement() {
  // For edit form
}
```

**Utils** (`/admin/src/lib/death-utils.tsx` - new file):
```typescript
export function DeathStatusBadge({ status }: { status: string }) {
  // pending: red/warning
  // approved: green/success
  // archived: gray/secondary
}

export const DEATH_REJECTION_REASONS = [
  "Uygunsuz fotoğraf",
  "Hatalı bilgiler",
  "Spam/Sahte ilan",
  "Diğer (not'ta belirtin)"
];

export function formatFuneralDate(date: string) {
  // "17 Şubat 2026 (Cumartesi) - 14:00"
}

export function calculateArchiveDate(funeralDate: string) {
  // +7 days
}
```

---

## 🎨 UI Pattern Reference

### Reuse from Ads Module:
- ✅ List page structure (status tabs + pending section with urgent styling)
- ✅ Detail modal layout (left image + right info grid)
- ✅ Inline rejection dialog with reason select + note textarea
- ✅ Soft delete confirmation dialog
- ✅ Pagination component
- ✅ Filter bar component
- ✅ React Query cache invalidation pattern
- ✅ Badge styling for status/urgency

### New Patterns:
- Auto-archive countdown timer (calculated from funeral_date + 7 days)
- Map links for cemetery/mosque locations (href: `https://google.com/maps/search/...`)
- Age + Name combined display (e.g., "Ahmet YILMAZ (75)")

---

## ✅ Testing Checklist (Before Handoff)

- [ ] List page loads with pending/active/archived tabs
- [ ] Pending items show "ACİL!" badge
- [ ] Auto-archive countdown displays correctly
- [ ] Detail modal shows all death info + locations
- [ ] Approve button works + updates list
- [ ] Reject dialog appears + works with reason select
- [ ] Delete dialog appears + works
- [ ] Edit form saves changes
- [ ] 30-second auto-refresh works for pending items
- [ ] Pagination works
- [ ] Search/filter works
- [ ] Maps links open in new tab (cemetery/mosque/address)
- [ ] Responsive on mobile/tablet

---

## 📝 Git Commit Strategy

When done, create 1-2 commits:

```bash
# Single commit (recommended):
feat: implement Deaths module (list, detail modal, approval workflow)

# Or split into 2 if large:
feat: add Deaths module list and detail views
feat: add Deaths approval/rejection workflow
```

---

## 🚀 Next Steps After Deaths

1. **Campaigns** - Approval workflow + statistics dashboard
2. **Users** - User management with action buttons
3. **Pharmacy** - Calendar view (more complex)

---

## 📞 Important Notes

### Key Business Rules:
- Auto-archive: funeral_date + 7 days (automatically by cron job)
- Manual actions: Approve/Reject are admin-only (no edit in UI if already approved)
- Notifications: Approval sends push to all users in that neighborhood
- Rejection: Sends notification to submitter with reason

### UI/UX Guidelines:
- Pending items are URGENT - use red/warning colors
- Cemetery/Mosque/Address links should open Google Maps
- Archive section is read-only (no actions)
- Dates should include day of week: "17 Şubat 2026 (Cumartesi)"
- Times in 24-hour format: "14:00"

### Performance:
- 30-second auto-refresh for pending items only
- Cache invalidation on list + detail after mutations
- Images should be optimized (next/image)
- Lazy load archive section if list is large

---

**Status:** Ready for Implementation
**Estimated Duration:** 2-3 hours
**Next Review:** After Deaths module completion

