import express from 'express';
import v1UserRoutes from './routes/v1/userRoutes';
import v2UserRoutes from './routes/v2/userRoutes';
import v1StripeRoutes from './routes/v1/stripeRoutes';
import v1AuthRoutes from './routes/v1/authRoutes'; // New import
import errorHandler from './middlewares/errorHandler';
import { swaggerSpec, swaggerUiSetup, swaggerUi } from './swagger';
import cors from 'cors';
import v1ItemRoutes from './routes/v1/itemRoutes';
import v1ScenarioRoutes from './routes/v1/scenarioRoutes';
import v1AiRoutes from './routes/v1/aiRoutes';

const app = express();

// app.use(express.json()); will cause issue for stripe webhooks
app.use((req, res, next) => {
    if (req.originalUrl === '/v1/stripe/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
});
app.use(express.raw({ type: 'application/json' })); // Add this line for raw body parsing for webhooks
app.use(cors()); // Enable CORS for all routes

app.use('/v1/users', v1UserRoutes);
app.use('/v2/users', v2UserRoutes);
app.use('/v1/stripe', v1StripeRoutes);
app.use('/v1/auth', v1AuthRoutes);
app.use('/v1/items', v1ItemRoutes)
app.use('/v1/scenarios', v1ScenarioRoutes)
app.use('/v1/ai', v1AiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUiSetup);

app.use(errorHandler);

export default app;
