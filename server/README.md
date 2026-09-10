# CollabIDE — Backend Server

Express + MongoDB REST API powering CollabIDE.

## Prerequisites

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env from example
cp .env.example .env
# Edit .env and set MONGODB_URI if using Atlas

# 3. Start MongoDB locally (if not using Atlas)
mongod

# 4. Start dev server (hot-reload via nodemon)
npm run dev
```

The API is now at: `http://localhost:4000/api/v1`  
Health check: `http://localhost:4000/api/v1/health`

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `PORT` | No | `4000` | HTTP port to listen on |
| `CLIENT_URL` | Yes | — | Frontend origin for CORS (`http://localhost:5173`) |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | — | Secret for signing access tokens (min 16 chars) |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens (min 16 chars) |
| `JWT_ACCESS_EXPIRES` | No | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES` | No | `7d` | Refresh token TTL |
| `COOKIE_DOMAIN` | No | `localhost` | Domain for auth cookies |
| `SMTP_HOST` | No | — | SMTP server host (for email) |
| `SMTP_PORT` | No | — | SMTP server port |
| `SMTP_USER` | No | — | SMTP username |
| `SMTP_PASS` | No | — | SMTP password |
| `SMTP_FROM` | No | `CollabIDE <noreply@collabide.dev>` | From address for transactional emails |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot-reload) |
| `npm start` | Start in production |
| `npm run lint` | ESLint all source files |
| `npm run format` | Prettier format all source files |

## Project Structure

```
server/src/
├── config/
│   ├── env.js          # Zod-validated env vars
│   ├── logger.js       # Winston logger
│   └── db.js           # MongoDB connection
├── controllers/        # Route handler logic (coming in next prompts)
├── middleware/
│   ├── error.middleware.js    # Global error handler
│   └── notFound.middleware.js # 404 catch-all
├── models/             # Mongoose schemas (coming in next prompts)
├── routes/
│   └── index.js        # Root router; mounts sub-routers
├── services/           # Business logic layer (coming in next prompts)
├── sockets/            # Socket.IO event handlers (coming in next prompts)
├── utils/
│   ├── ApiError.js     # Operational error class
│   ├── ApiResponse.js  # Standardized response shape
│   └── asyncHandler.js # Async route wrapper
├── validators/         # Zod request validators (coming in next prompts)
├── app.js              # Express app setup
└── index.js            # Server entry point
```
