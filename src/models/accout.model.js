import mongoose from "mongoose";
import Ledger from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    status:{
        type: String,
        default: "ACTIVE",
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either active, frozen or closed"
        }
    },
    currency:{
        type: String,
        required: true,
        default: "INR"
    }
},{
    timestamps: true
})

accountSchema.index({user:1, status:1});

accountSchema.methods.getBalance = async function () {

    const balance = await Ledger.aggregate([
        {
            $match:{
                account: this._id
            }
        },
        {
            $group:{
                _id: "$type",
                totalSum:{
                    $sum: "$amount"
                } 
            }
        }
    ])

    if (balance.length === 0) {
        return 0
    }

    const creditEntry = balance.find((entry) => entry._id === 'CREDIT');
    const debitEntry = balance.find((entry) => entry._id === 'DEBIT');

    const totalCredit = creditEntry?.totalSum ?? 0;
    const totalDebit = debitEntry?.totalSum ?? 0;

    return totalCredit - totalDebit;
}

const UserAccount = mongoose.model("UserAccount", accountSchema);

export default UserAccount;

