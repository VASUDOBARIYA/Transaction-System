import { jwtsecret } from "../../env.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "Invalid user request!",
            status : "failed"
        })
    }

    try {
        const decoded = jwt.verify(token, jwtsecret);

        const user = await User.findOne({_id:decoded.userid}).select("+role");

        req.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error!",
            status : "failed"
        })
    }
}

export const adminCheck = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "Invalid user request!",
            status : "failed"
        })
    }

    try {
        const decoded = jwt.verify(token, jwtsecret);
        const user = await User.findOne({_id:decoded.userid}).select("+role");

        if(user.role !== "ADMIN"){
            return res.status(403).json({
                message : "Access denied! You are not authorized to perform this action.",
                status : "failed"
            })
        }

        req.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error!",
            status : "failed"
        })
    }
}