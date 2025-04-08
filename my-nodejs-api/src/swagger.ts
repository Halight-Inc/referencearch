import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config/config';

// Define the basic Swagger metadata
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Reference Architecture API',
        version: '1.0.0',
        description: 'Endpoints for the Reference Architecture API',
    },
    servers: [
        {
            url: config.apiUrl,
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Item: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'The item ID',
                        example: 1,
                    },
                    name: {
                        type: 'string',
                        description: 'The item name',
                        example: 'Example Item',
                    },
                    description: {
                        type: 'string',
                        description: 'The item description',
                        example: 'This is an example item.',
                    },
                },
            },
        },
    },
};

// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'], // Path to the API docs
};

// Generate the Swagger spec
const swaggerSpec = swaggerJSDoc(options);

// Serve the Swagger UI
const swaggerUiSetup = swaggerUi.setup(swaggerSpec);

export { swaggerSpec, swaggerUiSetup, swaggerUi };
