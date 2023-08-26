import mongoose from "mongoose";
const homeComponentSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
    unique: true, // This ensures the title must be unique
  },
  imageUrl: String,
  Description: String,
});
const Homecomponent = new mongoose.model("Homecomponent", homeComponentSchema);

export default Homecomponent;
