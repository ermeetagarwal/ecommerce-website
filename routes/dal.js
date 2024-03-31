const express = require('express');
const dropaline = require('../models/dropaline.js');
const nodemailer = require('nodemailer');
const { authenticateToken, authenticateAdminToken } = require("../middleware/index.js");

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

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: "New dropaline posted",
            text: `A new dropaline has been posted with the following details:\n\nName: ${name}\nEmail Address: ${emailaddress}\nSubject: ${subject}\nSelect an Option: ${selectanoption}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        res.status(200).send("successfully send a line.");
    } catch(err){
        console.error(err);
        return res.status(500).send("Unable to post a line.");
    }
});

router.get("/",authenticateAdminToken,async(req,res)=>{
    try{
        const data = await dropaline.find();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to fetch data.");
    }
});
module.exports = router;

