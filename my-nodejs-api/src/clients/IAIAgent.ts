// src/interfaces/IAIAgent.ts
import { InvokeAgentCommandOutput } from "@aws-sdk/client-bedrock-agent-runtime";

export interface IAIAgent {
  runPrompt(systemContext: string, prompt: string, sessionId: string, fileUrls?: string[]): Promise<string>;
}
