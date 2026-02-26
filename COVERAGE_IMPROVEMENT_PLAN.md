# Jest Coverage Improvement Plan - 75% Target

**Current State:** 65% statements, 55% branches, 66% lines
**Target:** 75% (Need +10% improvement)
**Focus:** High-branch-impact files (fastest path to coverage gains)
**Constraint:** No business logic refactoring

---

## 📊 Coverage Analysis

### Key Findings:

1. **6 Admin Service Files Missing Spec Files Entirely** ⭐ QUICK WIN
   - `transport-admin.service.ts` - 468 lines, 18 methods
   - `campaign-admin.service.ts` - 311 lines, 11 methods
   - `guide-admin.service.ts` - 314 lines, 9 methods
   - `places-admin.service.ts` - 325 lines, 12 methods
   - `event-admin.service.ts` - 260 lines, 7 methods
   - `users-admin.service.ts` - 130 lines, 5 methods

2. **Branch Coverage is Bottleneck** (55% vs 65% statements)
   - Branch testing creates ~10% gap to target
   - Conditional logic not tested (if/else chains)
   - Optional field handling (`?? null`, `?? true`)

3. **Top 3 High-Impact Files**
   - Combined: **1.7K lines, 38 methods, 386 branches**
   - These three alone could add ~8-10% to total branch coverage

---

## 🎯 Action Plan: 3-Phase Approach

### PHASE 1: Quick Wins (3-4 hours)
**Target:** +7-8% coverage (transport, campaign, guide)
**ROI:** Highest - Missing spec files mean 0→~85% per file

#### File #1: `transport-admin.service.ts` (HIGHEST IMPACT)
**Impact Score:** 1,251 | **18 Methods** | **171 Branches** | **Current:** 4% statements, 7% branches

**Critical Path Tests (Priority Order):**

1. **Intercity Routes - Happy Path** (5 tests)
   ```typescript
   - getAdminIntercityRoutes() - all filters (search, company_name, from_city, to_city, is_active)
   - getAdminIntercityRoute() - success + NotFoundException
   - createIntercityRoute() - with/without optional fields
   - updateIntercityRoute() - partial updates
   - deleteIntercityRoute() - success + NotFoundException
   ```
   **Branch Coverage:** Covers 25+ branches (if conditions, null checks)

2. **Intercity Schedule Operations** (3 tests)
   ```typescript
   - addIntercitySchedule() - success + route not found
   - updateIntercitySchedule() - with individual field updates
   - deleteIntercitySchedule() - success + not found
   ```
   **Branch Coverage:** Covers 12+ branches (optional fields)

3. **Intracity Routes - Complex Mapping** (4 tests)
   ```typescript
   - getAdminIntracityRoutes() - filters, pagination
   - getAdminIntracityRoute() - with stops, mapping validation
   - createIntracityRoute() - verify stops loaded correctly
   - updateIntracityRoute() - partial field updates
   ```
   **Branch Coverage:** Covers null coalescing (??), array mapping

4. **Intracity Stops & Reordering** (3 tests)
   ```typescript
   - addIntracityStop() - success + route not found
   - updateIntracityStop() - all optional fields
   - reorderIntracityStop() - order validation
   - deleteIntracityStop() - success + not found
   ```
   **Branch Coverage:** Covers ~20 branches (conditional updates)

5. **Private Helpers & Edge Cases** (2 tests)
   ```typescript
   - mapIntercitySchedule() - with array/string/empty days_of_week (3 code paths)
   - mapIntracityStop() - null handling (latitude, longitude, neighborhood)
   - getStopsWithNeighborhood() - query builder chain
   ```
   **Branch Coverage:** Covers 15+ type-checking branches

**Expected Result:**
- Statements: 4% → 85-90%
- Branches: 7% → 75-80%
- **Net gain to total coverage: ~4-5%**

---

#### File #2: `campaign-admin.service.ts`
**Impact Score:** 796 | **11 Methods** | **117 Branches** | **Current:** 8.7% statements, 12.8% branches

**Critical Path Tests (Priority Order):**

