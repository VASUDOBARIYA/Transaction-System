import express from "express";
import { createTransaction, moneyDeposite, getUserBalance } from "../controllers/transaction.controller.js";
import { adminCheck, authMiddleware } from "../middlewares/auth.middleware.js";

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
transactionRoute.post('/transaction', authMiddleware, createTransaction);
/**
 * @openapi
 * /api/payment/deposite:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Deposit money into a user account (admin only)
 *     description: Admin deposits money into a user's account. Authentication is read from the token cookie and admin privileges are required.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositRequest'
 *     responses:
 *       200:
 *         description: Money deposited successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Money deposited successfully
 *                 transactionInfo:
 *                   $ref: '#/components/schemas/TransactionInfo'
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Request validation failed or account invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication failed or not admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
transactionRoute.post('/deposite', adminCheck, moneyDeposite);
/**
 * @openapi
 * /api/payment/balance:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get the authenticated user's account balance
 *     description: Returns the current balance for the authenticated user. Authentication is read from the token cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Balance fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceResponse'
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
transactionRoute.get('/balance', authMiddleware, getUserBalance);

export default transactionRoute;