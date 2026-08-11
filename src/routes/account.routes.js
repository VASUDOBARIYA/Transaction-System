import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccount } from '../controllers/accout.controllers.js';

const accoutRoute = express.Router();

accoutRoute.post("/createAccount", authMiddleware, createAccount);

export default accoutRoute;