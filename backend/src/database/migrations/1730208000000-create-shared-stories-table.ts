import { RELATIONSHIP_STATUS_VALUES } from '@together-we-choose/shared';
import { MigrationInterface, QueryRunner, Table, TableCheck } from 'typeorm';

export class CreateSharedStoriesTable1730208000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
			queryRunner.createTable(
				new Table({
					name: 'shared_stories',
					columns: [
						{
							name: 'id',
							type: 'integer',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{ name: 'name', type: 'text', isNullable: true },
						{ name: 'relationshipStatus', type: 'text' },
						{ name: 'email', type: 'text', isNullable: true },
						{ name: 'story', type: 'text' },
						{ name: 'imageThumbnailUrl', type: 'text', isNullable: true },
						{ name: 'imageLargeUrl', type: 'text', isNullable: true },
						{ name: 'createdAt', type: 'datetime' },
						{ name: 'isPublished', type: 'boolean' },
					],
					checks: [
						new TableCheck({
							name: 'CHK_shared_stories_relationshipStatus',
							expression: `"relationshipStatus" IN (${RELATIONSHIP_STATUS_VALUES.map(value => `'${value}'`).join(', ')})`,
						}),
					],
				})
			),
			queryRunner.createTable(
				new Table({
					name: 'feedback',
					columns: [
						{
							name: 'id',
							type: 'integer',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{ name: 'email', type: 'text', isNullable: true },
						{ name: 'feedback', type: 'text' },
						{ name: 'createdAt', type: 'datetime' },
					],
				})
			),
		]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shared_stories');
    await queryRunner.dropTable('feedback');
  }
}
