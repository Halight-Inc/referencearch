"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config/config"));
const users_1 = __importDefault(require("./models/users"));
const environment = 'development';
const dbConfiguration = config_1.default[environment];
const sequelize = new sequelize_1.Sequelize(Object.assign(Object.assign({}, dbConfiguration), { dialect: dbConfiguration.dialect, logging: console.log }));
const db = {
    Sequelize: sequelize_1.Sequelize,
    sequelize,
    User: (0, users_1.default)(sequelize),
};
exports.default = db;
