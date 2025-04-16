import { UUID } from 'crypto';
import { Model, DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize'; // import corrected

// User interface
interface UserAttributes {
    id?: UUID; // make id optional.
    name: string;
    email: string;
    password?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id?: UUID;
    public name!: string;
    public email!: string;
    public password!: string;
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Sequelize model definition
const initUser = (sequelize: Sequelize): void => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // Generates a random UUID
                allowNull: false,
                unique: true,                
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false, // Password should be required
            },
        },
        {
            tableName: 'users',
            sequelize, // Pass the Sequelize instance here
        },
    );
};

export { initUser, User };
