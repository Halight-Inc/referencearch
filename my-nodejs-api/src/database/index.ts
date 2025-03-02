import { Sequelize } from 'sequelize';
import config from '../config/config';
import { initUser, User } from './models/user';

// Sequelize instance
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    logging: false,
});

// Initialize models
initUser(sequelize);

export default {
    sequelize,
    User,
};
