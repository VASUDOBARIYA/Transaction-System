import mongoose from "mongoose";

const ledgerSchema = mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: true,
        min: 0,
        immutable: true
    },
    type:{
        type: String,
        enum:{
            values: ["CREDIT", "DEBIT"]
        },
        immutable: true,
        required: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        immutable: true,
        required: true
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

const Ledger = mongoose.model("Ledger", ledgerSchema);

export default Ledger;