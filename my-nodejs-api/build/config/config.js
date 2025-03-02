"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '5432', 10),
    dbUser: process.env.DB_USER || 'your_db_user',
    dbPassword: process.env.DB_PASSWORD || 'your_db_password',
    dbName: process.env.DB_NAME || 'your_db_name',
};
exports.default = config;
