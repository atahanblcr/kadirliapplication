import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransportAdminFields1771900000000 implements MigrationInterface {
  name = 'AddTransportAdminFields1771900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // intercity_routes: add admin fields
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" ADD "company_name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" ADD "from_city" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" ADD "contact_phone" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" ADD "contact_website" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" ADD "amenities" text`,
    );

    // intercity_schedules: add days_of_week
    await queryRunner.query(
      `ALTER TABLE "intercity_schedules" ADD "days_of_week" text`,
    );

    // intracity_routes: add color and fare
    await queryRunner.query(
      `ALTER TABLE "intracity_routes" ADD "color" character varying(7)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_routes" ADD "fare" numeric(8,2)`,
    );

    // intracity_stops: add neighborhood, lat, lng
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" ADD "neighborhood_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" ADD "latitude" numeric(10,8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" ADD "longitude" numeric(11,8)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" DROP COLUMN "longitude"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" DROP COLUMN "latitude"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_stops" DROP COLUMN "neighborhood_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_routes" DROP COLUMN "fare"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intracity_routes" DROP COLUMN "color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_schedules" DROP COLUMN "days_of_week"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" DROP COLUMN "amenities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" DROP COLUMN "contact_website"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" DROP COLUMN "contact_phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" DROP COLUMN "from_city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercity_routes" DROP COLUMN "company_name"`,
    );
  }
}
