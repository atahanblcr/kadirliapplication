# Backend Code Cleanup Analysis - BUSINESS Role, Campaigns, Deaths, File Uploads
**Date:** 26 February 2026
**Analysis Scope:** Remove BUSINESS role, public campaign/death creation, business entities, and file upload endpoints

---

## 📋 Executive Summary

This document provides a **comprehensive analysis** of all code that needs to be removed or modified to eliminate:
1. **BUSINESS role** (`UserRole.BUSINESS`) - support for business users
2. **Public campaign creation** - `POST /campaigns` endpoint requiring BUSINESS role
3. **Public death notice creation** - `POST /deaths` endpoint (currently auth-required, all users can create)
4. **Business entities & CRUD** - Business, BusinessCategory, and related admin operations
5. **File upload endpoints** - `POST /files/upload` and `DELETE /files/:id`

---

## 🔍 PART 1: BUSINESS ROLE REMOVAL

### 1.1 UserRole Enum Definition
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/common/enums/user-role.enum.ts`

**Current Content:**
```typescript
export enum UserRole {
  USER = 'user',
  TAXI_DRIVER = 'taxi_driver',
  BUSINESS = 'business',          // ← REMOVE THIS LINE
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
```

**Action:** Remove line 4: `BUSINESS = 'business',`

**Affected Tests:**
- `admin.service.spec.ts` - Lines 467, 470, 695, 699, 702, 709 (test cases using BUSINESS role)
  - Remove/update test cases: `changeUserRole` tests with 'business' role

---

## 🔍 PART 2: CAMPAIGNS MODULE REMOVAL

### 2.1 Campaign Controller (Public Endpoint)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/campaigns.controller.ts`

**Routes to Remove:**
```typescript
// ❌ LINE 50-61: POST /campaigns (Business-only endpoint)
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUSINESS)
async create(
  @CurrentUser() user: User,
  @Body() dto: CreateCampaignDto,
) {
  return this.campaignsService.create(user.id, dto);
}
```

**Routes to Keep:**
- `GET /campaigns` - Public list (keep)
- `GET /campaigns/:id` - Public detail (keep)
- `POST /campaigns/:id/view-code` - Auth + code view (keep)

---

### 2.2 Campaigns Service (Business Creation Logic)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/campaigns.service.ts`

**Methods to Remove:**
```typescript
// ❌ Lines 132-201: async create(userId, dto)
// - Finds business record by user_id
// - Validates monthly campaign limit (5/month)
// - Creates campaign with status='pending'
// - Creates campaign images
async create(userId: string, dto: CreateCampaignDto)
```

**Dependency:** Uses `@InjectRepository(Business)` - can be removed from constructor after this is deleted.

**Imported Types:** Keep all (for admin-side operations and relations)

---

### 2.3 Campaign DTO Files
**Files to Delete:**
1. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/dto/create-campaign.dto.ts`
   - Lines 17-72: CreateCampaignDto class
   - Validated fields: title, description, discount_*, terms, start_date, end_date, image_ids

---

### 2.4 Campaign Module Registration
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/campaigns.module.ts`

**Current State:**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignImage, CampaignCodeView, Business]),
    // Business is imported here but ONLY used in public service methods
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
```

**Action:** Remove `Business` from `TypeOrmModule.forFeature()` if campaigns.service no longer uses it

---

### 2.5 App Module Registration
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/app.module.ts`

**Current:** Has `CampaignsModule` imported (line 16)

**Action:** Can keep `CampaignsModule` if keeping public campaign browsing. Only remove if campaigns completely eliminated.

---

### 2.6 Campaign Test Files
**Files with BUSINESS role tests:**
1. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/campaigns.controller.spec.ts`
   - Line 10: `({ id: 'user-uuid-1', role: 'business' } as User);` - Update or remove test

2. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/campaigns/campaigns.service.spec.ts`
   - Any tests for `service.create()` method

---

## 🔍 PART 3: DEATHS MODULE - PUBLIC CREATION ENDPOINT

