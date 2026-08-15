import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { jwtsecret } from "../../env.js";
import { sendSignupEmail, sendLoginEmail } from "../services/email.service.js";


export const signup = async (req, res)=>{
    const { email, name, password} = req.body;

    const check = await User.findOne({email:email})

    if(check){
        return res.status(409).json({
            message : "User already exists with same email!",
            status : "failed"
        })
    }

    const user = await User.create({email, name, password});

    const token = jwt.sign({userid:user._id}, jwtsecret,{expiresIn:"3d"});

    res.cookie("token", token);

    res.status(201).json({
        message : "User created successfully",
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
        },
        status : "success",
        token
    })

    await sendSignupEmail(user.email, user.name);
}

export const login = async (req, res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({email:email}).select("+password");

    if(!user){
        return res.status(401).json({
            message : "Invalid email or password",
            status : "failed"
        })
    }

    const IsValidPassword = await user.comperePassword(password);

    if(!IsValidPassword){
        return res.status(401).json({
            message : "Invalid email or password",
            status : "failed"
        })
    }

    const token = jwt.sign({userid:user._id}, jwtsecret,{expiresIn:"3d"});

    res.cookie("token", token);
    res.status(200).json({
        message : "User successfully login",
        user : {
            name : user.name,
            email : user.email
        },
        status : "success",
        token
    })

    sendLoginEmail(user.email, user.name);
}

export const logout = async (req, res)=>{
    try {
        res.clearCookie("token");

        return res.status(200).json({
            message : "Logout successful",
            userInfo: req.user,
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message : "Logout failed",
            status: "failed"
        })
    }
}