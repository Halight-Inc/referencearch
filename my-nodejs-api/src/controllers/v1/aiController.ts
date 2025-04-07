// src/controllers/v1/aiController.ts
import { Request, Response, NextFunction } from 'express';
import { IAIAgent } from '../../clients/IAIAgent'
import { BedrockClient } from '../../clients/BedrockClient';
import { AzureClient } from '../../clients/AzureClient';

/**
 * @swagger
 * components:
 *   schemas:
 *     AIRequest:
 *       type: object
 *       required:
 *         - prompt
 *         - sessionId
 *         - agentType
 *       properties:
 *         prompt:
 *           type: string
 *           description: The prompt to send to the AI agent.
 *         sessionId:
 *           type: string
 *           description: The session ID for the conversation.
 *         agentType:
 *           type: string
 *           enum: [bedrock, azure]
 *           description: The type of AI agent to use (bedrock or azure).
 *     AIResponse:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           description: The session ID for the conversation.
 *         completion:
 *           type: string
 *           description: The AI agent's response.
 */

class AIController {
  private agents: { [key: string]: IAIAgent };

  constructor(agents: { [key: string]: IAIAgent }) {
    this.agents = agents;
  }

  /**
   * @swagger
   * /v1/ai/run-prompt:
   *   post:
   *     summary: Run a prompt with an AI agent.
   *     description: Sends a prompt to either the Bedrock or Azure AI agent and returns the completion.
   *     tags: [AI]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AIRequest'
   *     responses:
   *       201:
   *         description: Successful operation.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AIResponse'
   *       400:
   *         description: Bad request. Missing or invalid parameters.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async runPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, sessionId, agentType } = req.body;

      if (!prompt || !sessionId || !agentType) {
        return res.status(400).json({ error: 'Prompt, sessionId, and agentType are required.' });
      }

      const agent = this.agents[agentType];
      if (!agent) {
        return res.status(400).json({ error: `Invalid agentType: ${agentType}` });
      }

      const completion = await agent.runPrompt(prompt, sessionId);
      res.status(201).json({ sessionId, completion });
    } catch (error) {
      next(error);
    }
  }
}

// Instantiate the clients and create the controller
const bedrockClient = new BedrockClient();
const azureClient = new AzureClient();
const aiController = new AIController({
  bedrock: bedrockClient,
  azure: azureClient,
});

export default aiController;