### 3.1 Deaths Controller
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/deaths/deaths.controller.ts`

**Routes to Remove:**
```typescript
// ❌ LINES 116-123: POST /deaths (currently any authenticated user)
@Post()
@UseGuards(JwtAuthGuard)
async create(
  @CurrentUser() user: User,
  @Body() dto: CreateDeathNoticeDto,
) {
  return this.deathsService.create(user.id, dto);
}
```

**Routes to Keep:**
- `GET /deaths/cemeteries` - Public (keep)
- `GET /deaths/mosques` - Public (keep)
- `GET /deaths/admin` - Admin list (keep)
- `POST /deaths/:id/approve` - Admin only (keep)
- `POST /deaths/:id/reject` - Admin only (keep)
- `DELETE /deaths/:id` - Admin only (keep)
- `GET /deaths` - Auth (currently allows all users, could restrict to ADMIN only)
- `GET /deaths/:id` - Auth (currently allows all users, could restrict to ADMIN only)

---

### 3.2 Deaths Service
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/deaths/deaths.service.ts`

**Methods to Remove:**
```typescript
// ❌ Lines 73-?: async create(userId, dto)
// - Creates death notice with status='draft'
// - All users can create (no business check)
async create(userId: string, dto: CreateDeathNoticeDto)
```

**Decision Point:**
- **Option A (Recommended):** Keep method but change to admin-only in controller
- **Option B:** Remove method entirely + DTO

For this analysis, recommending **Option A** - keep service method but require ADMIN role

---

### 3.3 Death Notice DTO
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/deaths/dto/create-death-notice.dto.ts`

**Status:** Keep if allowing admin-side death notice creation

---

### 3.4 Deaths Test Files
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/deaths/deaths.controller.spec.ts`

Search for tests covering `POST /deaths` endpoint and update/remove accordingly

---

## 🔍 PART 4: BUSINESS ENTITIES & ADMIN CRUD

### 4.1 Business Entity (Database Model)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/database/entities/business.entity.ts`

**Lines 1-80: Complete Business Class**
- Relations: User (OneToOne), BusinessCategory (ManyToOne), FileEntity (ManyToOne for logo)
- Fields: business_name, tax_number, address, phone, email, website_url, instagram_handle, logo_file_id, is_verified, verified_by/verified_at

**Action:** DELETE entire file

---

### 4.2 BusinessCategory Entity (Database Model)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/database/entities/business-category.entity.ts`

**Lines 1-43: Complete BusinessCategory Class**
- Hierarchical: parent_id, children relationships
- Fields: name, slug, parent_id, display_order, is_active

**Action:** DELETE entire file

---

### 4.3 Campaign Entity (Partial Modification)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/database/entities/campaign.entity.ts`

**Relationship to Business:**
```typescript
@ManyToOne(() => Business, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'business_id' })
business: Business;  // ← Keep relation, needed for admin campaign viewing
```

**Action:** Keep Business entity relation for admin-side campaign viewing (stores which "business" owns campaign - could be null/orphaned after Business deletion)

---

### 4.4 Admin Module - Campaign Admin Controller
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/campaign-admin.controller.ts`

**Methods to Remove:**
```typescript
// ❌ LINES 31-53: Business operations (keep campaign operations)
@Get('businesses') - getAdminBusinesses()
@Get('businesses/categories') - getBusinessCategories()
@Post('businesses/categories') - createBusinessCategory()
@Post('businesses') - createAdminBusiness()
```

**Methods to Keep:**
- `GET /admin/campaigns` - getAdminCampaigns()
- `GET /admin/campaigns/:id` - getAdminCampaignDetail()
- `POST /admin/campaigns` - createAdminCampaign()
- `PATCH /admin/campaigns/:id` - updateAdminCampaign()
- `DELETE /admin/campaigns/:id` - deleteAdminCampaign()

---

### 4.5 Admin Module - Campaign Admin DTO Files
**Files to Delete:**
1. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/dto/create-admin-business.dto.ts`
   - Lines 3-21: CreateAdminBusinessDto class

2. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/dto/create-business-category.dto.ts`
   - Lines 3-8: CreateBusinessCategoryDto class

**Files to Keep:**
- `query-admin-campaigns.dto.ts`
- `admin-create-campaign.dto.ts`
- `admin-update-campaign.dto.ts`
- `reject-campaign.dto.ts`

---

### 4.6 Admin Service - Business Operations
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/admin.service.ts`

**Methods to Remove:**
```typescript
// ❌ Lines 776-827: Entire business operations
async getAdminBusinesses()
async getBusinessCategories()
async createBusinessCategory(dto)
async createAdminBusiness(dto)
```

**Repository Dependencies:** Remove from constructor:
```typescript
// ❌ Lines 131-133: Remove these repositories
@InjectRepository(Business)
private readonly businessRepository: Repository<Business>,

@InjectRepository(BusinessCategory)
private readonly businessCategoryRepository: Repository<BusinessCategory>,
```

