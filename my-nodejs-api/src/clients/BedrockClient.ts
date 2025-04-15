// src/clients/BedrockClient.ts
import { IAIAgent } from './IAIAgent';
import config from '../config/config'; // Ensure config is correctly imported and configured

// --- AWS SDK Imports ---
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
  InvokeInlineAgentCommand,
  ResponseStream, // Import the type for the stream
} from "@aws-sdk/client-bedrock-agent-runtime";
// --- End AWS SDK Imports ---

export class BedrockClient implements IAIAgent {
  // --- AWS SDK Properties ---
  private client: BedrockAgentRuntimeClient;
  private agentId: string;
  private agentAliasId: string;
  // --- End AWS SDK Properties ---

  constructor() {
    // --- AWS SDK Initialization ---
    // Validate that necessary config values exist
    if (!config.aiAwsAccessKeyId || !config.aiAwsSecretAccessKey || !config.aiAwsAgentId || !config.aiAwsAgentAliasId) {
        throw new Error("Missing required AWS Bedrock configuration in environment variables.");
    }

    this.client = new BedrockAgentRuntimeClient({
      region: "us-east-1", // Use configured region or default
      credentials: {
        accessKeyId: config.aiAwsAccessKeyId,
        secretAccessKey: config.aiAwsSecretAccessKey,
      },
    });
    this.agentId = config.aiAwsAgentId;
    this.agentAliasId = config.aiAwsAgentAliasId;
    // --- End AWS SDK Initialization ---
  }

  // --- AWS SDK Implementation ---
  async runPrompt(systemContext: string, prompt: string, sessionId: string): Promise<string> {
    const command = new InvokeInlineAgentCommand({
      agentId: this.agentId,
      agentAliasId: this.agentAliasId,
      sessionId, // Ensure sessionId is unique per session and ideally user
      // Combine system context and user prompt for the input text
      // Adjust the formatting if your agent expects something different
      inputText: `${systemContext}\n\nUser: ${prompt}`,
      enableTrace: false, // Set to true for debugging if needed
    });

    //ORGINAL _ InvokeAgentCommand
    //InvokeInlineAgentCommand
    //instruction 
    //model
    //agentname

    try {
      const response = await this.client.send(command);

      if (!response.completion) {
        // Handle cases where completion stream might be missing
        console.error("Bedrock response completion stream is undefined. SessionId:", sessionId);
        throw new Error("Bedrock response completion stream is undefined.");
      }

      let completion = "";
      // Process the async generator stream correctly
      for await (const event of response.completion) {
        if (event.chunk?.bytes) {
          // Decode the Uint8Array bytes to a string
          completion += new TextDecoder().decode(event.chunk.bytes);
        } else if (event.trace) {
          // Handle trace part if enableTrace was true
          // Useful for debugging agent steps
          console.log("Trace:", JSON.stringify(event.trace, null, 2));
        } else if (event.internalServerException) {
          console.error("Bedrock internal server exception:", event.internalServerException.message);
          throw new Error(`Bedrock internal server exception: ${event.internalServerException.message}`);
        } else if (event.validationException) {
            console.error("Bedrock validation exception:", event.validationException.message);
            throw new Error(`Bedrock validation exception: ${event.validationException.message}`);
        } else if (event.throttlingException) {
            console.error("Bedrock throttling exception:", event.throttlingException.message);
            // Consider implementing retry logic here
            throw new Error(`Bedrock throttling exception: ${event.throttlingException.message}`);
        }
        // Add handling for other potential event types like dependencyFailedException if needed
      }

      if (completion === "") {
         console.warn("Bedrock returned an empty completion. SessionId:", sessionId);
         // Depending on the use case, an empty completion might be valid or might indicate an issue.
      }

      return completion;

    } catch (err: any) { // Catch specific AWS errors if needed
      console.error(`Error invoking Bedrock agent (SessionId: ${sessionId}):`, err);
      // Provide a more generic error message to the caller
      throw new Error(`Failed to get completion from Bedrock agent: ${err.name || 'Unknown error'} - ${err.message || ''}`);
    }
  }
  // --- End AWS SDK Implementation ---

  // --- Axios Implementation (Removed) ---
  // The previous axios implementation has been removed.
  // --- End Axios Implementation ---
}
