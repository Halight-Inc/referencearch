import express from 'express';
import v1UserRoutes from './routes/v1/userRoutes';
import v2UserRoutes from './routes/v2/userRoutes';
import errorHandler from './middlewares/errorHandler';
import { swaggerSpec, swaggerUiSetup, swaggerUi } from './swagger';

const app = express();

app.use(express.json());

app.use('/v1/users', v1UserRoutes);
app.use('/v2/users', v2UserRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUiSetup); // Add this line

app.use(errorHandler);

export default app;
