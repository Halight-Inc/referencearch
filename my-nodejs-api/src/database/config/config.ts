import config from '../../config/config';
import { Dialect } from 'sequelize';

interface DatabaseConfig {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number;
  dialect: Dialect; // Change: dialect must be Dialect
}

const dbConfig: { [key: string]: DatabaseConfig } = {
  development: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'postgres', // Change: ensure it's one of the Dialect values
  },
  // ... Add test and production configurations if needed
};

export default dbConfig;
