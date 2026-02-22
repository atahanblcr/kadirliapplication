import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNeighborhoodToDeathNotice1771950000000
  implements MigrationInterface
{
  name = 'AddNeighborhoodToDeathNotice1771950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "death_notices" ADD "neighborhood_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "death_notices" ADD CONSTRAINT "FK_death_notices_neighborhood"
       FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id")
       ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "death_notices" DROP CONSTRAINT "FK_death_notices_neighborhood"`,
    );
    await queryRunner.query(
      `ALTER TABLE "death_notices" DROP COLUMN "neighborhood_id"`,
    );
  }
}
