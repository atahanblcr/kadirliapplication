# SKILL: Testing Strategy

**Amaç:** Kapsamlı ve maintainable testler yazma

---

## 🎯 Test Piramidi

```
     E2E Tests (10%)
   ─────────────────
  Integration (30%)
 ────────────────────
   Unit Tests (60%)
```

---

## ✅ Unit Test Örneği

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(() => {
    redisService = {
      get: jest.fn(),
      set: jest.fn(),
      incr: jest.fn(),
    } as any;

    service = new AuthService(redisService);
  });

  describe('requestOTP', () => {
    it('should send OTP to valid phone', async () => {
      const phone = '05331234567';
      redisService.incr.mockResolvedValue(1);

      const result = await service.requestOTP(phone);

      expect(result.success).toBe(true);
      expect(result.expires_in).toBe(300);
      expect(redisService.set).toHaveBeenCalledWith(
        `otp:${phone}`,
        expect.any(String),
        300,
      );
    });

    it('should enforce rate limiting (10 OTP/hour)', async () => {
      const phone = '05331234567';
      redisService.incr.mockResolvedValue(11); // 11th request

      await expect(service.requestOTP(phone)).rejects.toThrow(
        'Too many requests',
      );
    });
  });
});
```

---

## 🔗 Integration Test Örneği

```typescript
// ads.e2e-spec.ts
describe('Ads API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/verify-otp')
      .send({ phone: '05331234567', otp: '123456' });

    authToken = loginRes.body.data.access_token;
  });

  describe('POST /ads', () => {
    it('should create ad with 7-day expiration', () => {
      return request(app.getHttpServer())
        .post('/ads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category_id: 'phone-uuid',
          title: 'iPhone 13',
          description: 'Test',
          price: 35000,
        })
        .expect(201)
        .expect((res) => {
          const expiresAt = new Date(res.body.data.ad.expires_at);
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() + 7);

          expect(expiresAt).toBeCloseTo(expectedDate.getTime(), -100000);
        });
    });
  });
});
```

---

## 🎪 Test Coverage Hedefi

```bash
# Run tests with coverage
npm run test:cov

# Target:
Statements   : 80% ( 450/562 )
Branches     : 75% ( 120/160 )
Functions    : 80% ( 90/112  )
Lines        : 80% ( 425/531 )
```

---

**KULLAN:** Test yazmadan önce bu skill'i oku!
