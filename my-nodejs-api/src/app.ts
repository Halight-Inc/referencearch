import express from 'express';
import { json } from 'body-parser';
import { setRoutes } from './routes/v1';
import { setupSwagger } from './swagger';
import { initializeDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

const startServer = async () => {
    try {
        await initializeDatabase();
        setRoutes(app);
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