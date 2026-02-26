# Quick Reference - Backend Cleanup (BUSINESS Role, Campaigns, Deaths, Files)

## 🚀 Quick Delete List

### 1. UserRole Enum
```typescript
// /backend/src/common/enums/user-role.enum.ts - LINE 4
❌ REMOVE: BUSINESS = 'business',
```

### 2. Campaign Creation Endpoint (PUBLIC)
```typescript
// /backend/src/campaigns/campaigns.controller.ts - LINES 50-61
❌ DELETE: @Post() create() method (UserRole.BUSINESS only)
✅ KEEP: @Get(), @Get(':id'), @Post(':id/view-code')
```

### 3. Death Creation Endpoint (PUBLIC)
```typescript
// /backend/src/deaths/deaths.controller.ts - LINES 116-123
❌ DELETE: @Post() create() method (auth required, any user)
✅ KEEP: GET endpoints, Admin endpoints
```

### 4. Campaign Service - Create Method
```typescript
// /backend/src/campaigns/campaigns.service.ts - LINES 132-201
❌ DELETE: async create(userId, dto) method
✅ KEEP: findAll(), findOne(), viewCode()
```

### 5. Deaths Service - Create Method
```typescript
// /backend/src/deaths/deaths.service.ts - LINES 73-?
⚠️ OPTION A: Remove entire method
⚠️ OPTION B: Keep but restrict to admin-only in controller
```

### 6. Business Entity
```typescript
// /backend/src/database/entities/business.entity.ts
❌ DELETE: Entire file (80 lines)
```

### 7. BusinessCategory Entity
```typescript
// /backend/src/database/entities/business-category.entity.ts
❌ DELETE: Entire file (43 lines)
```

### 8. Admin - Business Operations
```typescript
// /backend/src/admin/campaign-admin.controller.ts - LINES 31-53
❌ DELETE:
  - @Get('businesses') getAdminBusinesses()
  - @Get('businesses/categories') getBusinessCategories()
  - @Post('businesses/categories') createBusinessCategory()
  - @Post('businesses') createAdminBusiness()

✅ KEEP:
  - Campaign CRUD operations (lines 55-90)
```

### 9. Admin Service - Business Methods
```typescript
// /backend/src/admin/admin.service.ts
❌ DELETE Methods (Lines ~776-870):
  - getAdminBusinesses()
  - getBusinessCategories()
  - createBusinessCategory()
  - createAdminBusiness()

❌ DELETE Repository Injections (Lines ~131-133):
  - @InjectRepository(Business)
  - @InjectRepository(BusinessCategory)

✅ KEEP:
  - Campaign admin methods
  - All other service methods
```

### 10. DTOs to Delete
```typescript
❌ /backend/src/campaigns/dto/create-campaign.dto.ts
❌ /backend/src/admin/dto/create-admin-business.dto.ts
❌ /backend/src/admin/dto/create-business-category.dto.ts
✅ Keep: All other DTOs
```

### 11. File Upload (Optional)
```typescript
// /backend/src/files/files.controller.ts
❌ DELETE: @Post('upload') uploadFile()
❌ DELETE: @Delete(':id') deleteFile()

// /backend/src/files/files.service.ts
❌ DELETE: async uploadFile() method
❌ DELETE: async deleteFile() method

// /backend/src/files/dto/upload-file.dto.ts
❌ DELETE: Entire file

✅ KEEP: FileEntity, FilesModule (for internal file references)
```

### 12. Module Imports
```typescript
// /backend/src/admin/admin.module.ts - Lines 8-9, 56-57
❌ REMOVE:
  import { Business } from '../database/entities/business.entity';
  import { BusinessCategory } from '../database/entities/business-category.entity';

  // From TypeOrmModule.forFeature([...]):
  Business,
  BusinessCategory,
```

### 13. Test Files - Remove Test Cases
```typescript
// /backend/src/admin/admin.service.spec.ts
❌ Lines 467, 470, 695, 699, 702, 709: Remove business role tests

// /backend/src/campaigns/campaigns.controller.spec.ts
❌ Line 10: Remove or update business user mock

// /backend/src/campaigns/campaigns.service.spec.ts
❌ Remove tests for create() method

// /backend/src/files/files.controller.spec.ts
❌ Remove uploadFile/deleteFile tests (or delete entire file)

// /backend/src/files/files.service.spec.ts
❌ Remove uploadFile/deleteFile tests
```

### 14. Database Migration
```sql
-- NEW migration file needed
-- Drop tables IN ORDER (reverse of creation):
DROP TABLE campaign_code_views;
DROP TABLE campaign_images;
DROP TABLE campaigns;
DROP TABLE businesses;
DROP TABLE business_categories;

-- Update enum:
ALTER TYPE users_role_enum REMOVE VALUE 'business';

-- Update default:
ALTER TABLE users ALTER COLUMN notification_preferences
  SET DEFAULT '{"announcements":true,"deaths":true,"pharmacy":true,"events":true,"ads":false}';
```

