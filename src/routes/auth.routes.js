import express from "express";
import { signup, login } from "../controllers/auth.controllers.js";

const authroutes = express.Router();

authroutes.post('/signup', signup);
authroutes.post('/login', login);

export default authroutes;