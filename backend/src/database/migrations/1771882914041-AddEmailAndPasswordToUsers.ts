import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndPasswordToUsers1771882914041 implements MigrationInterface {
    name = 'AddEmailAndPasswordToUsers1771882914041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "death_notices" DROP CONSTRAINT "FK_death_notices_neighborhood"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "start_time" SET DEFAULT '19:00'`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "end_time" SET DEFAULT '09:00'`);
        await queryRunner.query(`ALTER TABLE "death_notices" ADD CONSTRAINT "FK_4b721040b453fe9352b109c39f9" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "death_notices" DROP CONSTRAINT "FK_4b721040b453fe9352b109c39f9"`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "end_time" SET DEFAULT '09:00:00'`);
        await queryRunner.query(`ALTER TABLE "pharmacy_schedules" ALTER COLUMN "start_time" SET DEFAULT '19:00:00'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "death_notices" ADD CONSTRAINT "FK_death_notices_neighborhood" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