**Check Service Methods:** Search entire admin.service.ts for any other references to `businessRepository` or `businessCategoryRepository`

---

### 4.7 Admin Module - Entity Imports
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/admin.module.ts`

**Lines to Remove:**
```typescript
// ❌ Line 8: Remove Business import
import { Business } from '../database/entities/business.entity';

// ❌ Line 9: Remove BusinessCategory import
import { BusinessCategory } from '../database/entities/business-category.entity';

// ❌ Lines 56-57: Remove from TypeOrmModule.forFeature()
Business,
BusinessCategory,
```

---

### 4.8 Admin Module - Test Files
**Files with Business tests:**
1. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/admin.service.spec.ts`
   - Search for tests covering: getAdminBusinesses, createAdminBusiness, getBusinessCategories, createBusinessCategory
   - Remove or update those test cases

2. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/admin/campaign-admin.controller.spec.ts`
   - Check if tests cover business endpoints, update if needed

---

## 🔍 PART 5: FILE UPLOAD ENDPOINTS REMOVAL

### 5.1 Files Controller (Complete Removal)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/files.controller.ts`

**Methods to Remove:**
```typescript
// ❌ LINES 33-67: POST /files/upload
@Post('upload')
@UseInterceptors(FileInterceptor(...))
async uploadFile(userId, file, dto)

// ❌ LINES 69-77: DELETE /files/:id
@Delete(':id')
async deleteFile(userId, id)
```

**Action:** Either delete entire controller or keep for internal admin use only

**Recommendation:** DELETE ENTIRELY if files are only uploaded via module-specific endpoints (e.g., campaign images in admin panel use direct form uploads)

---

### 5.2 Files Service (Partial/Complete Removal)
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/files.service.ts`

**Methods to Remove:**
```typescript
// ❌ Lines 30-65: async uploadFile()
async uploadFile(userId, file, dto)

// ❌ Lines 70-83: async deleteFile()
async deleteFile(userId, id)
```

**Decision:**
- If admin image uploads use direct form handling (multipart) → DELETE both methods
- If internal services still need file storage → KEEP but make them private (remove from controller)

**Recommendation:** DELETE both methods if not used internally

---

### 5.3 Files Module Registration
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/files.module.ts`

**Status:** Keep if module provides other services. Otherwise can be deleted entirely.

---

### 5.4 Files DTO
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/dto/upload-file.dto.ts`

**Status:** DELETE if uploadFile service method is removed

---

### 5.5 File Entity
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/database/entities/file.entity.ts`

**Status:** KEEP - File records still needed for:
- Campaign images (stored in campaign_images table with file_id FK)
- Place images (stored in place_images table with file_id FK)
- Event images (stored in event_images table with file_id FK)
- Business logos (stored in businesses table with logo_file_id FK)

Note: After Business deletion, orphaned file records in files table won't affect database integrity

---

### 5.6 App Module - Files Registration
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/app.module.ts`

**Action:** Keep `FilesModule` imported if other modules depend on FileEntity or file operations

---

### 5.7 Files Test Files
**Files:**
1. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/files.controller.spec.ts`
   - DELETE if controller is deleted

2. `/Users/atahanblcr/Desktop/kadirliapp/backend/src/files/files.service.spec.ts`
   - UPDATE to remove uploadFile/deleteFile tests
   - KEEP if other file service methods exist

---

## 🔍 PART 6: DATABASE SCHEMA MIGRATION

### 6.1 Migration File
**File:** `/Users/atahanblcr/Desktop/kadirliapp/backend/src/database/migrations/1771619909777-InitialSchema.ts`

**Tables to Remove (Reverse Order - Honor FK Constraints):**

```sql
-- 1. Drop dependent tables FIRST
DROP TABLE campaign_code_views;        -- Depends on campaigns, users
DROP TABLE campaign_images;            -- Depends on campaigns, files
DROP TABLE campaigns;                  -- Depends on businesses, files, users
DROP TABLE businesses;                 -- Depends on users, business_categories, files
DROP TABLE business_categories;        -- Only depends on itself (parent_id)

-- 2. Update enum type to remove 'business' value
ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old";
CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'taxi_driver', 'moderator', 'admin', 'super_admin');
ALTER TABLE users ALTER COLUMN role TYPE "public"."users_role_enum" USING role::text::"public"."users_role_enum";
DROP TYPE "public"."users_role_enum_old";

-- 3. Remove notification_preferences JSON field references to campaigns
ALTER TABLE users ALTER COLUMN notification_preferences SET DEFAULT '{"announcements":true,"deaths":true,"pharmacy":true,"events":true,"ads":false}';
```

