import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Load .env.test BEFORE AppModule is imported (ConfigModule reads process.env at module init)
 * This ensures all environment variables are set before NestJS loads them.
 */
const envTestPath = path.resolve(__dirname, '../../.env.test');
const result = dotenv.config({ path: envTestPath });
if (result.error) {
  throw new Error(`Failed to load .env.test: ${result.error.message}`);
}

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';

/**
 * Factory function to create a fully-configured NestJS test app instance.
 *
 * This mirrors the bootstrap process in src/main.ts exactly:
 * - Loads .env.test configuration
 * - Sets global prefix (/v1)
 * - Applies ValidationPipe with strict rules
 * - Applies HttpExceptionFilter for consistent error responses
 * - Applies TransformInterceptor for consistent success responses
 *
 * @returns {Promise<INestApplication>} Fully initialized and ready-to-use app
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', 'v1');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Global pipes - same config as main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters - same as main.ts
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors - same as main.ts
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();
  return app;
}
