const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// @desc    Get all active ingredients with filters (Public)
// @route   GET /api/ingredients
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { status: 'active' }; // Chỉ hiển thị nguyên liệu đang bán
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Search by name or description
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Stock filter
    if (req.query.stock === 'available') {
      filter.quantity = { $gt: 0 };
    } else if (req.query.stock === 'out') {
      filter.quantity = 0;
    }
    
    // Sort options
    let sortOption = {};
    switch (req.query.sort) {
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { name: 1 };
    }
    
    const total = await Ingredient.countDocuments(filter);
    const ingredients = await Ingredient.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select('name description category price discountPrice quantity unit images createdAt');
    
    res.json({
      success: true,
      data: ingredients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải danh sách nguyên liệu'
    });
  }
});

// @desc    Get ingredient categories (Public)
// @route   GET /api/ingredients/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Ingredient.distinct('category', { status: 'active' });
    
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error fetching ingredient categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải danh mục nguyên liệu'
    });
  }
});

// @desc    Get ingredient stats (Public)
// @route   GET /api/ingredients/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalIngredients = await Ingredient.countDocuments({ status: 'active' });
    const totalOutOfStock = await Ingredient.countDocuments({ status: 'active', quantity: 0 });
    const categoriesCount = await Ingredient.distinct('category', { status: 'active' });

    res.json({
      success: true,
      data: {
        totalIngredients,
        totalOutOfStock,
        totalCategories: categoriesCount.length
      }
    });
  } catch (error) {
    console.error('Error fetching ingredient stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải thống kê nguyên liệu'
    });
  }
});

// @desc    Get single ingredient by ID (Public)
// @route   GET /api/ingredients/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ 
      _id: req.params.id, 
      status: 'active' 
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nguyên liệu'
      });
    }

    res.json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    console.error('Error fetching ingredient details:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'ID nguyên liệu không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải chi tiết nguyên liệu'
    });
  }
});

// API lấy nhiều nguyên liệu theo mảng id
router.post('/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'Thiếu ids' });
    const ingredients = await Ingredient.find({ _id: { $in: ids } }, '_id price name');
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router; 