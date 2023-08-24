import mongoose from 'mongoose';
import Product from '../models/Product.js';
const productintroSchema = mongoose.Schema({
    Title:String,
    products:[Product.schema]
});
const productintro = new mongoose.model("productintro",productintroSchema);

export default productintro;