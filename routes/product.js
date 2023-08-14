const express = require("express");
const router = express.Router();
const path = require("path");
const productintro = require(path.join(__dirname, "../models/productintro")); // Import the Intro model
const Product = require(path.join(__dirname, "../models/Product"));
router.post("/", async function (req, res) {
  try{
    const Title = req.body.Title;
    const imageUrl = req.body.imageUrl;
    const basePrice = req.body.basePrice;
    const discountPer = req.body.discountPer;
    const quantity = req.body.quantity;
    const unit = req.body.unit;
    const category = req.body.category;
    const description = req.body.description;
    const status = req.body.status;
    const discoutedPrice = basePrice - basePrice * (discountPer / 100);
  
    const existingIntro = await productintro.findOne({ Title: "product" });
    if (!existingIntro) {
      const newproduct = new Product({
        Title: Title,
        imageUrl: imageUrl,
        basePrice: basePrice,
        discountPer: discountPer,
        quantity: quantity,
        unit: unit,
        category: category,
        description: description,
        status: status,
        discountedPrice: discoutedPrice,
      });
      const newintro = new productintro({
        Title: "product",
        products: newproduct,
      });
  
      await newproduct.save();
      await newintro.save();
  
      res.send("Success");
    } else{
      const productExists = existingIntro.products.some(
        (component) => component.Title === Title
      );
      if (productExists) {
        return res.status(409).send("Product with this title already exists.");
      }
      const newproduct = new Product({
        Title: Title,
        imageUrl: imageUrl,
        basePrice: basePrice,
        discountPer: discountPer,
        quantity: quantity,
        unit: unit,
        category: category,
        description: description,
        status: status,
        discountedPrice: discoutedPrice,
      });
      await newproduct.save();  
      existingIntro.products.push(newproduct);
      await existingIntro.save();
      res.send('success');
    }
  }  catch (err) {
    res.status(500).send("Internal Server Error");
  }
});
router.get("/", function (req, res) {
  productintro.findOne({ Title: "product" }, function (err, data) {
    if (!err) {
      if (data) {
        res.send(data.products);
      } else {
        res.status(404).send("Data not found route is invalid");
      }
    } else {
      res.status(500).send(err);
    }
  });
});
router.get("/:productTitle", function (req, res) {
  const routeTitle = req.params.productTitle;
  productintro.findOne({ Title: "product" }, function (err, data) {
    if (!err) {
      if (data) {
        let array = data.products;
        for (let i = 0; i < array.length; i++) {
          if(array[i].Title===routeTitle){
            res.send(array[i]);
            break;
          }
        }
      } else {
        res.status(404).send("Data not found route is invalid");
      }
    } else {
      res.status(500).send(err);
    }
  });
});

router.delete("/:productTitle", function (req, res) {
  routeTitle = req.params.productTitle;
  productintro.findOne({ Title: "product" }, function (err,data) {
    if (!err && data) {
      // Find the index of the homecomponent with the given title
      const indexToRemove = data.products.findIndex(
        (component) => component.Title === routeTitle
      );
    
      if (indexToRemove !== -1) {
        // Remove the homecomponent from the array
        data.products.splice(indexToRemove, 1);
        // Save the updated Intro
        data.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            Product.deleteOne({ Title: routeTitle }, function (err) {
              if (err) {
                res
                  .status(500)
                  .send("deletion of product become unsuccessfull");
              }
              res.status(200).send("product deleted successfully.");
            });
          }
        });
      } else {
        res.status(404).send("Product not found in the specified Intro.");
      }
    } else {
      res.status(404).send("productintro not found.");
    }
  });
});

module.exports = router;
