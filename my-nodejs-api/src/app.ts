import express from 'express';
import v1UserRoutes from './routes/v1/userRoutes';
import v2UserRoutes from './routes/v2/userRoutes';
import v1StripeRoutes from './routes/v1/stripeRoutes';
import errorHandler from './middlewares/errorHandler';
import { swaggerSpec, swaggerUiSetup, swaggerUi } from './swagger';

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

app.use('/v1/users', v1UserRoutes);
app.use('/v2/users', v2UserRoutes);
app.use('/v1/stripe', v1StripeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUiSetup); // Add this line

app.use(errorHandler);

export default app;
