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
        const { Title, Title2, imageUrl_desk, imageUrl_mob, description } = req.body;

        if (!Title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const existingCarousel = await carousel.findOne({ Title });

        if (existingCarousel) {
            return res.json({ success: false, message: "Carousel item already exists" });
        } else {
            const newCarousel = new carousel({ Title, Title2, imageUrl_desk, imageUrl_mob, Description: description });
            await newCarousel.save();
            return res.json({ success: true, message: "Carousel item added successfully" });
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
// Partially update carousel item by Title
router.patch("/:carouselTitle", async (req, res) => {
    try {
        const carouselTitle = req.params.carouselTitle;
        const { title,title2, imageUrl_desk, imageUrl_mob, description } = req.body;

        const updatedCarousel = await carousel.findOneAndUpdate(
            { Title: carouselTitle },
            { $set: { Title: title,Title2:title2 ,imageUrl_desk, imageUrl_mob, Description: description } },
            { new: true }
        );

        if (!updatedCarousel) {
            res.status(404).json({ success: false, message: "Carousel item not found" });
        } else {
            res.json({ success: true, message: "Carousel item partially updated successfully", updatedCarousel });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;

