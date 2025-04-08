// src/clients/AzureClient.ts
import { IAIAgent } from './IAIAgent';
import { AzureOpenAI } from 'openai'; // Ensure this package is installed
import config from '../config/config';

export class AzureClient implements IAIAgent {
  private apiKey = config.aiAzureApiKey;
  private endpoint = config.aiAzureEndpoint;
  private apiVersion = config.aiAzureModelVersion;
  private modelName = config.aiAzureModel;
  private deployment = config.aiAzureModel;
  private options = { endpoint: this.endpoint, apiKey: this.apiKey, deployment: this.deployment, apiVersion: this.apiVersion }
  private client: AzureOpenAI;

  constructor() {
    this.client = new AzureOpenAI(this.options);
  }

  async runPrompt(systemContext: string, prompt: string, sessionId: string): Promise<string> {
    try {
      
      const response = await this.client.chat.completions.create({
        messages: [
          { role:"system", content: systemContext },
          { role:"user", content: prompt }
        ],
          max_completion_tokens: 800,
          temperature: 1,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          model: this.modelName
      });
        
      if (response.choices === undefined) {
        throw new Error("Choices is undefined in the response");
      }
      if (response.choices.length === 0) {
        throw new Error("No choices in the response");
      }
      if (response.choices[0].message === undefined) {
        throw new Error("Message is undefined in the first choice of the response");  
      }
      if (response.choices[0].message.content === null) {
        throw new Error("Content is null in the first choice of the response");
      }

      return response.choices[0].message.content;
      
    } catch (err) {
      console.error("Error in runPrompt:" + sessionId, err);
      throw err;
    }
  }
}