**Actions in Migration File:**
- Lines 8: Remove enum value 'business' from type creation
- Lines 41-45: Remove business_categories and businesses table creation
- Lines 43-45: Remove campaigns, campaign_images, campaign_code_views table creation
- Lines 93-103: Remove all foreign key constraints related to business/campaigns
- Lines 133-143: Remove drop constraints from down() method
- Lines 191-195: Remove drop table statements from down() method

**Recommendation:** Create NEW migration instead of modifying existing migration

---

### 6.2 User Table - notification_preferences Field
**Current Value:**
```json
{
  "announcements": true,
  "deaths": true,
  "pharmacy": true,
  "events": true,
  "ads": false,
  "campaigns": false
}
```

**New Value:**
```json
{
  "announcements": true,
  "deaths": true,
  "pharmacy": true,
  "events": true,
  "ads": false
}
```

**Migration:** Update default in schema migration

---

## 🔍 PART 7: DOCUMENTATION UPDATES

### 7.1 API Endpoints Documentation
**File:** `/Users/atahanblcr/Desktop/kadirliapp/docs/04_API_ENDPOINTS_MASTER.md`

**Sections to Remove:**
- "9. CAMPAIGNS" section that lists:
  - `GET /campaigns` - List campaigns (public)
  - `GET /campaigns/:id` - Campaign detail (public)
  - `POST /campaigns/:id/view-code` - View discount code
  - `POST /campaigns` - Create campaign (BUSINESS role) ← **DELETE THIS**

- "Files" section that documents:
  - `POST /files/upload` ← **DELETE THIS**
  - `DELETE /files/:id` ← **DELETE THIS**

**Keep:**
- Keep `GET /campaigns` public endpoints if campaign browsing remains
- Keep campaign-related notifications in User endpoints

---

### 7.2 Database Schema Documentation
**File:** `/Users/atahanblcr/Desktop/kadirliapp/docs/01_DATABASE_SCHEMA_FULL.sql`

**Remove:**
- `CREATE TABLE business_categories`
- `CREATE TABLE businesses`
- `CREATE TABLE campaigns`
- `CREATE TABLE campaign_images`
- `CREATE TABLE campaign_code_views`

---

### 7.3 ERD Diagram
**File:** `/Users/atahanblcr/Desktop/kadirliapp/docs/02_ERD_DIAGRAM.md`

**Remove:**
- Business entity box and all relations
- BusinessCategory entity box and all relations
- Campaign entity box and all relations
- CampaignImage entity box and all relations
- CampaignCodeView entity box and all relations

---

## 📊 PART 8: DEPENDENCIES & SIDE EFFECTS ANALYSIS

### 8.1 Database Foreign Keys (Order of Deletion)
```
campaigns.business_id → businesses.id (CASCADE DELETE)
campaign_images.campaign_id → campaigns.id (CASCADE DELETE)
campaign_code_views.campaign_id → campaigns.id (CASCADE DELETE)
campaign_code_views.user_id → users.id (CASCADE DELETE)
campaigns.cover_image_id → files.id
campaign_images.file_id → files.id (CASCADE DELETE)
campaigns.approved_by → users.id
businesses.user_id → users.id (CASCADE DELETE)
businesses.category_id → business_categories.id
businesses.logo_file_id → files.id
business_categories.parent_id → business_categories.id (Self-reference)
```

**Deletion Order:**
1. campaign_code_views (no FK dependencies)
2. campaign_images (no FK dependencies)
3. campaigns (depends on business_id)
4. businesses (depends on business_categories)
5. business_categories (only self-reference)
6. Remove enum value 'business' from users.role
7. Update users.notification_preferences default

---

### 8.2 Service Dependencies
```
CampaignsService:
  - Uses Business repository
  - Uses Campaign repository
  - Used by CampaignsController

CampaignAdminController:
  - Calls AdminService methods for business/campaign operations
  - Methods getAdminBusinesses, createAdminBusiness will be removed

AdminService:
  - Has businessRepository injected
  - Has businessCategoryRepository injected
  - Methods: getAdminBusinesses, getBusinessCategories, createBusinessCategory, createAdminBusiness
  - Methods: getAdminCampaigns, createAdminCampaign, etc. (KEEP campaigns, remove business)
```

