# Admin Panel Endpoint Issues - Detailed Analysis

## Quick Reference

| ID | Severity | Module | Issue | Status Code | Fix Effort |
|---|----------|--------|-------|-------------|-----------|
| #1 | 🟡 Medium | Users | Empty role parameter rejected | 400 | 5 min |
| #2 | 🟡 Medium | Neighborhoods | Empty type parameter rejected | 400 | 5 min |
| #3 | 🟡 Medium | Transport | Search parameter unsupported | 400 | 15 min |
| #4 | 🟡 Medium | Transport | Search parameter unsupported | 400 | 15 min |

---

## Issue #1: Users Filtering - Empty Role Parameter

### Details

**Endpoint:** `GET /admin/users?search=&role=&is_banned=&page=1&limit=10`
**HTTP Status:** 400 BAD REQUEST
**Error Message:** `role must be one of the following values: user, taxi_driver, business, moderator, admin, super_admin`

### Root Cause

The query DTO uses `@IsEnum()` validator which rejects empty strings for enum fields:

```typescript
// In query-users.dto.ts
export class QueryUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsEnum(UserRole)  // ❌ Rejects empty string
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_banned?: boolean;
}
```

### Expected Behavior

When no filter is specified, the query parameter should be omitted or the empty string should mean "no filter".

### Impact

- Frontend may pass `role=""` when no filter selected
- Request fails with 400 error
- User gets error message instead of unfiltered list

### Current Workaround

Frontend must check if filter value is empty before including in request URL:
```typescript
// Frontend should do this
const params = new URLSearchParams();
params.append('page', page);
params.append('limit', limit);
if (searchText) params.append('search', searchText);
if (role) params.append('role', role);  // Skip if empty
if (isBanned !== undefined) params.append('is_banned', isBanned);
```

### Fix Solution

**File:** `/backend/src/admin/dto/query-users.dto.ts`

```typescript
export class QueryUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;  // ✅ Now properly optional

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_banned?: boolean;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
```

### Files to Modify

1. `/backend/src/admin/dto/query-users.dto.ts` - Add `@IsOptional()` before `@IsEnum()`

### Testing After Fix

```bash
# Should work with empty role
curl "http://localhost:3000/v1/admin/users?search=&role=&is_banned=&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Response should be 200 with unfiltered users
```

---

## Issue #2: Neighborhoods Filtering - Empty Type Parameter

### Details

**Endpoint:** `GET /admin/neighborhoods?type=&is_active=&search=&page=1&limit=10`
**HTTP Status:** 400 BAD REQUEST
**Error Message:** `type must be one of the following values: neighborhood, village`

### Root Cause

Same as Issue #1 - the query DTO uses `@IsEnum()` validator without `@IsOptional()`:

```typescript
// In query-neighborhoods.dto.ts
export class QueryNeighborhoodsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsEnum(['neighborhood', 'village'])  // ❌ Rejects empty string
  type?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_active?: boolean;
}
```

### Expected Behavior

Empty type parameter should be ignored, returning all neighborhoods regardless of type.

### Impact

- Neighborhoods page fails to load when type filter not selected
- Admin cannot view all neighborhoods without specifying type

### Fix Solution

**File:** `/backend/src/admin/dto/query-neighborhoods.dto.ts`

```typescript
export class QueryNeighborhoodsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['neighborhood', 'village'])
  type?: string;  // ✅ Now properly optional

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_active?: boolean;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
```

### Files to Modify

1. `/backend/src/admin/dto/query-neighborhoods.dto.ts` - Add `@IsOptional()` before type enum

### Testing After Fix

```bash
curl "http://localhost:3000/v1/admin/neighborhoods?type=&is_active=&search=&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Response should be 200 with paginated neighborhoods
```

---

## Issue #3: Transport Intercity - Unsupported Search Parameter

### Details

**Endpoint:** `GET /admin/transport/intercity?search=test&page=1&limit=10`
**HTTP Status:** 400 BAD REQUEST
**Error Message:** `property search should not exist`

### Root Cause

The query DTO for intercity routes doesn't include a `search` field:

```typescript
// In query-intercity-routes.dto.ts
export class QueryIntercityRoutesDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  // ❌ No search field defined
}
```

### Expected Behavior

Either:
1. Support search functionality to filter routes by company name, cities, etc.
2. Document that search is not available and remove UI input

### Impact

- Admin cannot search for specific intercity routes
- Intercity routes page has search input that doesn't work
- Large route list cannot be filtered quickly

### Potential Solutions

**Option A: Add Search Support (Recommended)**

