const mongoose = require("mongoose");
const discountcodeschema = new mongoose.Schema({
    code:String,
    percentage: Number
}); 
const discountcode = new mongoose.model("discountcode",discountcodeschema);
module.exports = discountcode;