1. **Campaign CRUD Operations** (5 tests)
   ```typescript
   - getAdminCampaigns() - with filters (status, business_id, page, limit)
   - getAdminCampaignDetail() - success + NotFoundException
   - createAdminCampaign() - with image_ids, full flow
   - updateAdminCampaign() - partial updates, optional fields
   - deleteAdminCampaign() - soft delete validation
   ```
   **Branch Coverage:** Query builder filters (~15 branches)

2. **Approval Workflow (High Branch Count)** (3 tests)
   ```typescript
   - approveCampaign() - status validation, notification trigger
   - rejectCampaign() - with reason, rejection flow
   - Campaign status transitions (draft→approved, rejected→pending)
   ```
   **Branch Coverage:** Status checks, conditional notification logic (~20 branches)

3. **Business Category Operations** (2 tests)
   ```typescript
   - getAdminBusinesses() - list with category filter
   - createBusinessCategory() - simple CRUD
   ```
   **Branch Coverage:** Optional fields

4. **Business Management** (1 test)
   ```typescript
   - createAdminBusiness() - with category association
   ```

5. **Slug Generation & Uniqueness** (1 test)
   ```typescript
   - ensureUniqueSlug() - duplicate handling, retry logic
   - generateCampaignSlug() - mapping + slug generation
   ```
   **Branch Coverage:** While loop in uniqueness check (~5 branches)

**Expected Result:**
- Statements: 8.7% → 80-85%
- Branches: 12.8% → 70-75%
- **Net gain to total coverage: ~2.5-3%**

---

#### File #3: `guide-admin.service.ts`
**Impact Score:** 706 | **9 Methods** | **98 Branches** | **Current:** 7.9% statements, 6.1% branches

**Critical Path Tests (Priority Order):**

1. **Category Hierarchy Management** (4 tests)
   ```typescript
   - getGuideCategories() - all parents/children hierarchy
   - createGuideCategory() - with parent_id (validation for max 2 levels)
   - updateGuideCategory() - parent_id changes, hierarchy checks
   - deleteGuideCategory() - with children prevention
   ```
   **Branch Coverage:** Null checks for parent_id (~8 branches), hierarchy validation

2. **Guide Items CRUD** (4 tests)
   ```typescript
   - getGuideItems() - filters (search, category_id, is_active, page, limit)
   - createGuideItem() - with category association
   - updateGuideItem() - individual field updates
   - deleteGuideItem() - success + not found
   ```
   **Branch Coverage:** Query filters (~12 branches), optional fields

3. **Slug Generation (Unique Turkish Slugs)** (1 test)
   ```typescript
   - generateGuideSlug() - Turkish character handling
   - ensureUniqueSlug() - duplicate detection retry logic
   ```
   **Branch Coverage:** While loop, string transformations (~10 branches)

**Expected Result:**
- Statements: 7.9% → 75-80%
- Branches: 6.1% → 60-65%
- **Net gain to total coverage: ~2-2.5%**

---

### PHASE 2: Secondary High-Impact Files (2-3 hours)
**Target:** +1-2% additional coverage
**Priority:** places, event, users services

1. **places-admin.service.ts** (325 lines, 12 methods)
   - Image management (add, delete, reorder) - high branch count
   - Category management
   - Place CRUD with image relationships

2. **event-admin.service.ts** (260 lines, 7 methods)
   - Event categories
   - Event CRUD with slug generation
   - City scope filtering

3. **users-admin.service.ts** (130 lines, 5 methods)
   - User ban/unban logic
   - Role management
   - Quick wins for statement coverage

---

### PHASE 3: Controller Specs & Edge Cases (1-2 hours)
**Target:** +1-2% additional coverage
**Focus:** Controller integration + error scenarios

1. **Fix Controller Spec Gaps**
   - Admin controllers have 75% branch coverage (gaps in error paths)
   - Transport controller spec missing error scenarios
   - Test negative cases: not found, validation errors

2. **Global Error Handling**
   - Intercept NotFoundExceptions
   - Test BadRequestException scenarios
   - Turkish error message validation

---

## 📋 Estimated Coverage Gains

| Phase | Files | Effort | Expected Gain | Cumulative |
|-------|-------|--------|---------------|-----------|
| 1A | transport | 1.5h | +4-5% | 65% → 69-70% |
| 1B | campaign | 1h | +2.5-3% | 69-70% → 72-73% |
| 1C | guide | 1h | +2-2.5% | 72-73% → 74-75% |
| 2 | places/event/users | 2h | +1-2% | 74-75% → 75%+ |
| 3 | Controllers/Edge Cases | 1h | +0.5-1% | 75%+ |

