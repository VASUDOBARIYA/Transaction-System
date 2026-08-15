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
                type:{account: this._id}
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
    ])

    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[ 0 ].balance
}

const UserAccount = mongoose.model("UserAccount", accountSchema);

export default UserAccount;

