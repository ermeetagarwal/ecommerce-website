const mongoose = require('mongoose');
const path = require("path");
const Product = require(path.join(__dirname,'../models/Product'));
const productintroSchema = mongoose.Schema({
    Title:String,
    products:[Product.schema]
});
const productintro = new mongoose.model("productintro",productintroSchema);

module.exports = productintro;