---

### 8.3 Test Dependencies
```
admin.service.spec.ts:
  - Lines 467, 470, 695, 699, 702, 709: Business role tests
  - Tests for: getAdminBusinesses, createAdminBusiness, changeUserRole('business')
  - ACTION: Remove or update tests

campaigns.controller.spec.ts:
  - Line 10: Business user mock
  - Tests for POST /campaigns (business creation)
  - ACTION: Remove tests for POST /campaigns endpoint

admin/campaign-admin.controller.spec.ts:
  - Tests for business operations
  - ACTION: Remove business-related test cases

files.controller.spec.ts:
  - Tests for uploadFile, deleteFile
  - ACTION: Delete entire file OR remove test cases if keeping file service
```

---

## 📋 MIGRATION PATH & IMPLEMENTATION ORDER

### **Phase 1: Code Removal (No Database Changes Yet)**
1. Delete DTO files (create-campaign.dto.ts, create-admin-business.dto.ts, create-business-category.dto.ts)
2. Remove methods from controllers (campaigns.controller.ts POST, deaths.controller.ts POST, files.controller.ts)
3. Remove methods from services (campaigns.service.ts, admin.service.ts, files.service.ts)
4. Remove entity files (business.entity.ts, business-category.entity.ts)
5. Update module files (campaigns.module.ts, admin.module.ts, app.module.ts)
6. Remove UserRole.BUSINESS from enum
7. Update test files (remove business role tests, remove business endpoint tests)

### **Phase 2: Database Schema**
8. Create new migration to:
   - Drop tables: campaign_code_views, campaign_images, campaigns, businesses, business_categories
   - Update enum: Remove 'business' from users_role_enum
   - Update default: users.notification_preferences (remove 'campaigns')
9. Run migration in development database
10. Test database integrity

### **Phase 3: Documentation**
11. Update API documentation (remove campaign creation endpoints, file upload endpoints)
12. Update database schema documentation
13. Update ERD diagram
14. Update CLAUDE.md to reflect 16 modules (remove campaigns as public module)

### **Phase 4: Testing**
15. Run full test suite: `npm test`
16. Fix any remaining test failures
17. Update test coverage reports in MEMORY_BANK
18. Manual API testing with Postman/Insomnia

### **Phase 5: Cleanup**
19. Remove orphaned dependencies
20. Clean up imports across codebase
21. Final code review

---

## 📝 DETAILED FILE DELETION CHECKLIST

### Files to DELETE:
```
🗑️ DELETE COMPLETELY:
✓ /backend/src/campaigns/dto/create-campaign.dto.ts
✓ /backend/src/database/entities/business.entity.ts
✓ /backend/src/database/entities/business-category.entity.ts
✓ /backend/src/admin/dto/create-admin-business.dto.ts
✓ /backend/src/admin/dto/create-business-category.dto.ts
✓ /backend/src/files/files.controller.ts (if no internal use)
✓ /backend/src/files/files.service.ts (if no internal use)
✓ /backend/src/files/dto/upload-file.dto.ts
✓ /backend/src/files/files.controller.spec.ts (if removing controller)
```

### Files to MODIFY:
```
📝 MODIFY FILES:
✓ /backend/src/common/enums/user-role.enum.ts (remove BUSINESS)
✓ /backend/src/campaigns/campaigns.controller.ts (remove POST endpoint)
✓ /backend/src/campaigns/campaigns.service.ts (remove create method)
✓ /backend/src/campaigns/campaigns.module.ts (remove Business from imports)
✓ /backend/src/deaths/deaths.controller.ts (remove POST endpoint)
✓ /backend/src/deaths/deaths.service.ts (make create admin-only or remove)
✓ /backend/src/admin/campaign-admin.controller.ts (remove business endpoints)
✓ /backend/src/admin/admin.service.ts (remove business methods and repositories)
✓ /backend/src/admin/admin.module.ts (remove Business/BusinessCategory imports)
✓ /backend/src/database/migrations/1771619909777-InitialSchema.ts (remove business/campaign tables, update enum)
✓ /backend/src/files/files.service.spec.ts (remove upload/delete tests)
✓ /backend/src/admin/admin.service.spec.ts (remove business role tests)
✓ /backend/src/campaigns/campaigns.controller.spec.ts (remove POST tests)
✓ /backend/src/campaigns/campaigns.service.spec.ts (remove create tests)
✓ /backend/src/admin/campaign-admin.controller.spec.ts (remove business tests)
✓ /backend/src/app.module.ts (keep CampaignsModule if keeping public browsing)
✓ /docs/04_API_ENDPOINTS_MASTER.md (remove campaign creation, file upload docs)
✓ /docs/01_DATABASE_SCHEMA_FULL.sql (remove business/campaign tables)
✓ /docs/02_ERD_DIAGRAM.md (remove business/campaign entities)
✓ CLAUDE.md (update module count 17→16)
```

