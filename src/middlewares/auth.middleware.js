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

        const user = await User.findOne({_id:decoded.userid});

        req.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message : "Invalid user request!",
            status : "failed"
        })
    }
}