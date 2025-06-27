const express = require("express");
const Product = require("../models/Product");
const { protect, adminOrManager } = require("../middleware/authMiddleware");

const router = express.Router();

// Hàm helper để tự động tạo sizePricing
const generateSizePricing = (sizes, basePrice) => {
    if (!sizes || sizes.length === 0) {
        return [];
    }

    // Hàm xác định increment cho từng loại size
    const getSizeIncrement = (size) => {
        const sizeStr = size.toLowerCase();
        
        // Size nhỏ, vừa, lớn - cách nhau 10,000
        if (sizeStr.includes('nhỏ') || sizeStr.includes('vừa') || sizeStr.includes('lớn')) {
            return 10000;
        }
        
        // Size S, M, L - cách nhau 5,000
        if (sizeStr === 's' || sizeStr === 'm' || sizeStr === 'l' || 
            sizeStr === 'size s' || sizeStr === 'size m' || sizeStr === 'size l') {
            return 5000;
        }
        
        // Các size khác (18cm, 20cm, 22cm...) - cách nhau 50,000
        return 50000;
    };

    const increment = getSizeIncrement(sizes[0]);
    const sizePricing = [];

    sizes.forEach((size, index) => {
        sizePricing.push({
            size: size,
            price: basePrice + (index * increment),
            discountPrice: basePrice + (index * increment)
        });
    });

    return sizePricing;
};

//@route GET /api/admin/products
//@desc Get all products for admin/manager
//@access Private/Admin or Manager
router.get("/", protect, adminOrManager, async (req, res) => {
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
//@access Private/Admin or Manager
router.put("/:id", protect, adminOrManager, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("🔄 Updating product:", req.params.id);
        console.log("📦 Request body:", req.body);

        // Update product fields
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.sku = req.body.sku || product.sku;
        product.category = req.body.category || product.category;
        product.status = req.body.status || product.status;
        product.images = req.body.images || product.images;
        product.sizes = req.body.sizes || product.sizes;
        product.flavors = req.body.flavors || product.flavors;

        // Cập nhật sizePricing nếu có trong request hoặc tự động tạo
        if (req.body.sizePricing) {
            product.sizePricing = req.body.sizePricing;
            console.log("✅ Updated sizePricing from request");
        } else if (product.sizes && product.sizes.length > 0 && 
                   (!product.sizePricing || product.sizePricing.length === 0)) {
            const basePrice = req.body.discountPrice || req.body.price || product.discountPrice || product.price;
            product.sizePricing = generateSizePricing(product.sizes, basePrice);
            console.log(`✅ Auto-generated sizePricing for: ${product.name}`);
            console.log(`   Prices: ${product.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
        }

        const updatedProduct = await product.save();
        console.log(`✅ Product updated successfully: ${updatedProduct.name}, Status: ${updatedProduct.status}`);
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route DELETE /api/admin/products/:id
//@desc Delete a product
//@access Private/Admin or Manager
router.delete("/:id", protect, adminOrManager, async (req, res) => {
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
//@access Private/Admin or Manager
router.post("/", protect, adminOrManager, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            sku,
            category,
            status,
            images,
            sizes,
            flavors,
            discountPrice
        } = req.body;

        console.log("Creating product with data:", req.body);

        const product = new Product({
            name,
            description,
            price,
            sku,
            category: category || "Bánh ngọt", // Default category if not provided
            status: status || "active", // Default status
            images: images || [],
            sizes: sizes || [],
            flavors: flavors || [],
            user: req.user._id, // Set the admin user as creator
            isPublished: true, // Make it published by default
            discountPrice: discountPrice || price
        });

        // Tự động tạo sizePricing nếu có sizes
        if (sizes && sizes.length > 0) {
            const basePrice = discountPrice || price;
            product.sizePricing = generateSizePricing(sizes, basePrice);
            console.log(`✅ Auto-generated sizePricing for new product: ${name}`);
            console.log(`   Prices: ${product.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
        }

        const createdProduct = await product.save();
        console.log(`✅ Product created successfully: ${createdProduct.name}, Status: ${createdProduct.status}`);
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