import express from 'express'
import authroutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import accoutRoute from './routes/account.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/account", accoutRoute);


export default app;

