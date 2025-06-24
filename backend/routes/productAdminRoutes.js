const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/products
//@desc Get all products for admin
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});

//@route PUT /api/admin/products/:id
//@desc Update a product
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product fields
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.sku = req.body.sku || product.sku;
        product.category = req.body.category || product.category;
        product.images = req.body.images || product.images;
        product.sizes = req.body.sizes || product.sizes;
        product.flavors = req.body.flavors || product.flavors;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route DELETE /api/admin/products/:id
//@desc Delete a product
//@access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        res.json({ message: "Product removed successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route POST /api/admin/products
//@desc Create a new product
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            sku,
            category,
            images,
            sizes,
            flavors,
            countInStock
        } = req.body;

        console.log("Creating product with data:", req.body);

        const product = new Product({
            name,
            description,
            price,
            sku,
            category: category || "Bánh ngọt", // Default category if not provided
            images: images || [],
            sizes: sizes || [],
            flavors: flavors || [],
            countInStock: countInStock || 10, // Default stock
            user: req.user._id, // Set the admin user as creator
            isPublished: true // Make it published by default
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        console.error("Error details:", error.message);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

module.exports = router;