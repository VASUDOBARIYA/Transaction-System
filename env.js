import dotenv from "dotenv";

dotenv.config();

export const mongouri = process.env.MONGO_DB_URI;
export const jwtsecret = process.env.JWT_SECRET;
export const clientid = process.env.CLIENT_ID;
export const clientsecret = process.env.CLIENT_SECRET;  
export const refreshtoken = process.env.REFRESH_TOKEN;
export const emailuser = process.env.EMAIL_USER;