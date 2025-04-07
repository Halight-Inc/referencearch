// src/interfaces/IAIAgent.ts
import { InvokeAgentCommandOutput } from "@aws-sdk/client-bedrock-agent-runtime";

export interface IAIAgent {
  runPrompt(prompt: string, sessionId: string): Promise<string>;
}