### 15. Documentation
```markdown
❌ /docs/04_API_ENDPOINTS_MASTER.md
   - Remove: Section "9. CAMPAIGNS"
   - Remove: "POST /campaigns" endpoint
   - Remove: "POST /files/upload", "DELETE /files/:id"

❌ /docs/01_DATABASE_SCHEMA_FULL.sql
   - Remove: CREATE TABLE statements for business_categories, businesses, campaigns, campaign_images, campaign_code_views

❌ /docs/02_ERD_DIAGRAM.md
   - Remove: Business entity box
   - Remove: BusinessCategory entity box
   - Remove: Campaign entity box (or keep but note no creation)
   - Remove: CampaignImage entity box
   - Remove: CampaignCodeView entity box
```

---

## 📊 What to Keep

✅ **Campaign Browsing (Read-Only):**
- GET /campaigns (public list)
- GET /campaigns/:id (public detail)
- POST /campaigns/:id/view-code (auth required)

✅ **Campaign Admin (For Staff Management):**
- GET /admin/campaigns
- GET /admin/campaigns/:id
- POST /admin/campaigns (admin creates campaigns)
- PATCH /admin/campaigns/:id
- DELETE /admin/campaigns/:id

✅ **Death Notice Viewing:**
- GET /deaths/cemeteries (public)
- GET /deaths/mosques (public)
- GET /deaths/:id (auth)
- GET /deaths/admin (admin)
- POST /deaths/:id/approve (admin)
- POST /deaths/:id/reject (admin)
- DELETE /deaths/:id (admin)

---

## 🔄 Implementation Order

```
1. Delete DTO files (3 files)
2. Remove methods from controllers (3 files)
3. Remove methods from services (3 files)
4. Delete entity files (2 files)
5. Update module imports (2 files)
6. Remove enum value (1 file)
7. Update test files (5 files)
8. Create migration (1 file)
9. Update docs (3 files)
```

**Estimated Time:** 2-3 hours (code changes) + 1 hour (testing)

---

## ✅ Verification Checklist

After completion, verify:

```sql
-- No BUSINESS role users
SELECT COUNT(*) FROM users WHERE role = 'business'; -- Should be 0

-- No orphaned campaigns (optional if keeping campaigns)
SELECT COUNT(*) FROM campaigns WHERE business_id NOT IN
  (SELECT id FROM businesses); -- Should be 0

-- Enum doesn't have business value
SELECT enum_range(null::"users_role_enum");
-- Should NOT include 'business'
```

Test endpoints:
```bash
# These should 404 or 403 (no longer exist):
POST /campaigns           # 403 (endpoint removed)
POST /deaths             # 403 (endpoint removed)
POST /files/upload       # 404 (endpoint removed)
DELETE /files/:id        # 404 (endpoint removed)

# These should still work:
GET /campaigns           # 200 (public list)
GET /campaigns/:id       # 200 (public detail)
GET /admin/campaigns     # 200 (admin list)
```

Run tests:
```bash
npm test                 # All tests should pass
npm run coverage         # Coverage report
```

---

## 💾 Files Checklist

### DELETE (8 files):
- [ ] /backend/src/campaigns/dto/create-campaign.dto.ts
- [ ] /backend/src/database/entities/business.entity.ts
- [ ] /backend/src/database/entities/business-category.entity.ts
- [ ] /backend/src/admin/dto/create-admin-business.dto.ts
- [ ] /backend/src/admin/dto/create-business-category.dto.ts
- [ ] /backend/src/files/files.controller.ts
- [ ] /backend/src/files/files.service.ts
- [ ] /backend/src/files/dto/upload-file.dto.ts

### MODIFY (21 files):
- [ ] /backend/src/common/enums/user-role.enum.ts
- [ ] /backend/src/campaigns/campaigns.controller.ts
- [ ] /backend/src/campaigns/campaigns.service.ts
- [ ] /backend/src/campaigns/campaigns.module.ts
- [ ] /backend/src/deaths/deaths.controller.ts
- [ ] /backend/src/deaths/deaths.service.ts
- [ ] /backend/src/admin/campaign-admin.controller.ts
- [ ] /backend/src/admin/admin.service.ts
- [ ] /backend/src/admin/admin.module.ts
- [ ] /backend/src/database/migrations/1771619909777-InitialSchema.ts
- [ ] /backend/src/files/files.service.spec.ts
- [ ] /backend/src/admin/admin.service.spec.ts
- [ ] /backend/src/campaigns/campaigns.controller.spec.ts
- [ ] /backend/src/campaigns/campaigns.service.spec.ts
- [ ] /backend/src/admin/campaign-admin.controller.spec.ts
- [ ] /backend/src/app.module.ts (optional - if completely removing campaigns)
- [ ] /docs/04_API_ENDPOINTS_MASTER.md
- [ ] /docs/01_DATABASE_SCHEMA_FULL.sql
- [ ] /docs/02_ERD_DIAGRAM.md
- [ ] CLAUDE.md (update module count)
- [ ] /backend/src/files/files.controller.spec.ts

---

**Last Updated:** 26 February 2026
**Status:** Ready for Implementation
