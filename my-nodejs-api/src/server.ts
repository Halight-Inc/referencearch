import config from './config/config';
import db from './database';
import seed from './database/seed/seed';
import 'newrelic';
import * as http from 'http';
import {Server} from 'socket.io';
import {setServerInstance} from './serverInstance';
import addRoutes from './app';
import express from 'express';

const MAX_RETRIES = config.dbRetries; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)
let retryCount = 0;
let databaseConnectionAvailable = false;

const checkDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('Checking database connection...');
    await db.sequelize.authenticate();
    console.log('Database connection successful.');
    databaseConnectionAvailable = true; //update
  } catch (error) {
    console.error('Error connecting to the database:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      await checkDatabaseConnection();
    } else {
      console.error('Max retries reached. Unable to connect to the database.');
      return;
    }
  }
};

const startServer = async () => {
  await checkDatabaseConnection();
  await seed(); // Run the seed script
  // The server start always

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {cors: { origin: '*', credentials: true}});

  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  addRoutes(app);

  server.listen(config.port, () => {
    console.log(`API Server is running on port ${config.port}`);
  });

  setServerInstance(io);
};

startServer();
