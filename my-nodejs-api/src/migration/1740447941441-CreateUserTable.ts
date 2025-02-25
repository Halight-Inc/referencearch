import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1740447941441 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable('user');
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'user',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'username',
                            type: 'varchar',
                            isUnique: true,
                        },
                        {
                            name: 'password',
                            type: 'varchar',
                        },
                    ],
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}
