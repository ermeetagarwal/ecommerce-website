import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    firstName : {type:String,require:true},
    lastName : {type:String,require:true},
    email : {type:String,require:true,unique:true},
    phoneNumber : {type:Number,require:true},
    password : {type:String,require:true},
  });
const User = new mongoose.model("User", userSchema);

export default User;