const express = require("express");
const Cart = require("../models/cart.js");
const authenticateToken = require("../middleware/index.js");
const Product = require("../models/Product.js");

const router = express.Router();

// Route to add a product to the user's cart
// Route to update quantities of multiple products in the user's cart

router.post("/", authenticateToken, async (req, res) => {
    try {
        const cartUpdates = req.body;
        // If cartUpdates is not an array, assume it's a single product update
        if (!Array.isArray(cartUpdates) && cartUpdates !== null) {
            const productTitle = cartUpdates.Title;
            if (productTitle !== undefined) {
                // Handle single product update...
                // Find the product based on the productTitle
                const product = await Product.findOne({ Title: productTitle });

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
                const existingItem = userCart.items.find(
                    (item) => item.product === product.Title
                );

                if (existingItem) {
                    existingItem.quantity = existingItem.quantity + 1; // Update the quantity
                    existingItem.subtotal =
                        existingItem.quantity * existingItem.price; //update the price
                    userCart.markModified("items");
                } else {
                    userCart.items.push({
                        imgurl: product.imageUrl,
                        product: product.Title,
                        quantity: 1,
                        price: product.discountedPrice,
                        subtotal: product.discountedPrice * 1,
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
                const product = await Product.findOne({ Title: productTitle });

                if (!product) {
                    return res.status(404).json({
                        statusText: "Not Found",
                        message: `Product with Title ${productTitle} not found.`,
                    });
                }

                // Find the item in the cart
                const existingItem = userCart.items.find(
                    (item) => item.product === product.Title
                );

                if (existingItem) {
                    existingItem.quantity = quantity + 1; // Update the quantity
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

router.get("/", authenticateToken, async (req, res) => {
    try {
        // Get the authenticated user
        const user = req.user; // Assumes the user object is attached to the request by Passport

        // Find the user's cart
        const userCart = await Cart.findOne({ user: user._id });

        if (!userCart) {
            return res.status(200).json({
                statusText: "Success",
                cart: [],
                total: 0, // Add total property with initial value
            });
        }

        // Calculate the total sum of all subtotals
        const total = userCart.items.reduce(
            (acc, item) => acc + item.subtotal,
            0
        );

        // Return the user's cart data along with the total in JSON format
        res.status(200).json({
            statusText: "Success",
            cart: userCart.items,
            total: total,
        });
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).send("An unexpected error occurred.");
    }
});

// Add a PATCH route to remove a product from the user's cart
router.patch("/", authenticateToken, async (req, res) => {
    try {
        const { Title } = req.body;

        // Get the authenticated user
        const user = req.user;

        // Find the user's cart
        let userCart = await Cart.findOne({ user: user._id });

        if (!userCart) {
            return res.status(404).json({
                statusText: "Not Found",
                message: "Cart not found for the user.",
            });
        }

        // Find the index of the item to remove in the cart's items array
        const indexToRemove = userCart.items.findIndex(
            (item) => item.product === Title
        );

        if (indexToRemove === -1) {
            return res.status(404).json({
                statusText: "Not Found",
                message: `Product with Title ${Title} not found in the cart.`,
            });
        }

        // Remove the item from the cart
        userCart.items.splice(indexToRemove, 1);

        await userCart.save();

        res.status(200).json({
            statusText: "Success",
            message: "Product removed from the cart.",
        });
    } catch (err) {
        console.error("Error removing product from cart:", err);
        res.status(500).send("An unexpected error occurred.");
    }
});

module.exports = router;
