import express from 'express';
import { json } from 'body-parser';
import { setRoutes as setV1Routes } from './routes/v1';
import { setupSwagger } from './swagger';
import { initializeDatabase } from './database';
import { seedUsers } from './seeds/userseed';
import { createConnection, getConnection } from 'typeorm';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

const startServer = async () => {
    try {
        await initializeDatabase();
        await getConnection().runMigrations();
        await seedUsers();
        setV1Routes(app);
        setupSwagger(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();