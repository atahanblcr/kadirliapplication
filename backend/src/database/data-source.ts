import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'kadirliapp',
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [path.resolve(__dirname, 'entities/**/*.entity.{ts,js}')],
  migrations: [path.resolve(__dirname, 'migrations/**/*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
});
