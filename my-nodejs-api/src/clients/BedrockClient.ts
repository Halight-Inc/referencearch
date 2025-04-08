// src/clients/BedrockClient.ts
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,    
  } from "@aws-sdk/client-bedrock-agent-runtime";
  import { IAIAgent } from './IAIAgent';
  import config from '../config/config';
  
  export class BedrockClient implements IAIAgent {
    private client: BedrockAgentRuntimeClient;
    private agentId: string;
    private agentAliasId: string;
  
    constructor() {
      this.client = new BedrockAgentRuntimeClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: config.aiAwsAccessKeyId,
          secretAccessKey: config.aiAwsSecretAccessKey,
        },
      });
      this.agentId = config.aiAwsAgentId;
      this.agentAliasId = config.aiAwsAgentAliasId;
    }
  
    async runPrompt(systemContext: string, prompt: string, sessionId: string): Promise<string> {
      const command = new InvokeAgentCommand({
        agentId: this.agentId,
        agentAliasId: this.agentAliasId,
        sessionId,
        inputText: systemContext + "\n" + prompt,
      });
  
      try {
        let completion = "";
        const response = await this.client.send(command);
  
        if (response.completion === undefined) {
          throw new Error("Completion is undefined");
        }
  
        for await (const chunkEvent of response.completion) {
          const chunk = chunkEvent.chunk;
          if (chunk) {
            const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
            completion += decodedResponse;
          }
        }
        return completion;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
  