# KadirliApp - Complete Test Scenarios

**Version:** 1.0  
**Date:** 16 Şubat 2026  
**Testing Framework:** Jest + Supertest + Cypress

---

## 📋 Table of Contents

1. [Test Strategy Overview](#test-strategy-overview)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Load Tests](#load-tests)
6. [Security Tests](#security-tests)
7. [Test Data](#test-data)
8. [CI/CD Integration](#cicd-integration)

---

## Test Strategy Overview

### Testing Pyramid

```
              ┌───────────┐
              │    E2E    │  10% (Slow, Expensive)
              │  Tests    │
            ┌─┴───────────┴─┐
            │  Integration  │  30% (Medium Speed)
            │     Tests     │
          ┌─┴───────────────┴─┐
          │    Unit Tests     │  60% (Fast, Cheap)
          └───────────────────┘
```

### Test Coverage Goals

| Type | Target Coverage |
|------|----------------|
| **Unit Tests** | 80%+ |
| **Integration Tests** | 70%+ |
| **E2E Tests** | Critical paths only |
| **Overall** | 75%+ |

---

## Unit Tests

### 1. Authentication Service

**File:** `src/auth/auth.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByPhone: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('requestOTP', () => {
    it('should send OTP to valid phone number', async () => {
      const phone = '05331234567';
      const result = await service.requestOTP(phone);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('expires_in', 300);
    });

    it('should reject invalid phone format', async () => {
      const phone = '123456';

      await expect(service.requestOTP(phone)).rejects.toThrow();
    });

    it('should enforce rate limiting (10 OTP/hour)', async () => {
      const phone = '05331234567';

      // Send 10 OTPs
      for (let i = 0; i < 10; i++) {
        await service.requestOTP(phone);
      }

      // 11th should fail
      await expect(service.requestOTP(phone)).rejects.toThrow('Too many requests');
    });
  });

  describe('verifyOTP', () => {
    it('should return tokens for valid OTP', async () => {
      const phone = '05331234567';
      const otp = '123456';

      jest.spyOn(usersService, 'findByPhone').mockResolvedValue({
        id: 'uuid',
        phone,
        username: 'test',
        role: 'user',
      } as any);

      jest.spyOn(jwtService, 'sign').mockReturnValue('mock_token');

      const result = await service.verifyOTP(phone, otp);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('should reject invalid OTP', async () => {
      const phone = '05331234567';
      const otp = '000000';

      await expect(service.verifyOTP(phone, otp)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject expired OTP', async () => {
      const phone = '05331234567';
      const otp = '123456';

      // Wait 6 minutes (OTP expires in 5 minutes)
      jest.useFakeTimers();
      await service.requestOTP(phone);
      jest.advanceTimersByTime(6 * 60 * 1000);

      await expect(service.verifyOTP(phone, otp)).rejects.toThrow('OTP expired');

      jest.useRealTimers();
    });
  });

  describe('registration', () => {
    it('should create new user with valid data', async () => {
      const data = {
        username: 'ahmet123',
        age: 25,
        location_type: 'neighborhood',
        primary_neighborhood_id: 'uuid',
        accept_terms: true,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue({
        id: 'uuid',
        ...data,
      } as any);

      const result = await service.register(data);

      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('ahmet123');
    });

    it('should reject username shorter than 3 chars', async () => {
      const data = {
        username: 'ab',
        age: 25,
        location_type: 'neighborhood',
        primary_neighborhood_id: 'uuid',
        accept_terms: true,
      };

      await expect(service.register(data)).rejects.toThrow('Username must be at least 3 characters');
    });

    it('should reject age below 13', async () => {
      const data = {
        username: 'ahmet123',
        age: 12,
        location_type: 'neighborhood',
        primary_neighborhood_id: 'uuid',
        accept_terms: true,
      };

      await expect(service.register(data)).rejects.toThrow('Minimum age is 13');
    });

    it('should reject if terms not accepted', async () => {
      const data = {
        username: 'ahmet123',
        age: 25,
        location_type: 'neighborhood',
        primary_neighborhood_id: 'uuid',
        accept_terms: false,
      };

      await expect(service.register(data)).rejects.toThrow('Terms must be accepted');
    });
  });
});
```

### 2. Announcements Service

**File:** `src/announcements/announcements.service.spec.ts`

```typescript
describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let repository: Repository<Announcement>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
    repository = module.get<Repository<Announcement>>(getRepositoryToken(Announcement));
  });

  describe('create', () => {
    it('should create announcement with manual source as priority', async () => {
      const data = {
        type_id: 'uuid',
        title: 'Test',
        body: 'Test',
        source: 'manual',
        status: 'draft',
      };

      jest.spyOn(repository, 'save').mockResolvedValue({ id: 'uuid', ...data } as any);

      const result = await service.create(data);

      expect(result.status).toBe('published'); // Manual → auto publish
    });

    it('should create scraping announcement as draft', async () => {
      const data = {
        type_id: 'uuid',
        title: 'Test',
        body: 'Test',
        source: 'scraping',
      };

      const result = await service.create(data);

      expect(result.status).toBe('draft'); // Scraping → needs approval
    });

    it('should enforce title max length (200 chars)', async () => {
      const longTitle = 'a'.repeat(201);
      const data = {
        type_id: 'uuid',
        title: longTitle,
        body: 'Test',
      };

      await expect(service.create(data)).rejects.toThrow('Title too long');
    });
  });

  describe('targeting', () => {
    it('should calculate correct recipients for "all"', async () => {
      const announcement = {
        target_type: 'all',
      };

      const count = await service.calculateRecipients(announcement);

      expect(count).toBeGreaterThan(0);
    });

    it('should calculate correct recipients for neighborhoods', async () => {
      const announcement = {
        target_type: 'neighborhoods',
        target_neighborhoods: ['merkez', 'akdam'],
      };

      const count = await service.calculateRecipients(announcement);

      expect(count).toBeGreaterThan(0);
    });

    it('should filter inactive users', async () => {
      // Create announcement
      // Count should only include active users
    });
  });

  describe('scheduling', () => {
    it('should schedule announcement for future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const data = {
        type_id: 'uuid',
        title: 'Test',
        body: 'Test',
        scheduled_for: futureDate,
      };

      const result = await service.create(data);

      expect(result.scheduled_for).toEqual(futureDate);
      expect(result.sent_at).toBeNull();
    });

    it('should enforce max scheduling (1 year)', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);

      const data = {
        type_id: 'uuid',
        title: 'Test',
        body: 'Test',
        scheduled_for: futureDate,
      };

      await expect(service.create(data)).rejects.toThrow('Max scheduling is 1 year');
    });
  });
});
```

### 3. Ads Service

```typescript
describe('AdsService', () => {
  describe('create', () => {
    it('should create ad with 7-day expiration', async () => {
      const data = {
        category_id: 'uuid',
        title: 'iPhone 13',
        description: 'Test',
        price: 35000,
      };

      const result = await service.create(data);

      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + 7);

      expect(result.expires_at).toBeCloseTo(expectedExpiry.getTime(), -100000);
      expect(result.status).toBe('pending');
      expect(result.extension_count).toBe(0);
    });

    it('should enforce daily limit (10 ads/day)', async () => {
      const userId = 'uuid';

      // Create 10 ads
      for (let i = 0; i < 10; i++) {
        await service.create({ /* data */ }, userId);
      }

      // 11th should fail
      await expect(service.create({ /* data */ }, userId)).rejects.toThrow('Daily limit reached');
    });

    it('should validate required properties', async () => {
      // Category has required properties: Marka, Model
      const data = {
        category_id: 'phone-category-uuid',
        title: 'iPhone',
        description: 'Test',
        price: 35000,
        properties: [], // Missing required properties
      };

      await expect(service.create(data)).rejects.toThrow('Required property missing: Marka');
    });
  });

  describe('extend', () => {
    it('should extend ad by 3 days for 3 ads watched', async () => {
      const ad = await service.findOne('uuid');
      const originalExpiry = ad.expires_at;

      await service.extend(ad.id, { ads_watched: 3 });

      const updatedAd = await service.findOne('uuid');
      const expectedExpiry = new Date(originalExpiry);
      expectedExpiry.setDate(expectedExpiry.getDate() + 3);

      expect(updatedAd.expires_at).toBeCloseTo(expectedExpiry.getTime(), -1000);
      expect(updatedAd.extension_count).toBe(1);
    });

    it('should enforce max extensions (3)', async () => {
      const ad = { extension_count: 3 };

      await expect(service.extend(ad.id, { ads_watched: 3 })).rejects.toThrow('Max extensions reached');
    });
  });

  describe('moderation', () => {
    it('should approve ad', async () => {
      const ad = await service.findOne('uuid');
      const adminId = 'admin-uuid';

      await service.approve(ad.id, adminId);

      const updated = await service.findOne('uuid');
      expect(updated.status).toBe('approved');
      expect(updated.approved_by).toBe(adminId);
      expect(updated.approved_at).toBeDefined();
    });

    it('should reject ad with reason', async () => {
      const ad = await service.findOne('uuid');
      const reason = 'Müstehcen içerik';

      await service.reject(ad.id, reason);

      const updated = await service.findOne('uuid');
      expect(updated.status).toBe('rejected');
      expect(updated.rejected_reason).toBe(reason);
    });
  });
});
```

---

## Integration Tests

### 1. Authentication Flow

**File:** `test/auth.e2e-spec.ts`

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/request-otp (POST)', () => {
    it('should send OTP to valid phone', () => {
      return request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone: '05331234567' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('expires_in', 300);
        });
    });

    it('should reject invalid phone format', () => {
      return request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone: '123' })
        .expect(400);
    });

    it('should enforce rate limiting', async () => {
      const phone = '05331234567';

      // Send 10 requests
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/auth/request-otp')
          .send({ phone });
      }

      // 11th should fail with 429
      return request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone })
        .expect(429);
    });
  });

  describe('/auth/verify-otp (POST)', () => {
    it('should return tokens for valid OTP', async () => {
      const phone = '05331234567';
      
      // Request OTP
      await request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone });

      // Verify (use test OTP: 123456)
      return request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone, otp: '123456' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          expect(res.body.data).toHaveProperty('refresh_token');
          expect(res.body.data).toHaveProperty('user');
        });
    });

    it('should return is_new_user flag', async () => {
      const phone = '05339999999'; // New user

      await request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone });

      return request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone, otp: '123456' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.is_new_user).toBe(true);
          expect(res.body.data).toHaveProperty('temp_token');
        });
    });
  });

  describe('Full registration flow', () => {
    it('should complete new user registration', async () => {
      const phone = '05338888888';

      // 1. Request OTP
      await request(app.getHttpServer())
        .post('/auth/request-otp')
        .send({ phone })
        .expect(200);

      // 2. Verify OTP
      const verifyRes = await request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone, otp: '123456' })
        .expect(200);

      const tempToken = verifyRes.body.data.temp_token;

      // 3. Complete registration
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({
          username: 'test_user',
          age: 25,
          location_type: 'neighborhood',
          primary_neighborhood_id: 'uuid',
          accept_terms: true,
          marketing_consent: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('access_token');
          expect(res.body.data.user.username).toBe('test_user');
        });
    });
  });
});
```

### 2. Announcements API

```typescript
describe('Announcements API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Setup app
    // Login as admin
    const loginRes = await request(app.getHttpServer())
      .post('/auth/verify-otp')
      .send({ phone: '05331111111', otp: '123456' });
    
    authToken = loginRes.body.data.access_token;
  });

  describe('GET /announcements', () => {
    it('should return announcements list', () => {
      return request(app.getHttpServer())
        .get('/announcements')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('announcements');
          expect(Array.isArray(res.body.data.announcements)).toBe(true);
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('total');
        });
    });

    it('should filter by type', () => {
      return request(app.getHttpServer())
        .get('/announcements?type_id=power-outage-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const announcements = res.body.data.announcements;
          announcements.forEach(a => {
            expect(a.type.id).toBe('power-outage-uuid');
          });
        });
    });

    it('should filter by neighborhood', () => {
      return request(app.getHttpServer())
        .get('/announcements?neighborhood=merkez')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/announcements?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(2);
          expect(res.body.meta.limit).toBe(10);
        });
    });
  });

  describe('POST /announcements (Admin)', () => {
    it('should create announcement', () => {
      return request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type_id: 'power-outage-uuid',
          title: 'Test Announcement',
          body: 'Test body',
          priority: 'high',
          target_type: 'all',
          send_push_notification: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.announcement).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('estimated_recipients');
        });
    });

    it('should reject unauthorized user', () => {
      // Login as regular user
      // Try to create announcement
      // Expect 403
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
          title: 'Test',
        })
        .expect(400);
    });
  });

  describe('POST /announcements/:id/send (Admin)', () => {
    it('should send announcement immediately', async () => {
      // Create announcement
      const createRes = await request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type_id: 'uuid',
          title: 'Test',
          body: 'Test',
          priority: 'normal',
          target_type: 'all',
        });

      const announcementId = createRes.body.data.announcement.id;

      // Send
      return request(app.getHttpServer())
        .post(`/announcements/${announcementId}/send`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('job_id');
        });
    });
  });
});
```

### 3. Ads API

```typescript
describe('Ads API (e2e)', () => {
  describe('GET /ads', () => {
    it('should return public ads list', () => {
      return request(app.getHttpServer())
        .get('/ads')
        .expect(200)
        .expect((res) => {
          const ads = res.body.data.ads;
          expect(Array.isArray(ads)).toBe(true);
          
          // All ads should be approved and not expired
          ads.forEach(ad => {
            expect(ad.status).toBe('approved');
            expect(new Date(ad.expires_at) > new Date()).toBe(true);
          });
        });
    });

    it('should filter by category', () => {
      return request(app.getHttpServer())
        .get('/ads?category_id=phone-uuid')
        .expect(200);
    });

    it('should filter by price range', () => {
      return request(app.getHttpServer())
        .get('/ads?min_price=1000&max_price=50000')
        .expect(200)
        .expect((res) => {
          const ads = res.body.data.ads;
          ads.forEach(ad => {
            expect(ad.price).toBeGreaterThanOrEqual(1000);
            expect(ad.price).toBeLessThanOrEqual(50000);
          });
        });
    });

    it('should support full-text search', () => {
      return request(app.getHttpServer())
        .get('/ads?search=iphone 13')
        .expect(200);
    });
  });

  describe('POST /ads', () => {
    it('should create ad with valid data', () => {
      return request(app.getHttpServer())
        .post('/ads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          category_id: 'phone-uuid',
          title: 'iPhone 13 Pro Max',
          description: 'Tertemiz',
          price: 35000,
          contact_phone: '05331234567',
          properties: [
            { property_id: 'marka-uuid', value: 'Apple' },
            { property_id: 'model-uuid', value: 'iPhone 13 Pro Max' },
          ],
          image_ids: ['img1-uuid', 'img2-uuid'],
          cover_image_id: 'img1-uuid',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.ad.status).toBe('pending');
          expect(res.body.data.ad.expires_at).toBeDefined();
        });
    });

    it('should enforce daily limit', async () => {
      // Create 10 ads
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/ads')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ /* valid data */ });
      }

      // 11th should fail
      return request(app.getHttpServer())
        .post('/ads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ /* valid data */ })
        .expect(429);
    });

    it('should validate image limit', () => {
      const imageIds = Array(6).fill('uuid'); // 6 images

      return request(app.getHttpServer())
        .post('/ads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          category_id: 'phone-uuid',
          title: 'Test',
          description: 'Test',
          price: 1000,
          image_ids: imageIds, // Exceeds limit (5)
        })
        .expect(400);
    });
  });

  describe('POST /ads/:id/extend', () => {
    it('should extend ad for 3 days after watching 3 ads', async () => {
      // Create ad
      const createRes = await request(app.getHttpServer())
        .post('/ads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ /* data */ });

      const adId = createRes.body.data.ad.id;
      const originalExpiry = new Date(createRes.body.data.ad.expires_at);

      // Wait 6 days (ad almost expiring)
      // ...

      // Extend
      const extendRes = await request(app.getHttpServer())
        .post(`/ads/${adId}/extend`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ads_watched: 3 })
        .expect(200);

      const newExpiry = new Date(extendRes.body.data.ad.expires_at);
      const diffDays = (newExpiry - originalExpiry) / (1000 * 60 * 60 * 24);

      expect(diffDays).toBeCloseTo(3, 0);
    });

    it('should enforce max extensions', async () => {
      // Create ad
      // Extend 3 times
      // 4th extension should fail
    });
  });
});
```

---

## E2E Tests (Cypress)

### 1. User Registration Flow

**File:** `cypress/e2e/registration.cy.ts`

```typescript
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full registration flow', () => {
    // Step 1: Enter phone number
    cy.get('[data-testid="phone-input"]').type('05331234567');
    cy.get('[data-testid="request-otp-btn"]').click();

    // Step 2: Wait for OTP screen
    cy.get('[data-testid="otp-input"]').should('be.visible');
    cy.get('[data-testid="otp-input"]').type('123456');
    cy.get('[data-testid="verify-otp-btn"]').click();

    // Step 3: Fill registration form
    cy.get('[data-testid="username-input"]').type('test_user');
    cy.get('[data-testid="age-input"]').type('25');
    cy.get('[data-testid="location-type-neighborhood"]').click();
    cy.get('[data-testid="neighborhood-select"]').select('Merkez Mahallesi');
    cy.get('[data-testid="accept-terms"]').check();
    cy.get('[data-testid="register-btn"]').click();

    // Step 4: Verify redirect to home
    cy.url().should('include', '/home');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Hoş geldiniz');
  });

  it('should show error for invalid phone', () => {
    cy.get('[data-testid="phone-input"]').type('123');
    cy.get('[data-testid="request-otp-btn"]').click();
    
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Geçersiz telefon');
  });

  it('should enforce username minimum length', () => {
    // ... navigate to registration screen
    cy.get('[data-testid="username-input"]').type('ab'); // Too short
    cy.get('[data-testid="register-btn"]').click();
    
    cy.get('[data-testid="username-error"]').should('contain', 'en az 3 karakter');
  });
});
```

### 2. Creating an Ad

```typescript
describe('Create Ad', () => {
  beforeEach(() => {
    // Login
    cy.login('05331234567', '123456');
    cy.visit('/ads/create');
  });

  it('should create ad successfully', () => {
    // Step 1: Select category
    cy.get('[data-testid="category-elektronik"]').click();
    cy.get('[data-testid="category-telefon"]').click();

    // Step 2: Fill form
    cy.get('[data-testid="title-input"]').type('iPhone 13 Pro Max 256GB');
    cy.get('[data-testid="description-input"]').type('Tertemiz, hiç çizmesi yok');
    cy.get('[data-testid="price-input"]').type('35000');

    // Step 3: Fill properties
    cy.get('[data-testid="prop-marka"]').select('Apple');
    cy.get('[data-testid="prop-model"]').type('iPhone 13 Pro Max');
    cy.get('[data-testid="prop-hafiza"]').select('256 GB');

    // Step 4: Upload images
    cy.get('[data-testid="image-upload"]').attachFile('iphone1.jpg');
    cy.get('[data-testid="image-upload"]').attachFile('iphone2.jpg');

    // Step 5: Submit
    cy.get('[data-testid="submit-btn"]').click();

    // Step 6: Verify success
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('contain', 'İlanınız incelemeye alındı');
  });

  it('should enforce image limit', () => {
    // Upload 6 images (limit is 5)
    for (let i = 1; i <= 6; i++) {
      cy.get('[data-testid="image-upload"]').attachFile(`image${i}.jpg`);
    }

    cy.get('[data-testid="error-message"]').should('contain', 'Maksimum 5 fotoğraf');
  });
});
```

### 3. Admin Moderation

```typescript
describe('Admin - Ad Moderation', () => {
  beforeEach(() => {
    // Login as admin
    cy.login('admin@kadirliapp.com', 'admin123');
    cy.visit('/admin/ads');
  });

  it('should approve pending ad', () => {
    // Click on first pending ad
    cy.get('[data-testid="pending-ad"]').first().click();

    // View details
    cy.get('[data-testid="ad-detail-modal"]').should('be.visible');
    
    // Approve
    cy.get('[data-testid="approve-btn"]').click();
    
    // Confirm
    cy.get('[data-testid="confirm-approve"]').click();

    // Verify success
    cy.get('[data-testid="toast-success"]').should('contain', 'İlan onaylandı');
    
    // Ad should disappear from pending list
    cy.get('[data-testid="pending-ad"]').should('have.length.lessThan', 1);
  });

  it('should reject ad with reason', () => {
    cy.get('[data-testid="pending-ad"]').first().click();
    cy.get('[data-testid="reject-btn"]').click();
    
    // Select reason
    cy.get('[data-testid="reject-reason"]').select('Müstehcen içerik');
    
    // Confirm
    cy.get('[data-testid="confirm-reject"]').click();
    
    cy.get('[data-testid="toast-success"]').should('contain', 'İlan reddedildi');
  });
});
```

---

## Load Tests

### 1. Artillery Configuration

**File:** `load-tests/artillery.yml`

```yaml
config:
  target: "https://api.kadirliapp.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  plugins:
    expect: {}
  ensure:
    maxErrorRate: 1
    p99: 2000  # 99th percentile response time under 2s

