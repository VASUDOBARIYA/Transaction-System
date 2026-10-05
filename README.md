# Banking System Backend

A simple Node.js + Express backend for a banking system. Provides user authentication, account management, transactions, and email notifications. MongoDB is used for persistence.

## Features
- User registration & login (JWT)
- Account creation, retrieval and basic account management
- Transaction creation and retrieval (ledger entries)
- Email notifications (email.service)

## Tech stack
- Node.js
- Express
- MongoDB (Mongoose)

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

## Setup
1. Install dependencies

```bash
npm install
```

2. Configure environment

- This project uses `env.js` at the project root for configuration. Ensure the following values are set (either in `env.js` or as environment variables):

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret for signing JWTs
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - SMTP settings (optional)
- `PORT` - server port (default 3000)

3. Start the server

```bash
node server.js
# or if package.json defines a start script
npm start
```

## Project structure

- `server.js` - application entrypoint
- `env.js` - environment/config wrapper
- `src/app.js` - Express app setup
- `src/config/db.js` - MongoDB connection
- `src/config/swagger.js` - Swagger docs config
- `src/controllers/` - route handlers
- `src/routes/` - Express route definitions
- `src/models/` - Mongoose models
- `src/middlewares/` - authentication middleware
- `src/services/` - utility services (e.g., email)

## Important endpoints (examples)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Accounts: `GET /api/accounts`, `POST /api/accounts`, `GET /api/accounts/:id`
- Transactions: `POST /api/transactions`, `GET /api/transactions`, `GET /api/transactions/:id`

See `src/routes` for the definitive list of routes.

## Notes
- Swagger is configured in `src/config/swagger.js` — enable and visit the docs route if available.
- This README was updated to reflect the current project layout and basic run instructions.

## License
MIT
