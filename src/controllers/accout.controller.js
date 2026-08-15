import UserAccount from '../models/accout.model.js'

export const createAccount = async (req, res)=>{
    const user = req.user;

    const account = await UserAccount.create({
        user: user._id
    }) 

    return res.status(201).json({
        message: "Account created successfully",
        accountInfo : account,
        status: "success"
    })
}

export const getAccount = async (req, res)=>{
    const account = await UserAccount.findOne({user: req.user});

    return res.status(200).json({
        message: "Account fetched successfully",
        accountInfo : account,
        status: "success"
    })
}