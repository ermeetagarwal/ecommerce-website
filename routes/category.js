const express = require("express");
const category = require("../models/category");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const category_title = req.body.category;
        const img = req.body.img;
        const tag = req.body.tag;

        const existingCategory = await category.findOne({ category_title });

        if (existingCategory) {
            res.json({ success: false, message: "Category already exists" });
        } else {
            const newCategory = new category({ category_title, img, tag });
            await newCategory.save();
            res.json({ success: true, message: "Category added successfully" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const allCategories = await category.find();
        res.json({ success: true, categories: allCategories });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Delete category by category_title
router.delete("/:categoryTitle", async (req, res) => {
    try {
        const categoryTitle = req.params.categoryTitle;
        const deletedCategory = await category.findOneAndDelete({ category_title: categoryTitle });

        if (!deletedCategory) {
            res.status(404).json({ success: false, message: "Category not found" });
        } else {
            res.json({ success: true, message: "Category deleted successfully" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
