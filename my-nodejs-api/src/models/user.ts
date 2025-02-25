import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10);
    }

    async validatePassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }
}