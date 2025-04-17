import { Model, DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize'; // import corrected

// Item interface
interface ItemAttributes {
    id?: string; // make id optional.
    name: string;
    description: string;
}

class Item extends Model<ItemAttributes> implements ItemAttributes {
    public id?: string;
    public name!: string;
    public description!: string;
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Sequelize model definition
const initItem = (sequelize: Sequelize): void => {
    Item.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // Generates a random UUID
                allowNull: false,
                primaryKey: true            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'items',
            sequelize, // Pass the Sequelize instance here
        },
    );
};

export { initItem, Item };
