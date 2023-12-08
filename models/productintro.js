const mongoose = require("mongoose");
const Product = require("../models/Product.js");
const productintroSchema = mongoose.Schema({
  Title: String,
  products: [Product.schema],
});
const productintro = new mongoose.model("productintro", productintroSchema);

module.exports = productintro;
