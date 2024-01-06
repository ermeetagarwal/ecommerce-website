const express = require("express");
const productintro = require("../models/productintro.js");
const Product = require("../models/Product.js");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const Title = req.body.Title;
    const imageUrl = req.body.imageUrl;
    const basePrice = req.body.basePrice;
    const discountPer = req.body.discountPer;
    const quantity = req.body.quantity;
    const unit = req.body.unit;
    const category = req.body.category;
    const description = req.body.description;
    const status = req.body.status;
    const tags = req.body.tags || []; // Assuming tags are passed as an array in the request body
    let discountedPrice;
    if (basePrice !== null && discountPer !== null) {
      discountedPrice = basePrice - basePrice * (discountPer / 100);
      // Convert discountedPrice to an integer
      discountedPrice = parseInt(discountedPrice);
  } else {
      discountedPrice = req.body.discountedPrice;
    }
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
        discountedPrice: discountedPrice,
        tags: tags,
      });
      const newintro = new productintro({
        Title: "product",
        products: newproduct,
      });

      await newproduct.save();
      await newintro.save();

      res.send("Success");
    } else {
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
        discountedPrice: discountedPrice,
        tags: tags,
      });
      await newproduct.save();
      existingIntro.products.push(newproduct);
      await existingIntro.save();
      res.send("success");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await productintro.findOne({ Title: "product" });

    if (data) {
      res.send(data.products);
    } else {
      res.status(404).send("Data not found, route is invalid");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});
router.get("/:productTitle", async (req, res) => {
  try {
    const routeTitle = req.params.productTitle;
    const data = await productintro.findOne({ Title: "product" });

    if (data) {
      const array = data.products;

      for (let i = 0; i < array.length; i++) {
        if (array[i].Title === routeTitle) {
          res.send(array[i]);
          return;
        }
      }
      res.status(404).send("Product not found in the specified route.");
    } else {
      res.status(404).send("Data not found, route is invalid");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

router.delete("/:productTitle", async (req, res) => {
  try {
    const routeTitle = req.params.productTitle;
    const data = await productintro.findOne({ Title: "product" });
    if (data) {
      const indexToRemove = data.products.findIndex(
        (component) => component.Title === routeTitle
      );
      if (indexToRemove !== -1) {
        data.products.splice(indexToRemove, 1);
        try {
          await data.save();
          await Product.deleteOne({ Title: routeTitle });
          res.status(200).send("Product deleted successfully.");
        } catch (err) {
          res.status(500).send("Deletion of product was unsuccessful.");
        }
      } else {
        res.status(404).send("Product not found in the specified Intro.");
      }
    } else {
      res.status(404).send("productintro not found.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

router.patch("/:productTitle", async (req, res) => {
  try {
    const routeTitle = req.params.productTitle;
    const data = await productintro.findOne({ Title: "product" });
    if (data) {
      const array = data.products;
      const existingProduct = array.find(
        (product) => product.Title === routeTitle
      );
      const replacementProduct = {
        Title: routeTitle,
        imageUrl: req.body.imageUrl || existingProduct.imageUrl,
        basePrice: req.body.basePrice || existingProduct.basePrice,
        discountPer: req.body.discountPer || existingProduct.discountPer,
        quantity: req.body.quantity || existingProduct.quantity,
        unit: req.body.unit || existingProduct.unit,
        category: req.body.category || existingProduct.category,
        description: req.body.description || existingProduct.description,
        status: req.body.status || existingProduct.status,
        tags: req.body.tags || existingProduct.tags, // Update tags
        discountedPrice:
          req.body.discountedPrice || existingProduct.discountedPrice,
      };
      const searchIndex = array.findIndex(
        (product) => product.Title === routeTitle
      );
      if (searchIndex === -1) {
        return res.status(404).send("Product not found.");
      }
      try {
        array[searchIndex] = replacementProduct;
        await data.save(); // Save the updated document
        res.send(replacementProduct);
      } catch (err) {
        console.error("Update error:", err);
        return res
          .status(500)
          .send("Error occurred while updating the product.");
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});
module.exports = router;
