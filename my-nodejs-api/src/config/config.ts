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
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    dbHost: process.env.DATABASE_HOST || 'localhost',
    dbPort: parseInt(process.env.DATABASE_PORT || '5432', 10),
    dbUser: process.env.DATABASE_USERNAME || 'your_db_user',
    dbPassword: process.env.DATABASE_PASSWORD || 'your_db_password',
    dbName: process.env.DATABASE_NAME || 'your_db_name',
    dbRetries: parseInt(process.env.DATABASE_RETRIES || '5', 10),
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret',
};

export default config;
