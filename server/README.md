# CollabIDE Backend

This is the backend server for CollabIDE, providing a robust, real-time collaboration environment with an API-first approach.

## Overview
CollabIDE backend handles authentication, project and file management, real-time presence and cursors (via Socket.IO), and a simplified Git-like version control system.

## Prerequisites
- Node.js 20+
- MongoDB 6+ (or MongoDB Atlas)

## Setup
1. Clone the repository and navigate to the `server/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` (or create a new `.env` file) and fill in your secrets:
   ```
   NODE_ENV=development
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/collabide
   JWT_SECRET=your_super_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts
- `npm run dev`: Starts the application in development mode with hot-reloading (nodemon).
- `npm start`: Starts the application in production mode.
- `npm run seed`: Seeds the database with default templates.

## Folder Structure
- `src/config`: Application-wide configuration and environment variables.
- `src/controllers`: Request handlers that coordinate with services and models.
- `src/middleware`: Express middlewares (auth, validation, error handling).
- `src/models`: Mongoose database schemas.
- `src/routes`: API endpoint definitions mapping to controllers.
- `src/services`: Core business logic separated from the HTTP layer.
- `src/sockets`: Socket.IO handlers for real-time collaboration.
- `src/utils`: Helper functions and utilities.
- `src/validators`: Request schema validation.

## API Documentation
Please refer to [API.md](./API.md) for a comprehensive list of endpoints, required authentication, request bodies, and expected responses.

## Deployment Notes
- This backend is built to run effortlessly on PAAS providers like Render, Railway, or Fly.io.
- A MongoDB Atlas instance is recommended for production databases.
- Ensure `NODE_ENV=production` is set so logging and error handling adapt securely.
- Ensure `CLIENT_URL` correctly matches the deployed frontend to satisfy CORS policies.
