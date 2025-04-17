import { Request, Response, NextFunction } from 'express';
import db from '../../database';
import { WhereOptions } from 'sequelize'; // Import WhereOptions
import { SimulationAttributes } from '../../database/models/simulation'; // Import the SimulationAttributes type

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
 *     SimulationInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the simulation.
 *         interactionMode:
 *           type: string
 *           description: The mode of interaction used.
 *         scenarioId:
 *           type: string
 *           format: uuid
 *           description: The ID of the scenario this simulation is based on.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who ran the simulation.
 *       required:
 *         - status
 *         - interactionMode
 *         - scenarioId
 *         - userId
 */

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
 *             $ref: '#/components/schemas/SimulationInput'
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
        const { scenarioId } = req.query;
        const whereClause: WhereOptions<SimulationAttributes> = {};

        if (scenarioId) {
            whereClause.scenarioId = scenarioId as string;
        }

        const simulations = await db.Simulation.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
        res.json(simulations);
    } catch (error) {
        console.error('Error getting all simulations:', error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/simulation/{simulationId}:
 *   patch:
 *     summary: Update an existing simulation record
 *     description: Updates specific fields of a simulation record by its UUID. Only provided fields will be updated.
 *     tags: [Simulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         description: The UUID of the simulation to update.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimulationInput'
 *     responses:
 *       200:
 *         description: Simulation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Simulation'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Simulation not found
 *       500:
 *         description: Internal server error
 */
const updateSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const simulationId = req.params.simulationId;
        const updateData = req.body;

        const simulation = await db.Simulation.findByPk(simulationId);

        if (!simulation) {
            return res.status(404).json({ message: `Simulation with ID ${simulationId} not found.` });
        }

        const updatedSimulation = await simulation.update(updateData);

        res.status(200).json(updatedSimulation);
    } catch (error) {
        console.error(`Error updating simulation ${req.params.simulationId}:`, error);
        next(error);
    }
};

export default {
    createSimulation,
    getSimulation,
    getAllSimulation,
    updateSimulation,
};