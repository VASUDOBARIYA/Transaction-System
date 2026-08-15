import express from 'express'
import authroutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import accoutRoute from './routes/account.routes.js';
import transactionRoute from './routes/transaction.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	swaggerOptions: {
		persistAuthorization: true
	}
}));

app.use("/api/auth", authroutes);
app.use("/api/account", accoutRoute);
app.use("/api/payment", transactionRoute);


export default app;

