# filepath: /C:/code/referencearch/my-react-app/Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:22-alpine

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
RUN npm run build


# Install the Vite preview tool (since it's part of the Vite CLI)
RUN npm install -g vite

# Expose the port the app runs on
EXPOSE 3000

# Start the application using Vite preview
CMD ["vite", "preview", "--port", "3000", "--host", "0.0.0.0"]