### Files to KEEP UNCHANGED:
```
✅ KEEP:
✓ /backend/src/database/entities/campaign.entity.ts (keep but remove business creation dependency)
✓ /backend/src/database/entities/file.entity.ts (needed for images)
✓ /backend/src/campaigns/campaigns.service.ts (keep findAll, findOne, viewCode)
✓ /backend/src/campaigns/campaigns.controller.ts (keep GET methods)
✓ /backend/src/deaths/deaths.service.ts (keep findAll, findOne - restrict in controller)
✓ /backend/src/deaths/deaths.controller.ts (keep GET methods, admin approve/reject)
✓ /backend/src/admin/admin.service.ts (keep campaign admin methods)
✓ /backend/src/admin/campaign-admin.controller.ts (keep campaign CRUD)
```

---

## ⚠️ CRITICAL NOTES

1. **Data Loss:** Deleting business/campaign tables will lose historical campaign data. Consider data export/archival.

2. **Migration Safety:** Create NEW migration file instead of modifying existing schema migration.

3. **Enum Type Updating:** PostgreSQL enum updates require careful handling:
   - Create new type with correct values
   - Cast existing column
   - Drop old type
   - Rename new type

4. **Cascading Deletes:** All campaign data will cascade-delete when businesses are deleted due to FK constraints.

5. **File Records:** File entity records for business logos/campaign images will become orphaned but won't break referential integrity.

6. **Test Coverage:** Removing these features will decrease overall test coverage. Plan to add other module tests to maintain coverage goals.

7. **API Stability:** Removing public campaign creation doesn't affect campaign browsing. Users can still view campaigns.

---

## 🔄 IMPLEMENTATION DEPENDENCIES

### Must Delete Before:
```
1. delete campaign_code_views table
   - Depends on campaigns.id (FK)
   - Depends on users.id (FK)

2. delete campaign_images table
   - Depends on campaigns.id (FK)
   - Depends on files.id (FK)

3. delete campaigns table
   - Depends on businesses.id (FK)
   - Depends on files.id (FK for cover_image)
   - Depends on users.id (FK for approved_by)

4. delete businesses table
   - Depends on users.id (FK)
   - Depends on business_categories.id (FK for category_id)
   - Depends on files.id (FK for logo)

5. delete business_categories table
   - Self-references via parent_id
   - Delete children before parents
```

### Verification Commands:
```bash
# Verify no BUSINESS role users exist
SELECT COUNT(*) FROM users WHERE role = 'business';

# Verify campaigns will be deleted with business cascade
SELECT COUNT(*) FROM campaigns WHERE business_id IN (SELECT id FROM businesses);

# Check orphaned files after business deletion
SELECT COUNT(*) FROM files WHERE id NOT IN (
  SELECT cover_image_id FROM campaigns WHERE cover_image_id IS NOT NULL
  UNION
  SELECT file_id FROM campaign_images
  UNION
  SELECT logo_file_id FROM businesses WHERE logo_file_id IS NOT NULL
  UNION
  SELECT cover_image_id FROM events WHERE cover_image_id IS NOT NULL
  UNION
  SELECT file_id FROM event_images
  UNION
  SELECT cover_image_id FROM places WHERE cover_image_id IS NOT NULL
  UNION
  SELECT file_id FROM place_images
);
```

---

## 📊 Summary Statistics

**Total Files to Delete:** 8
**Total Files to Modify:** 21
**Total Lines of Code to Remove:** ~500+ lines
**Database Tables to Drop:** 5
**Database Columns to Remove:** 1 enum value
**API Endpoints to Remove:** 5
**Service Methods to Remove:** 9
**Test Cases to Remove/Update:** ~50+

---

**Document Generated:** 26 February 2026
**Status:** Ready for Implementation
**Reviewer Needed:** ✓ Yes, before executing Phase 1