File: `/backend/src/admin/dto/query-intercity-routes.dto.ts`

```typescript
export class QueryIntercityRoutesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;  // Search by company name or cities

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
```

Then in service (`admin.service.ts`), update `getAdminIntercityRoutes()`:

```typescript
async getAdminIntercityRoutes(dto: QueryIntercityRoutesDto) {
  const query = this.intercityRouteRepository.createQueryBuilder('route');

  if (dto.search) {
    query.where(
      '(route.company_name ILIKE :search OR route.from_city ILIKE :search OR route.to_city ILIKE :search)',
      { search: `%${dto.search}%` }
    );
  }

  // ... rest of pagination
}
```

**Option B: Remove Search from Frontend**

Remove search input from `/admin/src/app/(dashboard)/transport/page.tsx` for intercity routes.

### Files to Modify (Option A)

1. `/backend/src/admin/dto/query-intercity-routes.dto.ts` - Add search field
2. `/backend/src/admin/admin.service.ts` - Update `getAdminIntercityRoutes()` method

### Testing After Fix

```bash
curl "http://localhost:3000/v1/admin/transport/intercity?search=metro&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Response should be 200 with filtered intercity routes
```

---

## Issue #4: Transport Intracity - Unsupported Search Parameter

### Details

**Endpoint:** `GET /admin/transport/intracity?search=test&page=1&limit=10`
**HTTP Status:** 400 BAD REQUEST
**Error Message:** `property search should not exist`

### Root Cause

Same as Issue #3 - the query DTO doesn't include a `search` field:

```typescript
// In query-intracity-routes.dto.ts
export class QueryIntracityRoutesDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  // ❌ No search field defined
}
```

### Expected Behavior

Either support search by route name/number or remove the UI input.

### Impact

- Admin cannot search for specific intracity routes
- Large route list cannot be filtered quickly

### Solutions

Same as Issue #3 - implement search or remove from UI.

### Files to Modify (Option A)

1. `/backend/src/admin/dto/query-intracity-routes.dto.ts` - Add search field
2. `/backend/src/admin/admin.service.ts` - Update `getAdminIntracityRoutes()` method

### Service Update Example

```typescript
async getAdminIntracityRoutes(dto: QueryIntracityRoutesDto) {
  const query = this.intracityRouteRepository.createQueryBuilder('route');

  if (dto.search) {
    query.where(
      '(route.name ILIKE :search OR route.line_number ILIKE :search)',
      { search: `%${dto.search}%` }
    );
  }

  // ... rest of pagination
}
```

### Testing After Fix

```bash
curl "http://localhost:3000/v1/admin/transport/intracity?search=line1&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Response should be 200 with filtered intracity routes
```

---

## Response Format Inconsistencies (Reference)

These are not errors but worth noting for standardization:

### Issue: Data Wrapper Names Vary

```json
// /admin/neighborhoods - single
{ "data": { "neighborhood": {...} } }

// /admin/neighborhoods - list
{ "data": { "neighborhoods": [...] } }

// /admin/campaigns - list
{ "data": { "campaigns": [...] } }

// /admin/deaths - list
{ "data": { "notices": [...] } }

// /admin/deaths/cemeteries - single
{ "data": { "cemetery": {...} } }
```

**Impact:** Low - Frontend already handles this

**Fix:** Create consistent wrapper or API response DTO pattern

---

## Fix Priority Matrix

| Issue | Complexity | Time | Frequency | Fix Now |
|-------|-----------|------|-----------|---------|
| #1 - Users role | Low | 5 min | Every time role filter used | ✅ Yes |
| #2 - Neighborhoods type | Low | 5 min | Every time type filter used | ✅ Yes |
| #3 - Intercity search | Medium | 20 min | Often (if feature used) | ⚠️ Depends |
| #4 - Intracity search | Medium | 20 min | Often (if feature used) | ⚠️ Depends |

---

## Testing Checklist

Before deployment, verify:

- [ ] Issue #1 fixed: `GET /admin/users?role=&page=1&limit=10` returns 200
- [ ] Issue #2 fixed: `GET /admin/neighborhoods?type=&page=1&limit=10` returns 200
- [ ] Issue #3 fixed (if implementing): `GET /admin/transport/intercity?search=test&page=1&limit=10` returns 200
- [ ] Issue #4 fixed (if implementing): `GET /admin/transport/intracity?search=test&page=1&limit=10` returns 200
- [ ] All other GET endpoints still return 200
- [ ] CRUD operations still work
- [ ] Pagination still works
- [ ] Frontend doesn't break
