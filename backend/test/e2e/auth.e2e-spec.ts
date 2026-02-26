import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../helpers/app-factory';

describe('Auth Module E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Admin Login (POST /v1/auth/admin/login)', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          email: 'admin@kadirliapp.com',
          password: 'Admin123a',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('access_token');
      expect(res.body.data).toHaveProperty('refresh_token');
      expect(res.body.meta).toHaveProperty('timestamp');

      // Store token for later tests
      accessToken = res.body.data.access_token;
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          email: 'admin@kadirliapp.com',
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          email: 'admin@kadirliapp.com',
          // Missing password
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('OTP Request (POST /v1/auth/request-otp)', () => {
    it('should request OTP with valid Turkish phone number', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/request-otp')
        .send({
          phone: '05551234567',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('message');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('should return 400 for invalid phone format', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/request-otp')
        .send({
          phone: '1234567', // Too short
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('should return 400 for missing phone', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/request-otp')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('OTP Verification (POST /v1/auth/verify-otp)', () => {
    it('should verify OTP successfully with dev mode code 123456', async () => {
      // First request OTP
      await request(app.getHttpServer())
        .post('/v1/auth/request-otp')
        .send({
          phone: '05551234567',
        })
        .expect(200);

      // Then verify with dev mode OTP
      const res = await request(app.getHttpServer())
        .post('/v1/auth/verify-otp')
        .send({
          phone: '05551234567',
          otp: '123456',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      // Response contains either access_token or temp_token depending on registration status
      expect(
        res.body.data.access_token ||
          res.body.data.temp_token ||
          res.body.data.message,
      ).toBeDefined();
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('should return 401 for wrong OTP code', async () => {
      // First request OTP
      await request(app.getHttpServer())
        .post('/v1/auth/request-otp')
        .send({
          phone: '05551234568',
        })
        .expect(200);

      // Then try with wrong OTP
      const res = await request(app.getHttpServer())
        .post('/v1/auth/verify-otp')
        .send({
          phone: '05551234568',
          otp: '000000',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('should return 400 for invalid OTP format', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/verify-otp')
        .send({
          phone: '05551234569',
          otp: 'invalid', // Not 6 digits
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected Routes Authorization', () => {
    it('should return 401 when accessing protected route without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/users/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('should return 401 with invalid Bearer token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/users/me')
        .set('Authorization', 'Bearer invalid-token-xyz')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.meta).toHaveProperty('timestamp');
    });
  });

  describe('Response Envelope Format', () => {
    it('successful response should have consistent envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/admin/neighborhoods')
        .expect(200);

      // Check envelope structure
      expect(typeof res.body.success).toBe('boolean');
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('timestamp');
      expect(res.body.meta).toHaveProperty('path');

      // Timestamp should be ISO string
      expect(typeof res.body.meta.timestamp).toBe('string');
      expect(() => new Date(res.body.meta.timestamp)).not.toThrow();
    });

    it('error response should have consistent envelope', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/admin/login')
        .send({
          email: 'admin@kadirliapp.com',
          password: 'wrongpassword',
        })
        .expect(401);

      // Check error envelope structure
      expect(typeof res.body.success).toBe('boolean');
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code');
      expect(res.body.error).toHaveProperty('message');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('timestamp');
    });
  });
});
