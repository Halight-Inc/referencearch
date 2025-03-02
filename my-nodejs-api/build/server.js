"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = __importDefault(require("./database"));
const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)
let retryCount = 0;
let databaseConnectionAvailable = false;
const checkDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Checking database connection...');
        yield database_1.default.sequelize.authenticate();
        console.log('Database connection successful.');
        databaseConnectionAvailable = true; //update
        yield database_1.default.sequelize.sync(); // Sync the models with the database
        console.log('Database synced successfully.');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
            yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            yield checkDatabaseConnection();
        }
        else {
            console.error('Max retries reached. Unable to connect to the database.');
            // we removed process.exit(1)
            return;
        }
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield checkDatabaseConnection();
    // The server start always
    app_1.default.listen(config_1.default.port, () => {
        console.log(`Server is running on port ${config_1.default.port}`);
    });
});
startServer();
