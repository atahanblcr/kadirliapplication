import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBusinessUserIdNullable1772000000000 implements MigrationInterface {
  name = 'MakeBusinessUserIdNullable1772000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // user_id NOT NULL kısıtını kaldır; admin panelden user olmadan işletme eklenebilsin
    await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "user_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "user_id" SET NOT NULL`);
  }
}
