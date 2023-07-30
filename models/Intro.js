const mongoose = require('mongoose');
const path = require("path");
const Homecomponent = require(path.join(__dirname,'../models/Homecomponent'));
const introSchema = mongoose.Schema({
    Title:String,
    homecomponents:[Homecomponent.schema]
});
const Intro = new mongoose.model("Intro",introSchema);

module.exports = Intro;