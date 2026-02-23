import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTaxiDriverUserIdNullable1772100000000
  implements MigrationInterface
{
  name = 'MakeTaxiDriverUserIdNullable1772100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admin panelden user hesabı olmayan taksi sürücüsü eklenebilsin
    await queryRunner.query(
      `ALTER TABLE "taxi_drivers" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxi_drivers" ALTER COLUMN "user_id" SET NOT NULL`,
    );
  }
}
