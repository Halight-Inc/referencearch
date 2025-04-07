import { Request, Response, NextFunction } from 'express';
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
  } from "@aws-sdk/client-bedrock-agent-runtime";
// import db from '../../database';

/**
 * @swagger
 * /v1/ai/run-prompt:
 *   post:
 *     summary: Run a prompt using Bedrock Agent
 *     description: Run a prompt using Bedrock Agent and return the completion.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prompt run successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 completion:
 *                   type: string
 */
const runPrompt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { prompt, sessionId } = req.body;

        if (!prompt || !sessionId) {
            return res.status(400).json({ error: 'Name and description are required.' });
        }

        const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });
        // const client = new BedrockAgentRuntimeClient({
        //   region: "us-east-1",
        //   credentials: {
        //     accessKeyId: "accessKeyId", // permission to invoke agent
        //     secretAccessKey: "accessKeySecret",
        //   },
        // });

        const agentId = "AJBHXXILZN";
        const agentAliasId = "AVKP1ITZAA";

        const command = new InvokeAgentCommand({
            agentId,
            agentAliasId,
            sessionId,
            inputText: prompt,
        });

        try {
            let completion = "";
            const response = await client.send(command);

            if (response.completion === undefined) {
                throw new Error("Completion is undefined");
            }

            for await (const chunkEvent of response.completion) {
                const chunk = chunkEvent.chunk;
                console.log(chunk);
                if(chunk){
                    const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                    completion += decodedResponse;
                }
            }
            res.status(201).json({ sessionId: sessionId, completion });
            return ;
        } catch (err) {
            console.error(err);
        }
        
    } catch (error) {
        next(error);
    }
};

export default {
    runPrompt,
};
