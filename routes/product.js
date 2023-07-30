const express = require("express");
const router = express.Router();
const path = require("path");
const Intro = require(path.join(__dirname,'../models/Intro')); // Import the Intro model
const Homecomponent = require(path.join(__dirname,'../models/Homecomponent')); // Import the Homecomponent model
const Product = require(path.join(__dirname,'../models/Product'));
router.post("/", function (req, res) {
    const Title = req.body.Title;
  
    // Check if a product with the same title already exists
    Product.findOne({ Title: Title }, function (err, existingProduct) {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
  
      if (existingProduct) {
        // If a product with the same title already exists, return an error response
        return res.status(409).send('Product with this title already exists');
      }
  
      // If the product title is unique, proceed with creating and saving the new product
      const Title = req.body.Title;
      const imageUrl = req.body.imageUrl;
      const basePrice = req.body.basePrice;
      const discoutPer = req.body.discoutPer;
      const quantity = req.body.quantity;
      const unit = req.body.unit;
      const category = req.body.category;
      const description = req.body.description;
      const status = req.body.status;
      const discoutedPrice = basePrice-(basePrice*(discoutPer/100));
  
      const newproduct = new Product({
        Title : Title,
        imageUrl : imageUrl,
        basePrice : basePrice,
        discoutPer : discoutPer,
        quantity : quantity,
        unit : unit,
        category : category,
        description : description,
        status : status,
        discountedPrice : discoutedPrice
    });
  
      newproduct.save(function (err) {
        if (err) {
          return res.status(500).send('Internal Server Error');
        } else {
          res.send("Successfully added product to the database");
        }
      });
    });
  });
  
router.get("/:productTitle",function(req,res){
    const routeTitle = req.params.productTitle;
    Product.findOne({Title:routeTitle},function(err,data){
        if(!err){
            if(data){
                res.send(data);
            }
            else{
                res.status(404).send("Data not found route is invalid");
            }
        }else{
            res.status(500).send(err);
        }
    });
});

router.delete("/:productTitle",function(req,res){
    routeTitle = req.params.productTitle;
    Product.deleteOne({Title:routeTitle},function(err){
        if(err){
            res.status(500).send("deletion of product become unsuccessfull");
        }
        else{
            res.status(200).send("Successfully deleted product");
        }
    });
});

module.exports = router;