const express = require('express');
const Product = require('../models/Product');
const {protect , admin} = require('../middleware/authMiddleware');

const router = express.Router();

//@route POST /api/products
//@desc Create a new product
//@access Private (Admin)

router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            sizes,
            flavors,
            images,
            isFeatured,
            isPublished
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            sizes,
            flavors,
            images,
            isFeatured,
            isPublished,
            user: req.user._id // id của admin người tạo sản phẩm
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error){
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;