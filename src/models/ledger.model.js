import mongoose from "mongoose";

const ledgerSchema = mongoose.Schema({
    account:{
        typeof: mongoose.Schema.Types.ObjectId,
        ref: "userAccount",
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
        enum:{
            values: ["CREDIT", "DEBIT"]
        },
        immutable: true,
        required: true
    },
    transaction: {
        typeof: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        immutable: true,
        required: true
    }
})

function prevantLedger(){
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

const ledger = mongoose.model("ledger", ledgerSchema);

export default ledger;