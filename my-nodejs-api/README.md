# My Node.js API

This project is an API-first Node.js application that uses Express and an ORM for database interactions. It is containerized using Docker for easy deployment and scalability.

## Project Structure

```
my-nodejs-api
├── src
│   ├── controllers
│   │   └── index.ts
│   ├── models
│   │   └── index.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   └── index.ts
│   └── app.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-nodejs-api
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Build the Docker image:**
   ```
   docker build -t my-nodejs-api .
   ```

4. **Run the application using Docker Compose:**
   ```
   docker-compose up
   ```

## API Endpoints

- **GET /items**: Retrieve a list of items.
- **POST /items**: Create a new item.

## Usage Examples

### Retrieve Items

```bash
curl -X GET http://localhost:3000/items
```

### Create Item

```bash
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d '{"name": "New Item"}'
```

## License

This project is licensed under the MIT License.