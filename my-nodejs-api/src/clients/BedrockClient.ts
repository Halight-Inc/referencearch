// src/clients/BedrockClient.ts
import { IAIAgent } from './IAIAgent';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Import S3 client and command
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import config from '../config/config'; // Ensure config is correctly imported and configured

// --- AWS SDK Imports ---
import {
  BedrockAgentRuntimeClient,
  FileSourceType,
  FileUseCase,
  InputFile,
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
  async runPrompt(systemContext: string, prompt: string, sessionId: string, fileUrls: string[] | null | undefined = [], actionGroups: [] | null | undefined = []): Promise<string> {
    const inlineSessionStateFiles: InputFile[] = [];
    if (fileUrls) {
      const s3BucketName = config.awsS3BucketName;
      fileUrls.forEach((url) => {
        const s3Uri = `s3://${s3BucketName}/${url}`;
        inlineSessionStateFiles.push({
          name: url.split('/').pop(),
            source: {
                sourceType: FileSourceType.S3, // Specify S3 source
                s3Location: {
                    uri: s3Uri, // Provide the full S3 URI
                },
            },
            useCase: FileUseCase.CHAT,
        });
      });
    }



    const command = new InvokeInlineAgentCommand({
      foundationModel: 'amazon.nova-pro-v1:0',
      sessionId: sessionId, // Ensure sessionId is unique per session and ideally user
      instruction: `${systemContext}`,
      inputText: `${prompt}`,
      enableTrace: true, // Set to true for debugging if needed
      inlineSessionState: {
        files: inlineSessionStateFiles.length > 0 ? inlineSessionStateFiles : undefined,
      },
      actionGroups: actionGroups ? actionGroups : []
    });

    // TODO: extract Trace data and save to S3

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
	  }
	  
	  	if (event.trace) {
          // Handle trace part if enableTrace was true
          // Useful for debugging agent steps


    const uniqueFilename = `${Date.now()}-${uuidv4()}.trace`;
    const s3Key = `trace/${uniqueFilename}`; // Example S3 path structure

    const s3BucketName = config.awsS3BucketTraceName;
    const s3Region = 'us-east-1';

    const putObjectParams = {
      Bucket: s3BucketName,
      Key: s3Key,
      Body: JSON.stringify(event.trace, null, 2),
      ContentType: 'text/plain'
      };

    const s3Client = new S3Client({
      region: s3Region,
      credentials: {
	accessKeyId: config.aiAwsAccessKeyId,       // Get from imported config
	secretAccessKey: config.aiAwsSecretAccessKey // Get from imported config
      }
    });

    console.log(`Uploading file to S3: Bucket=${s3BucketName}, Key=${s3Key}`);
    const command = new PutObjectCommand(putObjectParams);
    const uploadResult = await s3Client.send(command);
    console.log("S3 Upload successful:", uploadResult); // Contains ETag, VersionId etc.

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
