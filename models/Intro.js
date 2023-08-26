import mongoose from "mongoose";
import Homecomponent from "../models/Homecomponent.js";
const introSchema = mongoose.Schema({
  Title: String,
  homecomponents: [Homecomponent.schema],
});
const Intro = new mongoose.model("Intro", introSchema);

export default Intro;
