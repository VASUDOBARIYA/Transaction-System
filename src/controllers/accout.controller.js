import UserAccount from '../models/accout.model.js'

export const createAccount = async (req, res)=>{
    const user = req.user;

    const account = await UserAccount.create({
        user: user._id
    }) 

    res.status(201).json({
        message: "Account created successfully",
        accountInfo : account,
        status: "success"
    })
}