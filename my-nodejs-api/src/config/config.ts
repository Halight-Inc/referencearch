import dotenv from 'dotenv';
dotenv.config();

interface Config {
    port: number;
    dbHost: string;
    dbPort: number;
    dbUser: string;
    dbPassword: string;
    dbName: string;
    dbRetries: number;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    jwtSecret: string;
    apiUrl: string;
    aiAwsAgentId: string;
    aiAwsAgentAliasId: string;
    aiAwsAccessKeyId: string;
    aiAwsSecretAccessKey: string;
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    dbHost: process.env.DATABASE_HOST || 'localhost',
    dbPort: parseInt(process.env.DATABASE_PORT || '5432', 10),
    dbUser: process.env.DATABASE_USERNAME || 'user',
    dbPassword: process.env.DATABASE_PASSWORD || 'password',
    dbName: process.env.DATABASE_NAME || 'mydatabase',
    dbRetries: parseInt(process.env.DATABASE_RETRIES || '5', 10),
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    aiAwsAccessKeyId: process.env.AI_AWS_ACCESS_KEY_ID || '',
    aiAwsSecretAccessKey: process.env.AI_AWS_SECRET_ACCESS_KEY || '',
    aiAwsAgentId: process.env.AI_AWS_AGENT_ID || 'AJBHXXILZN',
    aiAwsAgentAliasId: process.env.AI_AWS_AGENT_ALIAS_ID || '',
};

export default config;
