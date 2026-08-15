import mongoose from "mongoose";


const transectionSchema = mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
        index: true
    },
    amount:{
        type: Number,
        required: true,
        min: 0
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING", "COMPLETED", "FAILED"],
        },
        default: "PENDING"
    },
    idempotencyKey:{
        type: String,
        required: true,
        index: true,
        unique: true
    }
},{
    timestamps: true
})

const Transaction = mongoose.model("Transaction", transectionSchema);

export default Transaction;