import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailPasswordToUser1771708688909 implements MigrationInterface {
    name = 'AddEmailPasswordToUser1771708688909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "start_time" SET DEFAULT '19:00'`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "end_time" SET DEFAULT '09:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "end_time" SET DEFAULT '09:00:00'`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "start_time" SET DEFAULT '19:00:00'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
