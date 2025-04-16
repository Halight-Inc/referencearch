import { Request, Response, NextFunction } from 'express';
import db from '../../database';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Import S3 client and command
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { Buffer } from 'buffer'; // Node.js Buffer for decoding base64
import config from './../../config/config';

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
 *     summary: Add a file to a scenario (Uploads to S3)
 *     description: Decodes a Base64 string, uploads the binary content to S3, and associates the S3 path with an existing scenario.
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
 *                 description: Base64 encoded content of the file (can be a Data URL like 'data:application/pdf;base64,...').
 *             required:
 *               - base64
 *     responses:
 *       201:
 *         description: File uploaded to S3 and record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScenarioFile' # Return the created DB record
 *       400:
 *         description: Bad request (e.g., missing base64 data, invalid base64 format, invalid scenarioId format)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Scenario not found
 *       500:
 *         description: Internal server error (including S3 upload issues)
 */
const addScenarioFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarioId = req.params.scenarioId;
    const { base64: base64DataUrl } = req.body; // Renamed for clarity

    // --- Basic Validation ---
    if (!base64DataUrl || typeof base64DataUrl !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid base64 file content in request body.' });
    }
    // Optional: Add validation for scenarioId format (UUID)

    // --- Check if scenario exists ---
    const scenarioExists = await db.Scenario.findByPk(scenarioId);
    if (!scenarioExists) {
        return res.status(404).json({ message: `Scenario with ID ${scenarioId} not found.` });
    }

    // --- Decode Base64 and Extract Info ---
    let fileBuffer: Buffer;
    let contentType = 'application/octet-stream'; // Default content type
    let fileExtension = 'bin'; // Default extension
    let base64String = base64DataUrl;

    // Check if it's a Data URL (e.g., "data:application/pdf;base64,JVBERi0xLj...")
    const dataUrlMatch = base64DataUrl.match(/^data:(.+?);base64,(.*)$/);

    if (dataUrlMatch && dataUrlMatch.length === 3) {
        contentType = dataUrlMatch[1]; // e.g., "application/pdf"
        base64String = dataUrlMatch[2]; // The actual base64 part

        // Try to determine a reasonable extension from contentType
        const extensionMatch = contentType.split('/')[1]; // e.g., "pdf" from "application/pdf"
        if (extensionMatch) {
            // Basic sanitization - avoid complex mimetypes causing issues
            fileExtension = extensionMatch.split('+')[0].replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
        }
    } else {
        // Assume it's raw base64 - content type is unknown without more info
        console.warn(`Received raw base64 string for scenario ${scenarioId}. Assuming generic content type.`);
    }

    try {
        fileBuffer = Buffer.from(base64String, 'base64');
    } catch (decodeError) {
        console.error("Base64 decoding error:", decodeError);
        return res.status(400).json({ message: 'Invalid base64 encoding.' });
    }

    // --- Prepare S3 Upload ---
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const s3Key = `${scenarioId}/files/${uniqueFilename}`; // Example S3 path structure

    const s3BucketName = 'halight-coachoncue-scenarios';
    const s3Region = 'us-east-1';

    const putObjectParams = {
      Bucket: s3BucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
      // ACL: 'public-read' // Uncomment if you need the file to be publicly accessible via URL (use with caution)
    };

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: config.aiAwsAccessKeyId,       // Get from imported config
        secretAccessKey: config.aiAwsSecretAccessKey // Get from imported config
      }
    });

    // --- Upload to S3 ---
    console.log(`Uploading file to S3: Bucket=${s3BucketName}, Key=${s3Key}`);
    const command = new PutObjectCommand(putObjectParams);
    const uploadResult = await s3Client.send(command);
    console.log("S3 Upload successful:", uploadResult); // Contains ETag, VersionId etc.

    // --- Create Database Record ---
    // Store the S3 Key in the 'path' column, set 'base64' to null
    const newFileRecord = await db.ScenarioFile.create({
      scenarioId: scenarioId,
      path: s3Key, // Store the S3 object key (path)
      base64: null, // Set base64 to null as content is now in S3
    });

    // Respond with the created database record
    res.status(201).json(newFileRecord);

  } catch (error) {
    console.error(`Error adding file to scenario ${req.params.scenarioId} and uploading to S3:`, error);
    // Check if it's an S3 specific error for potentially more specific logging/handling
    if (error instanceof Error && error.name === 'CredentialsProviderError') {
         console.error("AWS Credentials Error. Ensure credentials are configured correctly.");
    }
    next(error); // Pass to the generic error handler
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
