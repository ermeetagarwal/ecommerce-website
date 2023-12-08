const mongoose = require("mongoose");
const dropalineschema = mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Emailaddress:{
        type: String,
        required: true
    },
    Subject:{
        type: String,
        required: true
    },
    Selectanoption:{
        type: String,
        required:true
    },
    Message:{
        type: String,
        required: true
    }
});
const dropaline = new mongoose.model("dropaline",dropalineschema);
module.exports = dropaline;