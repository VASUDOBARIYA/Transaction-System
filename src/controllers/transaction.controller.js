import mongoose from 'mongoose';
import UserAccount from '../models/accout.model.js';
import Transaction from '../models/transaction.model.js';
import Ledger from '../models/ledger.model.js';
import { sendSuccessfullTransectionEmail } from '../services/email.service.js';

const makeTransaction = async (fromaccount, toaccount, amount, idempotancykey)=>{
    const session = await mongoose.startSession();

    session.startTransaction();

    const transaction = await Transaction.create({
        fromAccount: fromaccount,
        toAccount: toaccount,
        amount: amount,
        idempotencyKey: idempotancykey,
        status: "PENDING"
    },{session})

    const debitLedger = await Ledger.create({
        account: fromaccount,
        amount: amount,
        type: "DEBIT",
        transaction: transaction._id
    },{session})

    const creditLedger = await Ledger.create({
        account: toaccount,
        amount: amount,
        type: "CREDIT",
        transaction: transaction._id
    },{session})

    await Transaction.findOneAndUpdate(
        {_id: transaction._id},
        {status: "COMPLETED"},
        {session}
    )

    session.commitTransaction();

    session.endSession();

    return transaction;
    
}

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

export const createTransaction = async (req, res)=>{
    const { fromaccount, toaccount, amount, idempotancykey } = req.body;

    //1. Validate request

    if(!fromaccount || !toaccount || !amount || !idempotancykey){
        return res.status(400).json({
            message : "Missing required fields",
            status : "failed"
        })
    }

    const transactionDetail = await Transaction.findOne({idempotancykey});

    //2. Validate idempotency key

    if(transactionDetail.status === "COMPLETED"){
        return res.status(200).json({
            message: "Transaction completed successfully",
            transactionInfo: transactionDetail.select("-idempotencyKey"),
            status: "success"
        })
    }

    if(transactionDetail.status === "PENDING"){
        return res.status(200).json({
            message: "Transaction is still processing"
        })
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
        return res.status(500).json({
            message: "Transaction processing failed, please retry"
        })
    }

    //3. Check account status

    const SenderStatus = await UserAccount.findOne({fromaccount});

    if(SenderStatus.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Sender account is not active and cannot be used for transactions.",
            accountInfo: SenderStatus,
            status: "failed"
        })
    }

    const ReceiverStatus = await UserAccount.findOne({toaccount});

    if(ReceiverStatus.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Receiver account is not active and cannot receive payments.",
            accountInfo: ReceiverStatus,
            status: "failed"
        })
    }

    //4. Derive sender balance from ledger

    const senderBalance = await fromaccount.getBalance();

    if(senderBalance < amount){
        return res.status(400).json({
            message: "Insufficient balance in sender account.",
            balance: senderBalance,
            status: "failed"
        })
    }
    
    const currTransaction = makeTransaction(fromaccount, toaccount, amount, idempotancykey);

    await sendSuccessfullTransectionEmail(req.user.email, amount, currTransaction._id);

    return res.status(200).json({
        message: "Transaction completed successfully",
        transactionInfo: currTransaction.select("-idempotencyKey"), 
        status: "success"
    })
}