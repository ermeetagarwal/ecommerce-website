import express from "express";
import passport from "passport";
import User from "../models/user";
import Cart from "../models/cart";
import ensureAuthenticated from "../middleware";

const router = express.Router();

// Route to add a product to the user's cart
// Route to update quantities of multiple products in the user's cart
router.post("/cart", ensureAuthenticated, async (req, res) => {
  try {
    const cartUpdates = req.body;

    // If cartUpdates is not an array, assume it's a single product update
    if (!Array.isArray(cartUpdates)) {
      if (productTitle && quantity !== undefined) {
        // Handle single product update...
        const { productTitle, quantity } = cartUpdates;

        // Find the product based on the productTitle
        const product = await Product.findOne({Title:productTitle});

        // Get the authenticated user
        const user = req.user; // Assumes the user object is attached to the request by Passport

        // Find or create a cart for the user
        let userCart = await Cart.findOne({ user: user._id });

        if (!userCart) {
          userCart = new Cart({
            user: user._id,
            items: [],
          });
        }

        // Find the item in the cart
        const existingItem = userCart.items.find((item) =>
          item.product.equals(product.Title)
        );

        if (existingItem) {
          existingItem.quantity = quantity+1; // Update the quantity
        } else {
          userCart.items.push({
            product: product._id,
            quantity: quantity,
          });
        }
        await userCart.save();

        res.status(200).json({
          statusText: "Success",
          message: "Cart updated.",
        });
      } else {
        return res.status(400).json({
          statusText: "Bad Request",
          message: "Invalid product update data.",
        });
      }
    } else {
      // Handle multiple product updates...
      const cartUpdates = req.body;

      // Get the authenticated user
      const user = req.user; // Assumes the user object is attached to the request by Passport

      // Find or create a cart for the user
      let userCart = await Cart.findOne({ user: user._id });

      if (!userCart) {
        userCart = new Cart({
          user: user._id,
          items: [],
        });
      }

      for (const update of cartUpdates) {
        const { productTitle, quantity } = update;

        // Find the product based on the productTitle
        const product = await Product.findOne({Title:productTitle});

        if (!product) {
          return res.status(404).json({
            statusText: "Not Found",
            message: `Product with Title ${productTitle} not found.`,
          });
        }

        // Find the item in the cart
        const existingItem = userCart.items.find((item) =>
          item.product.equals(product.Title)
        );

        if (existingItem) {
          existingItem.quantity = quantity+1; // Update the quantity
        } else {
          userCart.items.push({
            product: product._id,
            quantity: quantity,
          });
        }
      }

      await userCart.save();

      res.status(200).json({
        statusText: "Success",
        message: "Cart updated.",
      });
    }
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).send("An unexpected error occurred.");
  }
});

export default router;