scenarios:
  - name: "User browsing flow"
    flow:
      - get:
          url: "/announcements"
          expect:
            - statusCode: 200
            - contentType: json
      - think: 2
      - get:
          url: "/ads?page=1&limit=20"
          expect:
            - statusCode: 200
      - think: 3
      - get:
          url: "/ads/{{ $randomString() }}"
          expect:
            - statusCode: [200, 404]
      
  - name: "Create ad flow"
    weight: 2
    flow:
      - post:
          url: "/auth/request-otp"
          json:
            phone: "053312345{{ $randomNumber(10, 99) }}"
      - think: 30
      - post:
          url: "/auth/verify-otp"
          json:
            phone: "053312345{{ $randomNumber(10, 99) }}"
            otp: "123456"
          capture:
            - json: "$.data.access_token"
              as: "token"
      - post:
          url: "/ads"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            category_id: "uuid"
            title: "Test Ad {{ $randomString() }}"
            description: "Test description"
            price: "{{ $randomNumber(1000, 50000) }}"
          expect:
            - statusCode: 201
```

**Run Load Test:**
```bash
# Install Artillery
npm install -g artillery

# Run test
artillery run load-tests/artillery.yml

# Generate report
artillery run load-tests/artillery.yml --output report.json
artillery report report.json
```

---

## Security Tests

### 1. OWASP ZAP Automated Scan

```bash
# Pull ZAP Docker image
docker pull owasp/zap2docker-stable

