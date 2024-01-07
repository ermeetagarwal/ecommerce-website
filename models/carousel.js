const mongoose = require("mongoose");
const carouselSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
    unique: true, // This ensures the title must be unique
  },
  imageUrl_desk: String,
  imageUrl_mob: String,
  Description: String,
});
const carousel = new mongoose.model("carousel", carouselSchema);

module.exports = carousel;
