import { Request, Response, NextFunction } from 'express';
import db from '../../database';
import { WhereOptions } from 'sequelize'; // Import WhereOptions
import { SimulationAttributes } from '../../database/models/simulation'; // Import the SimulationAttributes type

/**
 * @swagger
 * /v1/simulation:
 *   post:
 *     summary: Create a new simulation record
 *     description: Creates a new simulation record with the provided score, scenario ID, and user ID.
 *     tags: [Simulations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimulationInput' # Use a specific input schema
 *     responses:
 *       201:
 *         description: Simulation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Simulation'
 *       400:
 *         description: Bad request (e.g., validation error, missing fields)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Internal server error
 */
const createSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Consider adding input validation here (e.g., using Zod or Joi)
        // Ensure req.body matches SimulationInput schema
        const newSimulation = await db.Simulation.create(req.body);
        res.status(201).json(newSimulation);
    } catch (error) {
        console.error('Error creating simulation:', error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/simulation/{simulationId}:
 *   get:
 *     summary: Get a specific simulation by ID
 *     description: Retrieves the details of a single simulation record by its UUID.
 *     tags: [Simulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         description: The UUID of the simulation to retrieve.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Simulation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Simulation'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Simulation not found
 *       500:
 *         description: Internal server error
 */
const getSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const simulationId = req.params.simulationId;
        // Optional: Add validation for simulationId format (UUID)

        const simulation = await db.Simulation.findByPk(simulationId);

        if (!simulation) {
            return res.status(404).json({ message: `Simulation with ID ${simulationId} not found.` });
        }

        res.status(200).json(simulation);
    } catch (error) {
        console.error(`Error getting simulation ${req.params.simulationId}:`, error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/simulation:
 *   get:
 *     summary: Get all simulations, optionally filtered by scenarioId
 *     description: Retrieves a list of simulation records. Can be filtered by scenario ID using a query parameter.
 *     tags: [Simulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scenarioId
 *         required: false
 *         description: The UUID of the scenario to filter simulations by.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A list of simulations retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Simulation'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Internal server error
 */
const getAllSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { scenarioId } = req.query; // Get scenarioId from query parameters

        // Build the where clause conditionally
        const whereClause: WhereOptions<SimulationAttributes> = {};
        if (scenarioId) {
            // Optional: Add validation for scenarioId format (UUID) if desired
            whereClause.scenarioId = scenarioId as string;
        }

        // Optional: Filter by the logged-in user if your auth middleware adds user info
        // if (req.user && req.user.id) {
        //    whereClause.userId = req.user.id;
        // }

        const simulations = await db.Simulation.findAll({
             where: whereClause,
             order: [['createdAt', 'DESC']] // Order by most recent first
        });
        res.json(simulations);
    } catch (error) {
        console.error('Error getting all simulations:', error);
        next(error);
    }
};

export default {
    createSimulation,
    getSimulation,
    getAllSimulation,
};
