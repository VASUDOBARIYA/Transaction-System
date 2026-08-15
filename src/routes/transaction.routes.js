import express from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transactionRoute = new express.Router();

/**
 * @openapi
 * /api/payment/transaction:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a money transfer transaction
 *     description: Starts the transfer flow for two accounts using an idempotency key. Authentication is read from the token cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionRequest'
 *     responses:
 *       200:
 *         description: Transaction already completed or still processing.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Transaction completed successfully
 *                     transactionInfo:
 *                       $ref: '#/components/schemas/TransactionInfo'
 *                     status:
 *                       type: string
 *                       example: success
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Transaction is still processing
 *       400:
 *         description: Request validation failed or one of the accounts is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Transaction processing failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
transactionRoute.post('/transaction',authMiddleware, createTransaction);

export default transactionRoute;