**Total Effort:** 6-7 hours
**Total Expected Gain:** 10-11% → **Target 75% ✅**

---

## 🔧 Implementation Strategy

### Step 1: Create Spec Files (Use Template Below)
```typescript
// Pattern for all missing specs:
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { YourService } from './your.service';
import { YourEntity } from '../database/entities/your.entity';

describe('YourService', () => {
  let service: YourService;
  let repository: any;

  beforeEach(async () => {
    repository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        { provide: getRepositoryToken(YourEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests here following pattern in next section
});
```

### Step 2: Test Branch Coverage Gaps
Focus on:
- **Optional/conditional fields** (`??`, ternary operators)
- **Query builder filters** (if conditions in WHERE clauses)
- **Error paths** (NotFoundException, BadRequestException)
- **Null checks** (null coalescing, optional properties)
- **Array/type conversions** (string.split(), Number(), mapping)

### Step 3: Verify Coverage After Each Spec
```bash
# Test single file:
npm test -- --coverage transport-admin.service

# View detailed uncovered branches:
npm test -- --coverage --verbose
```

### Step 4: Commit in Batches
- Commit 1: transport-admin.service.spec.ts
- Commit 2: campaign-admin.service.spec.ts
- Commit 3: guide-admin.service.spec.ts
- Commit 4: places/event/users specs
- Commit 5: Controller edge cases

---

## ⚠️ Important Constraints

1. **DO NOT refactor business logic**
   - Write tests for existing code as-is
   - If logic seems odd, test the actual behavior
   - Example: `mappers` with null coalescing → test all paths

2. **DO NOT add new features**
   - Focus only on test coverage
   - Keep DTOs and entities unchanged
   - Only modify `.spec.ts` files

3. **DO focus on branch coverage** (biggest gap)
   - Each if/else branch needs a test
   - Ternary operators need both paths
   - Optional field handling critical

4. **Mock repositories properly**
   - Use chainable mock pattern
   - Set up return values for each scenario
   - Test both success and failure paths

---

## 🚀 Quick Start

### File 1: transport-admin.service.spec.ts
**Time Estimate:** 90 minutes

```typescript
describe('getAdminIntercityRoutes', () => {
  it('should return routes with pagination', async () => {
    const mockRoutes = [{ id: '1', company_name: 'Test' }];
    repository.getManyAndCount.mockResolvedValue([mockRoutes, 10]);

    const result = await service.getAdminIntercityRoutes({
      page: 1,
      limit: 20,
    });

    expect(result.routes).toHaveLength(1);
    expect(result.meta.page).toBe(1);
    expect(repository.createQueryBuilder).toHaveBeenCalled();
  });

  it('should filter by search term', async () => {
    repository.getManyAndCount.mockResolvedValue([[], 0]);

    await service.getAdminIntercityRoutes({ search: 'test', page: 1, limit: 20 });

    expect(repository.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('ILIKE'),
      expect.objectContaining({ search: '%test%' })
    );
  });

  it('should filter by is_active', async () => {
    repository.getManyAndCount.mockResolvedValue([[], 0]);

    await service.getAdminIntercityRoutes({ is_active: true, page: 1, limit: 20 });

    expect(repository.andWhere).toHaveBeenCalledWith(
      'r.is_active = :is_active',
      { is_active: true }
    );
  });

  // ... 15+ more test cases for error paths, edge cases
});
```

---

## 📈 Success Metrics

After implementing this plan, you should see:

```
BEFORE:
Statements: 65% | Branches: 55% | Lines: 66%

AFTER:
Statements: 75%+ | Branches: 70%+ | Lines: 76%+
✅ Goal: 75% Achieved
```

---

## 📚 Reference Files

- Coverage report: `/backend/coverage/coverage-final.json`
- Existing test pattern: `admin.service.spec.ts` (best practice reference)
- Transport routes: `create-intercity-route.dto.ts` (input validation)

---

**Created:** 27 Feb 2026
**Target Completion:** 1-2 days (6-7 hours of focused work)
**Priority:** HIGH (Coverage → Production Readiness)
