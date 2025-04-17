import config from './config/config';
import db from './database';
import seed from './database/seed/seed';
import 'newrelic';
import * as http from 'http';
import { Server } from 'socket.io';
import { setServerInstance } from './serverInstance';
import addRoutes from './app';
import express from 'express';

const MAX_RETRIES = config.dbRetries; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)
let retryCount = 0;

const checkDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('Checking database connection...');
    await db.sequelize.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      await checkDatabaseConnection();
    } else {
      console.error('Max retries reached. Unable to connect to the database.');
    }
  }
};

const startServer = async () => {
  await checkDatabaseConnection();
  await seed(); // Run the seed script

  const app = express();

  // Trust the proxy to handle SSL offloading
  app.set('trust proxy', true);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins (adjust as needed for production)
      credentials: true,
    },
    path: '/socket.io', // Ensure the WebSocket path is correct
  });

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  addRoutes(app);

  server.listen(config.port, () => {
    console.log(`API Server is running on port ${config.port}`);
  });

  setServerInstance(io);
};

startServer();