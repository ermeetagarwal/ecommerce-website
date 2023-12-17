const mongoose = require("mongoose");
const checkoutschema = mongoose.Schema({
    FirstName:{
        type:String,
        required: true,
    },
    LastName:{
        type:String,
        required: true,
    },
    CompanyName:{
        type:String,
    },
    StreetAddress:{
        type:String,
        required: true,
    },
    city:{
        type:String,
        required: true,
    },
    state:{
        type:String,
        required: true,
    },
    PinCode:{
        type:Number,
        required: true,
    },
    Phone:{
        type:Number,
        required: true,
    },
    Email:{
        type:String,
        required: true,
    },
    OrderNote:{
        type:String,
        required: true,
    },
    PaymentMethod:{
        type: String,
        required: true,
    },
    yourorder:[],
    orderNo:{
        type:String
    },
    date:{
        type:String
    }
}); 
const billingdetails = new mongoose.model("billingdetails",checkoutschema);
module.exports = billingdetails;