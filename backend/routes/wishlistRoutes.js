const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/authMiddleware');

// Lấy danh sách wishlist của user
router.get('/', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.json({ items: [] });
    }

    // Populate từng loại sản phẩm riêng biệt
    const populatedItems = [];
    
    for (const item of wishlist.items) {
      try {
        let product;
        if (item.itemType === 'Product') {
          product = await Product.findById(item.productId).select('name price discountPrice images category status sku quantity description');
        } else if (item.itemType === 'Ingredient') {
          product = await Ingredient.findById(item.productId).select('name price discountPrice images category status sku quantity description');
        }
        
        if (product) {
          populatedItems.push({
            ...item.toObject(),
            productId: product
          });
        }
      } catch (error) {
        console.error('Error populating item:', error);
        // Bỏ qua item này nếu có lỗi
      }
    }

    const result = {
      ...wishlist.toObject(),
      items: populatedItems
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm sản phẩm vào wishlist
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, itemType } = req.body;

    if (!productId || !itemType) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
    }

    // Kiểm tra sản phẩm tồn tại
    let product;
    if (itemType === 'Product') {
      product = await Product.findById(productId);
    } else if (itemType === 'Ingredient') {
      product = await Ingredient.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Tìm hoặc tạo wishlist cho user
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        items: []
      });
    }

    // Kiểm tra sản phẩm đã có trong wishlist chưa
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId && item.itemType === itemType
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }

    // Thêm sản phẩm vào wishlist
    wishlist.items.push({
      productId,
      itemType,
      addedAt: new Date()
    });

    await wishlist.save();

    res.status(201).json({ 
      message: 'Đã thêm vào danh sách yêu thích',
      wishlist 
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa sản phẩm khỏi wishlist
router.delete('/remove', protect, async (req, res) => {
  try {
    const { productId, itemType } = req.body;

    if (!productId || !itemType) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Không tìm thấy danh sách yêu thích' });
    }

    // Xóa item khỏi wishlist
    wishlist.items = wishlist.items.filter(
      item => !(item.productId.toString() === productId && item.itemType === itemType)
    );

    await wishlist.save();

    res.json({ 
      message: 'Đã xóa khỏi danh sách yêu thích',
      wishlist 
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Kiểm tra sản phẩm có trong wishlist không
router.get('/check/:productId/:itemType', protect, async (req, res) => {
  try {
    const { productId, itemType } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.json({ isInWishlist: false });
    }

    const isInWishlist = wishlist.items.some(
      item => item.productId.toString() === productId && item.itemType === itemType
    );

    res.json({ isInWishlist });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa tất cả sản phẩm khỏi wishlist
router.delete('/clear', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Không tìm thấy danh sách yêu thích' });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({ message: 'Đã xóa tất cả sản phẩm khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router; 