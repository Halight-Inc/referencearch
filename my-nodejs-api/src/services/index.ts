import { Item } from '../models';
import { Database } from '../database'; // Adjust the import path as necessary

export class ItemService {
    private db: Database;

    constructor() {
        this.db = new Database(); // Initialize your database connection
    }

    async getAllItems(): Promise<Item[]> {
        return await this.db.getItems(); // Fetch all items from the database
    }

    async getItemById(id: string): Promise<Item | null> {
        return await this.db.getItemById(id); // Fetch a single item by ID
    }

    async createItem(itemData: Partial<Item>): Promise<Item> {
        return await this.db.createItem(itemData); // Create a new item in the database
    }

    async updateItem(id: string, itemData: Partial<Item>): Promise<Item | null> {
        return await this.db.updateItem(id, itemData); // Update an existing item
    }

    async deleteItem(id: string): Promise<boolean> {
        return await this.db.deleteItem(id); // Delete an item by ID
    }
}