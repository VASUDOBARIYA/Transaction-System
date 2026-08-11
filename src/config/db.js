import mongoose from "mongoose";
import { mongouri } from "../../env.js";

export const connectToDB = ()=>{
    mongoose.connect(mongouri)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log("Failed to connect", err);
        process.exit(1);
    })
}