const mongoose = require('mongoose');

const homeComponentSchema = mongoose.Schema({
    Title:String,
    imageUrl:String,
    Description:String
});
const Homecomponent = new mongoose.model("Homecomponent",homeComponentSchema); 

module.exports = Homecomponent;