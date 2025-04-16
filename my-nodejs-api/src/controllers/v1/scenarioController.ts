import { Request, Response, NextFunction } from 'express';
import db from '../../database';

/**
 * @swagger
 * /v1/scenarios:
 *   post:
 *     summary: Create a new scenario
 *     description: Creates a new scenario with the provided data.
 *     tags: [Scenarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoachonCueScenario'
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoachonCueScenario'
 *       500:
 *         description: Internal server error
 */
const createScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newScenario = await db.CoachonCueScenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/scenarios/{scenarioId}:
 *   get:
 *     summary: Get a scenario by ID
 *     description: Retrieves a scenario by its ID.
 *     tags: [Scenarios]
 *     parameters:
 *       - in: path
 *         name: scenarioId
 *         required: true
 *         description: ID of the scenario to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Scenario retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoachonCueScenario'
 *       404:
 *         description: Scenario not found
 *       500:
 *         description: Internal server error
 */
const getScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarioId = req.params.scenarioId; // Access the ID here
        const scenario = await db.CoachonCueScenario.findByPk(scenarioId);
        res.status(200).json(scenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     description: Retrieves all scenarios.
 *     tags: [Scenarios]
 *     responses:
 *       200:
 *         description: Scenarios retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoachonCueScenario'
 *       500:
 *         description: Internal server error
 */
const getAllScenarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarios = await db.CoachonCueScenario.findAll();
        res.json(scenarios);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default {
    createScenario,
    getScenario,
    getAllScenarios,
};
