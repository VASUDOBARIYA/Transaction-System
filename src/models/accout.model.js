import mongoose from "mongoose";

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

const userAccount = mongoose.model("userAccount", accountSchema);

export default userAccount;

