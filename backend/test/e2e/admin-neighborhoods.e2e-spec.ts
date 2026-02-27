import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../helpers/app-factory';

describe('Admin Neighborhoods E2E Tests', () => {
  let app: INestApplication;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Get admin access token for protected endpoint tests
    const loginRes = await request(app.getHttpServer())
      .post('/v1/auth/admin/login')
      .send({
        email: 'admin@kadirliapp.com',
        password: 'Admin123a',
      });

    // Handle login response properly
    if (loginRes.body.success && loginRes.body.data?.access_token) {
      adminAccessToken = loginRes.body.data.access_token;
    } else {
      // If login fails, use a dummy token (tests will fail appropriately)
      adminAccessToken = 'invalid-token-for-testing';
      console.warn('[E2E] Admin login failed:', loginRes.body);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public Endpoint: GET /v1/admin/neighborhoods', () => {
    it('should retrieve neighborhoods without authentication (public endpoint)', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.neighborhoods)).toBe(true);
      expect(res.body.meta).toHaveProperty('timestamp');
      expect(res.body.meta).toHaveProperty('path');
    });

    it('should support search query parameter', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods?search=merkez')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.neighborhoods)).toBe(true);
      // Results should be filtered by search term
      res.body.data.neighborhoods.forEach((neighborhood: any) => {
        expect(
          neighborhood.name.toLowerCase().includes('merkez') ||
            neighborhood.search_text?.toLowerCase().includes('merkez'),
        ).toBe(true);
      });
    });

    it('should support pagination parameters', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods?page=1&limit=5&is_active=true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('neighborhoods');
      expect(Array.isArray(res.body.data.neighborhoods)).toBe(true);
      expect(res.body.data).toHaveProperty('meta');
      // Meta should contain pagination info
      if (res.body.data.meta) {
        expect(res.body.data.meta).toHaveProperty('total');
        expect(res.body.data.meta).toHaveProperty('page');
        expect(res.body.data.meta).toHaveProperty('limit');
      }
    });
  });

  describe('Protected Endpoint: GET /v1/admin/dashboard', () => {
    it('should return 401 when accessing dashboard without authentication', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/dashboard')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('should return 200 and dashboard data for authenticated admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data).toHaveProperty('charts');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('should return proper error for invalid/expired token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/dashboard')
        .set('Authorization', 'Bearer invalid-token-that-cannot-be-decoded')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('code');
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('Response Envelope Consistency', () => {
    it('successful public response should have correct envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods')
        .expect(200);

      // Verify envelope structure
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('timestamp');
      expect(res.body.meta).toHaveProperty('path', '/v1/admin/neighborhoods');
    });

    it('successful protected response should have correct envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('timestamp');
      expect(res.body.meta).toHaveProperty('path', '/v1/admin/dashboard');

      // Verify timestamp is valid ISO string
      const timestamp = new Date(res.body.meta.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });
});
