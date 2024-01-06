const mongoose = require("mongoose");
const categoryschema = new mongoose.Schema({
    category_title:{
        type: String,
        required: true,
        unique: true, // This ensures the title must be unique
      },
    img:String,
    tag:String

}); 
const category = new mongoose.model("category",categoryschema);
module.exports = category;