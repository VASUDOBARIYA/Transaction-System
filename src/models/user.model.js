import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email already exist"],
        match : [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Invalid email address"],
        trim : true,
        lowercase : true
    },
    name:{
        type  : String, 
        required : [true, "Name is required"],
    },
    password:{
        type : String,
        required: true,
        minlength:[6,"password must contain more then 6 character"],
        select : false
    },
    role:{
        type: String,
        enum:{
            values:["ADMIN","USER"],
        },
        default:"USER",
        immutable:true,
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash

    return;
})

userSchema.methods.comperePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);