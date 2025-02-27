import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Import body-parser as default
import { setRoutes as setV1Routes } from './routes/v1/index.js';
import { setupSwagger } from './swagger.js';
import { initializeDatabase } from './database.js';
import { seedUsers } from './seeds/userseed.js';
import { getConnection } from 'typeorm';
import { SplitFactory } from '@splitsoftware/splitio';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Split.io
const splitApiKey = process.env.SPLIT_API_KEY;
if (!splitApiKey) {
    throw new Error('SPLIT_API_KEY is not defined in the environment variables');
}

const factory = SplitFactory({
    core: {
        authorizationKey: splitApiKey
    }
});
const splitClient = factory.client();

// Use CORS middleware to allow requests from the React application
app.use(cors({
    origin: process.env.CLIENT_URL, // Use CLIENT_URL from environment variables
    credentials: true,
}));

app.use(bodyParser.json()); // Use json function from body-parser

const startServer = async () => {
    try {
        await initializeDatabase();
        await getConnection().runMigrations();
        await seedUsers();

        // Wait for Split.io client to initialize
        await new Promise((resolve, reject) => {
            splitClient.on(splitClient.Event.SDK_READY, resolve);
            splitClient.on(splitClient.Event.SDK_READY_TIMED_OUT, reject);
        });

        // Use feature flags in your routes
        app.use((req, _, next) => {
            req.splitClient = splitClient;
            next();
        });

        setV1Routes(app);
        setupSwagger(app);

        app.listen(PORT, () => {
            console.log(`Server is running on ${process.env.API_URL}`);
            console.log(`Swagger docs available at ${process.env.API_URL}/api-docs`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
