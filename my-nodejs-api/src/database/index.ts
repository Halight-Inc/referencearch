import { Sequelize, DataTypes, Dialect } from 'sequelize';
import dbConfig from './config/config';
import UserFactory from './models/users';

const environment = 'development';
const dbConfiguration = dbConfig[environment];

const sequelize = new Sequelize({
  ...dbConfiguration,
  dialect: dbConfiguration.dialect as Dialect, //add this
  logging: console.log,
});

const db = {
  Sequelize,
  sequelize,
  User: UserFactory(sequelize),
};

export default db;
