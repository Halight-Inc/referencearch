import express from 'express';
import { json } from 'body-parser';
import { setRoutes } from './routes';
import { setupSwagger } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
setRoutes(app);
setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});