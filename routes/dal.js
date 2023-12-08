const express = require('express');
const dropaline = require('../models/dropaline.js');

const router = express.Router();

router.post("/",async(req,res)=>{
    try{
        const name = req.body.Name;
        const emailaddress = req.body.Emailaddress;
        const subject = req.body.Subject;
        const selectanoption = req.body.Selectanoption;
        const message = req.body.Message;

        const newdal = new dropaline({
            Name: name,
            Emailaddress: emailaddress,
            Subject: subject,
            Selectanoption:selectanoption,
            Message: message
        });
        await newdal.save();

        res.status(200).send("successfully send a line.");
    } catch(err){
        return res.status(500).send("unable to post a line.")
    }
});

router.get("/",async(req,res)=>{
    try{
        const data = await dropaline.find();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to fetch data.");
    }
});
module.exports = router;