import { createConnection, Connection } from 'typeorm';
import { Item } from './models/index.js';

export const initializeDatabase = async () => {
    await createConnection();
};

export class Database {
    private connection!: Connection;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.connection = await createConnection();
    }

    async getItems(): Promise<Item[]> {
        return this.connection.getRepository(Item).find();
    }

    async getItemById(id: string): Promise<Item | null> {
        const item = await this.connection.getRepository(Item).findOne(id);
        return item ?? null;
    }

    async createItem(itemData: Partial<Item>): Promise<Item> {
        const item = this.connection.getRepository(Item).create(itemData);
        return this.connection.getRepository(Item).save(item);
    }

    async updateItem(id: string, itemData: Partial<Item>): Promise<Item | null> {
        await this.connection.getRepository(Item).update(id, itemData);
        const item = await this.connection.getRepository(Item).findOne(id);
        return item ?? null;
    }

    async deleteItem(id: string): Promise<boolean> {
        const result = await this.connection.getRepository(Item).delete(id);
        return result.affected !== 0;
    }
}