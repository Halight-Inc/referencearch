// src/clients/BedrockClient.ts
  import { IAIAgent } from './IAIAgent';
  import { AzureOpenAI } from 'openai'; // Ensure this package is installed
  
  export class AzureClient implements IAIAgent {
    private endpoint = "https://halightlms0683300658.openai.azure.com/";
    private modelName = "gpt-4o-mini";
    private deployment = "gpt-4o-mini";
    private apiKey = "<your-api-key>";
    private apiVersion = "2024-04-01-preview";
    private options = { endpoint: this.endpoint, apiKey: this.apiKey, deployment: this.deployment, apiVersion: this.apiVersion }
    private client: AzureOpenAI;
  
    constructor() {
      this.client = new AzureOpenAI(this.options);
    }
  
    async runPrompt(prompt: string, sessionId: string): Promise<string> {
      try {
        let completion = "";
        const response = await this.client.chat.completions.create({
            messages: [
              { role:"system", content: prompt },
              { role:"user", content: sessionId }
            ],
            stream: true,
            max_tokens: 4096,
              temperature: 1,
              top_p: 1,
              model: this.modelName
          });
          
        for await (const part of response.toReadableStream()){
            completion += (part.choices[0]?.delta?.content || '');
          }
  
        return completion;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
  