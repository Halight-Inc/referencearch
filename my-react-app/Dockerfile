# filepath: /C:/code/referencearch/my-react-app/Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Build the React application with environment variables
ARG VITE_SPLIT_API_KEY
ARG VITE_API_URL
ARG VITE_CLIENT_URL
RUN VITE_API_URL=$VITE_API_URL VITE_CLIENT_URL=$VITE_CLIENT_URL VITE_SPLIT_API_KEY=$VITE_SPLIT_API_KEY npm run build


# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]