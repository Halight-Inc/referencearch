// c:\code\referencearch\my-nodejs-api\src\controllers\v1\scenarioController.ts
import { Request, Response, NextFunction } from 'express';
import db from '../../database';

/**
 * @swagger
 * /v1/scenarios:
 *   post:
 *     summary: Create a new scenario
 *     description: Creates a new scenario with the provided data.
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScenarioInput' # Use a specific input schema if needed, or Scenario
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Internal server error
 */
const createScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Consider adding input validation here (e.g., using Zod or Joi)
        const newScenario = await db.Scenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (error) {
        console.error('Error creating scenario:', error);
        // Pass the error to the centralized error handler
        next(error);
    }
};

/**
 * @swagger
 * /v1/scenarios/{scenarioId}/files:
 *   post:
 *     summary: Add a file to a scenario
 *     description: Uploads a file (as Base64) and associates it with an existing scenario.
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scenarioId
 *         required: true
 *         description: The UUID of the scenario to add the file to.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base64:
 *                 type: string
 *                 format: byte
 *                 description: Base64 encoded content of the file.
 *             required:
 *               - base64
 *     responses:
 *       200:
 *         description: File added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request (e.g., missing base64 data, invalid scenarioId format)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Scenario not found
 *       500:
 *         description: Internal server error
 */
const addScenarioFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarioId = req.params.scenarioId;
    const { base64 } = req.body;

    // Basic validation
    if (!base64) {
        return res.status(400).json({ message: 'Missing base64 file content in request body.' });
    }
    // Optional: Add validation for scenarioId format (UUID)

    // Check if scenario exists (optional but good practice)
    const scenarioExists = await db.Scenario.findByPk(scenarioId);
    if (!scenarioExists) {
        return res.status(404).json({ message: `Scenario with ID ${scenarioId} not found.` });
    }

    // Create the file record
    await db.ScenarioFile.create({
      scenarioId: scenarioId,
      path: null, // Path is null as we are storing base64 directly for now
      base64: base64,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(`Error adding file to scenario ${req.params.scenarioId}:`, error);
    next(error);
  }
};

/**
 * @swagger
 * /v1/scenarios/{scenarioId}/files:
 *   get:
 *     summary: Get files for a scenario
 *     description: Retrieves metadata (and optionally content) for files associated with a specific scenario.
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scenarioId
 *         required: true
 *         description: The UUID of the scenario to retrieve files for.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of scenario files retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScenarioFile'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Scenario not found or no files found for this scenario.
 *       500:
 *         description: Internal server error
 */
const getScenarioFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarioId = req.params.scenarioId;
    // Optional: Add validation for scenarioId format (UUID)

    // Check if scenario exists (optional but good practice)
    const scenarioExists = await db.Scenario.findByPk(scenarioId);
    if (!scenarioExists) {
        return res.status(404).json({ message: `Scenario with ID ${scenarioId} not found.` });
    }

    const files = await db.ScenarioFile.findAll({
      where: {
        scenarioId: scenarioId,
      },
      // Decide if you want to exclude the large base64 field by default
      // attributes: { exclude: ['base64'] }
    });

    // No need for a separate 404 if files array is empty, an empty array is a valid response.
    // if (!files || files.length === 0) {
    //   return res.status(404).json({ message: 'No files found for this scenario.' });
    // }

    res.json(files);

  } catch (error) {
    console.error(`Error getting files for scenario ${req.params.scenarioId}:`, error);
    next(error);
  }
};

/**
 * @swagger
 * /v1/scenarios/{scenarioId}:
 *   get:
 *     summary: Get a specific scenario by ID
 *     description: Retrieves the details of a single scenario by its UUID.
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scenarioId
 *         required: true
 *         description: The UUID of the scenario to retrieve.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Scenario retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Scenario not found
 *       500:
 *         description: Internal server error
 */
const getScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarioId = req.params.scenarioId;
        // Optional: Add validation for scenarioId format (UUID)

        const scenario = await db.Scenario.findByPk(scenarioId);

        if (!scenario) {
            return res.status(404).json({ message: `Scenario with ID ${scenarioId} not found.` });
        }

        res.status(200).json(scenario);
    } catch (error) {
        console.error(`Error getting scenario ${req.params.scenarioId}:`, error);
        next(error);
    }
};

/**
 * @swagger
 * /v1/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     description: Retrieves a list of all available scenarios.
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of scenarios retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scenario'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Internal server error
 */
const getAllScenarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarios = await db.Scenario.findAll();
        res.json(scenarios);
    } catch (error) {
        console.error('Error getting all scenarios:', error);
        next(error);
    }
};

export default {
  createScenario,
  addScenarioFile,
  getScenarioFiles,
  getScenario,
  getAllScenarios,
};
