import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config/config';

// Define the basic Swagger metadata
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node API with Postgres and Versioned APIs',
    version: '1.0.0',
    description: 'A sample API for learning purposes',
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
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
