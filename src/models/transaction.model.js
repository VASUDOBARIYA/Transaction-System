import mongoose from "mongoose";


const transectionSchema = mongoose.Schema({
    fromAccount:{
        typeof: mongoose.Schema.Types.ObjectId,
        ref: "userAccount",
        required: true,
        index: true
    },
    toAccount:{
        typeof: mongoose.Schema.typeof.ObjectId,
        ref: "userAccount",
        required: true,
        index: true
    },
    amount:{
        type: Number,
        required: true,
        min: 0
    },
    status:{
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

const transaction = mongoose.model("transaction", transectionSchema);

export default transaction;