# Run baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://api.kadirliapp.com \
  -r zap-report.html

# Run full scan
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://api.kadirliapp.com \
  -r zap-full-report.html
```

### 2. SQL Injection Tests

```typescript
describe('SQL Injection Prevention', () => {
  it('should prevent SQL injection in search', () => {
    const maliciousQuery = "'; DROP TABLE users; --";

    return request(app.getHttpServer())
      .get(`/ads?search=${maliciousQuery}`)
      .expect(200); // Should not cause error
    
    // Verify users table still exists
    // ...
  });

  it('should sanitize user input', () => {
    const xssPayload = '<script>alert("XSS")</script>';

    return request(app.getHttpServer())
      .post('/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        type_id: 'uuid',
        title: xssPayload,
        body: 'Test',
      })
      .expect(201)
      .expect((res) => {
        // Title should be escaped
        expect(res.body.data.announcement.title).not.toContain('<script>');
      });
  });
});
```

### 3. Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  it('should enforce API rate limit (300 req/min)', async () => {
    const requests = [];

    // Send 300 requests
    for (let i = 0; i < 300; i++) {
      requests.push(
        request(app.getHttpServer())
          .get('/announcements')
          .set('Authorization', `Bearer ${authToken}`)
      );
    }

    const results = await Promise.all(requests);
    const successCount = results.filter(r => r.status === 200).length;

    expect(successCount).toBe(300);

    // 301st should fail with 429
    return request(app.getHttpServer())
      .get('/announcements')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(429);
  });
});
```

