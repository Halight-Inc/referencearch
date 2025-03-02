import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        nullable: true
      })
    name!: string;

    @Column('text')
    description!: string;
}
