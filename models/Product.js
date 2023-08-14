const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
        unique: true, // This ensures the title must be unique
      },
     imageUrl : String,
     basePrice : Number,
     discountPer : Number,
     quantity : Number,
     unit : String,
     category : String,
     description : String,
     status : String,
     discountedPrice:Number
});
const Product = new mongoose.model("Product",productSchema); 

module.exports = Product;