import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from "../models/user.js"

const saltrounds = 10;
const router = express.Router();

router.post("/register",async (req,res) => {
    try{
        const emailexist = await User.findOne({Email:req.body.email});
        if (emailexist) {
            // User with the provided email already exists
            return res.status(409).json({
              statusText: 'Conflict',
              message: 'A user with this email already exists.',
            });
          }else{
            const hash = await bcrypt.hash(req.body.password, saltrounds);
            const newUser = new User({
                 firstName : req.body.firstName,
                 lastName : req.body.lastName,
                 email : req.body.email,
                 phoneNumber : req.body.phoneNumber,
                 password : hash,
            });
            await newUser.save();
            res.send("Success"); 
          }
    } catch(err){
        console.error("Unexpected error:", err);
        return res.status(500).send("An unexpected error occurred.");
    }
});

router.post("/login",async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremailexist = await User.findOne({email:email});
        if(useremailexist){
            const result =await bcrypt.compare(password,useremailexist.password);
            if(result){
                res.status(200).send("login Successfull");
            } else{
                res.status(401).send("Invalid login Credential try again or register");
            }
        } else{
            res.send(401).send("Invalid login Credential try again or register");
        }
    } catch(err){
        console.error("Unexpected error:", err);
        return res.status(500).send("An unexpected error occurred.");
    }
});

export default router;