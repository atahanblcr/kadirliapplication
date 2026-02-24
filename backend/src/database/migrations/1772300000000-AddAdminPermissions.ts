import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminPermissions1772300000000 implements MigrationInterface {
  name = 'AddAdminPermissions1772300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE admin_module_enum AS ENUM (
          'announcements', 'ads', 'deaths', 'campaigns', 'users', 'pharmacy',
          'transport', 'neighborhoods', 'taxi', 'events', 'guide', 'places',
          'complaints'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "admin_permissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "module" admin_module_enum NOT NULL,
        "can_read" boolean NOT NULL DEFAULT false,
        "can_create" boolean NOT NULL DEFAULT false,
        "can_update" boolean NOT NULL DEFAULT false,
        "can_delete" boolean NOT NULL DEFAULT false,
        "can_approve" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_admin_permissions_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_admin_permissions_user_module" UNIQUE ("user_id", "module")
      )
    `);

    // Create index on user_id for faster lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_admin_permissions_user_id" ON "admin_permissions" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_admin_permissions_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_permissions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS admin_module_enum`);
  }
}
