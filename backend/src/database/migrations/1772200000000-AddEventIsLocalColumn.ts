import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventIsLocalColumn1772200000000 implements MigrationInterface {
  name = 'AddEventIsLocalColumn1772200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_local" BOOLEAN NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN IF EXISTS "is_local"`,
    );
  }
}
