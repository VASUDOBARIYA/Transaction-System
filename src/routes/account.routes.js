import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createAccount, getAccount } from '../controllers/accout.controller.js';

const accoutRoute = express.Router();

/**
 * @openapi
 * /api/account/createAccount:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Create a bank account for the authenticated user
 *     description: Creates a new account for the current user. Authentication is read from the token cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *                 accountInfo:
 *                   $ref: '#/components/schemas/AccountInfo'
 *                 status:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error.
 */
accoutRoute.post("/createAccount", authMiddleware, createAccount);
accoutRoute.get("/getAccount", authMiddleware, getAccount)

export default accoutRoute;