const mongoose = require("mongoose");
const Homecomponent = require("./carousel.js");

const introSchema = mongoose.Schema({
  Title: String,
  homecomponents: [Homecomponent.schema],
});
const Intro = new mongoose.model("Intro", introSchema);

module.exports = Intro;