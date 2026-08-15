import mongoose from 'mongoose';
import UserAccount from '../models/accout.model.js';
import Transaction from '../models/transaction.model.js';
import Ledger from '../models/ledger.model.js';
import { sendDebitEmail, sendCreditEmail } from '../services/email.service.js';

const makeTransaction = async (fromaccount, toaccount, amount, idempotancykey)=>{
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //5. Create transaction (PENDING)
        const [transaction] = await Transaction.create([
            {
                fromAccount: fromaccount,
                toAccount: toaccount,
                amount: amount,
                idempotencyKey: idempotancykey,
                status: "PENDING"
            }
        ],{session});

        //6. Create DEBIT ledger entry
        await Ledger.create([
            {
                account: fromaccount,
                amount: amount,
                type: "DEBIT",
                transaction: transaction._id
            },
        ], { session });

        await (()=>{
            new Promise(()=>{
                setTimeout(()=>{
                }, 100000)       
            })
        })

        //7. Create CREDIT ledger entry
        await Ledger.create([
            {
                account: toaccount,
                amount: amount,
                type: "CREDIT",
                transaction: transaction._id
            },
        ], { session });

        //8. Mark transaction COMPLETED

        await Transaction.updateOne(
            { _id: transaction._id },
            { $set: { status: "COMPLETED" } },
            { session }
        );

        await transaction.save({session})

        await session.commitTransaction();

        return transaction;
    } catch (error) {
        console.error("Transaction failed:", error);
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
    
}

export const createTransaction = async (req, res)=>{
    const { fromaccount, toaccount, amount, idempotancykey } = req.body;

    //1. Validate request

    if(!fromaccount || !toaccount || !amount || !idempotancykey){
        return res.status(400).json({
            message : "Missing required fields",
            status : "failed"
        })
    }

    const transactionDetail = await Transaction.findOne({ idempotencyKey: idempotancykey });

    //2. Validate idempotency key

    if(transactionDetail?.status === "COMPLETED"){
        return res.status(200).json({
            message: "Transaction completed successfully",
            status: "success"
        })
    }

    if(transactionDetail?.status === "PENDING"){
        return res.status(200).json({
            message: "Transaction is still processing"
        })
    }

    //3. Check account status

    const SenderStatus = await UserAccount.findOne({ _id: fromaccount });

    if(!SenderStatus){
        return res.status(400).json({
            message: "Sender account not found.",
            status: "failed"
        })
    }

    if(SenderStatus.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Sender account is not active and cannot be used for transactions.",
            accountInfo: SenderStatus,
            status: "failed"
        })
    }

    const ReceiverStatus = await UserAccount.findOne({ _id: toaccount }).populate('user', 'email');

    if(!ReceiverStatus){
        return res.status(400).json({
            message: "Receiver account not found.",
            status: "failed"
        })
    }

    if(ReceiverStatus.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Receiver account is not active and cannot receive payments.",
            accountInfo: ReceiverStatus,
            status: "failed"
        })
    }

    //4. Derive sender balance from ledger

    const senderBalance = await SenderStatus.getBalance();

    if(senderBalance < amount){
        return res.status(400).json({
            message: "Insufficient balance in sender account.",
            balance: senderBalance,
            status: "failed"
        })
    }

    //9.Commit MongoDB session
    const currTransaction = await makeTransaction(fromaccount, toaccount, amount, idempotancykey);

    
    //10. Send email notification
    await sendDebitEmail(req.user.email, amount, currTransaction._id);
    await sendCreditEmail(ReceiverStatus.user.email, amount, currTransaction._id);

    return res.status(200).json({
        message: "Transaction completed successfully",
        transactionInfo: currTransaction._id,
        status: "success"
    })
}

export const moneyDeposite = async (req, res) => {
    const { userAccount, amount, idempotancykey } = req.body;
    
    if(!userAccount || !amount || !idempotancykey){
        return res.status(400).json({
            message : "Missing required fields",
            status : "failed"
        })
    }

    const checkaccount = await UserAccount.findOne({_id:userAccount});

    if(!checkaccount){
        return res.status(400).json({
            message : "Invalid account",
            status : "failed"
        })
    }

    const fromaccount = await UserAccount.findOne({ user: req.user._id });

    if(!fromaccount){
        return res.status(400).json({
            message : "Admin account not found",
            status : "failed"
        })
    }
    
    const currTransaction = await makeTransaction(fromaccount._id, userAccount, amount, idempotancykey);

    const creditedAccount = await UserAccount.findById(userAccount).populate('user', 'email');

    await sendCreditEmail(creditedAccount.user.email, amount, currTransaction._id);

    return res.status(200).json({
        message: "Money deposited successfully",
        transactionInfo: currTransaction.toObject(), 
        status: "success"
    })
}

export const getUserBalance = async (req, res) => {
    const userId = req.user?._id;

    if(req.user.role == "ADMIN"){
        return res.status(200).json({
            message : "Balance fetched successfully",
            balance : 0,
            status : "success"
        })
    }

    if(!userId){
        return res.status(401).json({
            message: "Invalid user request!",
            status: "failed"
        })
    }

    const CurrAccount = await UserAccount.findOne({ user: userId });

    if(!CurrAccount){
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const balance = await CurrAccount.getBalance();

    return res.status(200).json({
        message : "Balance fetched successfully",
        balance : balance,
        status : "success"
    })
}