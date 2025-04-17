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

// add this to the swagger definition in app.ts
/**
 * @swagger
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       properties:
 *         id:
 *           type: UUID
 *           description: The auto-generated ID of the scenario.
 *         scenarioType:
 *           type: string
 *           description: The type of the scenario.
 *         keyTopics:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of key topics covered in the scenario.
 *         competenciesAndGoals:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of competencies and goals for the scenario.
 *         guidelines:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of guidelines for the scenario.
 *         coachingFramework:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the coaching framework.
 *             description:
 *               type: string
 *               description: The description of the coaching framework.
 *           description: The coaching framework used in the scenario.
 *         supportingMaterials:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of supporting materials for the scenario.
 *         persona:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the persona.
 *             role:
 *               type: string
 *               description: The role of the persona.
 *             disposition:
 *               type: string
 *               description: The disposition of the persona.
 *             background:
 *               type: string
 *               description: The background of the persona.
 *             communicationStyle:
 *               type: string
 *               description: The communication style of the persona.
 *             emotionalState:
 *               type: string
 *               description: The emotional state of the persona.
 *             avatar:
 *               type: string
 *               description: The avatar of the persona.
 *             avatarUrl:
 *               type: string
 *               description: The avatarUrl of the persona.
 *           description: The persona details for the scenario.
 *       required:
 *         - scenarioType
 *         - keyTopics
 *         - competenciesAndGoals
 *         - coachingFramework
 *         - persona
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
