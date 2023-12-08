const mongoose = require("mongoose");
const Homecomponent = require("../models/Homecomponent.js");

const introSchema = mongoose.Schema({
  Title: String,
  homecomponents: [Homecomponent.schema],
});
const Intro = new mongoose.model("Intro", introSchema);

module.exports = Intro;