import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import passportLocalMongoose from "passport-local-mongoose";
const userSchema = mongoose.Schema({
    firstName : {type:String,require:true},
    lastName : {type:String,require:true},
    email : {type:String,require:true,unique:true},
    phoneNumber : {type:Number,require:true},
    password : {type:String,require:true},
  });
// Passport Setup
userSchema.plugin(passportLocalMongoose,{
  usernameField: "email",
});
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default User;