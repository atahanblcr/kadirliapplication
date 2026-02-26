import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/app-factory';

describe('App Smoke Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Global Configuration', () => {
    it('should apply global prefix /v1', async () => {
      // Testing that the global prefix is applied by checking response shape
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods')
        .expect(200);

      // TransformInterceptor wraps response
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
    });

    it('should return 404 for unmapped route with correct error shape', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/nonexistent-route-that-does-not-exist')
        .expect(404);

      // HttpExceptionFilter wraps 404 errors
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('message');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('timestamp');
      expect(res.body.meta).toHaveProperty('path');
    });

    it('should validate request body with ValidationPipe', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          email: 'invalid-email', // Not a valid email
          password: 'test',
        })
        .expect(400);

      // ValidationPipe returns 400 with error details
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('should require fields defined in DTO', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          // Missing email and password
        })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('Public Endpoints', () => {
    it('GET /v1/admin/neighborhoods should be accessible without auth', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /v1/admin/neighborhoods should accept pagination params', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('meta');
    });
  });
});
