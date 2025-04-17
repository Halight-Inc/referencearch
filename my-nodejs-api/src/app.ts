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
import v1simulationRoutes from './routes/v1/simulationRoutes'; // New import

/**
 * @swagger
 * components:
 *   schemas:
 *     Simulation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the simulation.
 *         status:
 *           type: string
 *           description: The current status of the simulation (e.g., "In Progress", "Completed").
 *         interactionMode:
 *           type: string
 *           description: The mode of interaction used (e.g., "text", "voice").
 *         scenarioId:
 *           type: string
 *           format: uuid
 *           description: The ID of the scenario this simulation is based on.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who ran the simulation.
 *         chatMessages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 enum: [user, ai, system]
 *               text:
 *                 type: string
 *           description: An array containing the chat messages exchanged during the simulation.
 *           nullable: true
 *         simulationResult:
 *           type: object
 *           properties:
 *             competencyEvaluations:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   competency:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   notes:
 *                     type: string
 *             generalFeedback:
 *               type: string
 *           description: The evaluation results of the simulation.
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the simulation was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the simulation was last updated.
 *       required:
 *         - status
 *         - interactionMode
 *         - scenarioId
 */

export default function addRoutes(app: express.Application) {
	const bodyParserLimit = '50mb';

	// app.use(express.json()); will cause issue for stripe webhooks
	app.use((req, res, next) => {
		if (req.originalUrl === '/v1/stripe/webhook') {
		  next();
		} else {
		  express.json({ limit: bodyParserLimit })(req, res, next);
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
	app.use('/v1/simulation', v1simulationRoutes);
	app.use('/v1/ai', v1AiRoutes);
	app.use('/api-docs', swaggerUi.serve, swaggerUiSetup);

  app.use(errorHandler);
}
