# Fastify Server

A simple Fastify server for framework comparison.

## Features

- Basic HTTP server with Fastify
- Health check endpoint
- RESTful API endpoints
- Request logging
- JSON response handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user

## Testing

You can test the endpoints using curl or any HTTP client:

```bash
# Get welcome message
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Get user
curl http://localhost:3000/api/users/123

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

The server runs on `http://localhost:3000` by default.
