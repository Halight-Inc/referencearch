"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const dbConfig = {
    development: {
        username: config_1.default.dbUser,
        password: config_1.default.dbPassword,
        database: config_1.default.dbName,
        host: config_1.default.dbHost,
        port: config_1.default.dbPort,
        dialect: 'postgres', // Change: ensure it's one of the Dialect values
    },
    // ... Add test and production configurations if needed
};
exports.default = dbConfig;