---

## Test Data

### 1. Seed Data for Tests

**File:** `test/seeds/users.seed.ts`

```typescript
export const testUsers = [
  {
    phone: '05331111111',
    username: 'admin',
    role: 'super_admin',
    primary_neighborhood_id: 'merkez-uuid',
  },
  {
    phone: '05331234567',
    username: 'test_user',
    role: 'user',
    primary_neighborhood_id: 'merkez-uuid',
  },
  {
    phone: '05332222222',
    username: 'business_owner',
    role: 'business',
    primary_neighborhood_id: 'akdam-uuid',
  },
];

export const seedUsers = async (repository) => {
  for (const user of testUsers) {
    await repository.save(user);
  }
};
```

### 2. Factories

**File:** `test/factories/ad.factory.ts`

```typescript
import { faker } from '@faker-js/faker';

export const adFactory = () => ({
  category_id: 'phone-uuid',
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 50000 }),
  contact_phone: '05331234567',
  user_id: 'test-user-uuid',
  status: 'pending',
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

export const createTestAds = async (count: number) => {
  const ads = [];
  for (let i = 0; i < count; i++) {
    ads.push(adFactory());
  }
  return ads;
};
```

---

## CI/CD Integration

### 1. GitHub Actions Workflow

**.github/workflows/test.yml:**
```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:cov
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: kadirliapp_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npm run migration:run
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/kadirliapp_test
      
      - name: Run integration tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/kadirliapp_test
          REDIS_URL: redis://localhost:6379
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 120
```

---

## Test Coverage Report

**package.json scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:load": "artillery run load-tests/artillery.yml"
  }
}
```

---

**TEST COMPLETE!** ✅

Run all tests:
```bash
npm run test           # Unit tests
npm run test:e2e       # Integration tests
npm run test:load      # Load tests
npx cypress run        # E2E tests
```
