const express = require("express");
const carousel = require("../models/carousel");

const router = express.Router();

// Get all carousel items
router.get("/", async (req, res) => {
    try {
        const allCarouselItems = await carousel.find();
        res.json({ success: true, carouselItems: allCarouselItems });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Create a new carousel item
router.post("/", async (req, res) => {
    try {
        const title = req.body.title;
        const imageUrl = req.body.imageUrl;
        const description = req.body.description;

        const existingCarousel = await carousel.findOne({ Title: title });

        if (existingCarousel) {
            res.json({ success: false, message: "Carousel item already exists" });
        } else {
            const newCarousel = new carousel({ Title: title, imageUrl, Description: description });
            await newCarousel.save();
            res.json({ success: true, message: "Carousel item added successfully" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Delete carousel item by Title
router.delete("/:carouselTitle", async (req, res) => {
    try {
        const carouselTitle = req.params.carouselTitle;
        const deletedCarousel = await carousel.findOneAndDelete({ Title: carouselTitle });

        if (!deletedCarousel) {
            res.status(404).json({ success: false, message: "Carousel item not found" });
        } else {
            res.json({ success: true, message: "Carousel item deleted successfully" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;

