const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all ingredients (Admin only)
// @route   GET /api/admin/ingredients
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Search by name or description
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Stock filter
    if (req.query.stock === 'out') {
      filter.quantity = 0;
    } else if (req.query.stock === 'low') {
      filter.quantity = { $lte: 10, $gt: 0 };
    }
    
    // Sort options
    let sortOption = {};
    switch (req.query.sort) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'price':
        sortOption = { price: 1 };
        break;
      case 'quantity':
        sortOption = { quantity: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { name: 1 };
    }
    
    const total = await Ingredient.countDocuments(filter);
    const ingredients = await Ingredient.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
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
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải danh sách nguyên liệu'
    });
  }
});

// @desc    Get ingredient categories and stats (Admin only)
// @route   GET /api/admin/ingredients/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const stats = await Ingredient.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] }
          },
          lowStock: {
            $sum: { $cond: [{ $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', 10] }] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const totalIngredients = await Ingredient.countDocuments();
    const totalOutOfStock = await Ingredient.countDocuments({ quantity: 0 });
    const totalLowStock = await Ingredient.countDocuments({ quantity: { $lte: 10, $gt: 0 } });

    res.json({
      success: true,
      data: {
        categoriesStats: stats,
        totalIngredients,
        totalOutOfStock,
        totalLowStock
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

// @desc    Get ingredient by ID (Admin only)
// @route   GET /api/admin/ingredients/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    
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
    console.error('Error fetching ingredient:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải thông tin nguyên liệu'
    });
  }
});

// @desc    Create new ingredient (Admin only)
// @route   POST /api/admin/ingredients
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      quantity,
      unit,
      sku,
      images,
      supplier,
      notes
    } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existingSku = await Ingredient.findOne({ sku: sku.toUpperCase() });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: 'Mã sản phẩm (SKU) đã tồn tại'
        });
      }
    }

    const ingredient = new Ingredient({
      name,
      description,
      category,
      price,
      discountPrice: discountPrice || 0,
      quantity,
      unit,
      sku,
      images: images || [],
      supplier: supplier || '',
      notes: notes || ''
    });

    const savedIngredient = await ingredient.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo nguyên liệu thành công',
      data: savedIngredient
    });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã sản phẩm (SKU) đã tồn tại'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo nguyên liệu'
    });
  }
});

// @desc    Update ingredient (Admin only)
// @route   PUT /api/admin/ingredients/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nguyên liệu'
      });
    }

    // Check if SKU is being changed and already exists
    if (req.body.sku && req.body.sku !== ingredient.sku) {
      const existingSku = await Ingredient.findOne({ 
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: 'Mã sản phẩm (SKU) đã tồn tại'
        });
      }
    }

    // Update fields
    const updateFields = [
      'name', 'description', 'category', 'price', 'discountPrice',
      'quantity', 'unit', 'sku', 'images', 'status', 'supplier', 'notes'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ingredient[field] = req.body[field];
      }
    });

    const updatedIngredient = await ingredient.save();
    
    res.json({
      success: true,
      message: 'Cập nhật nguyên liệu thành công',
      data: updatedIngredient
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật nguyên liệu'
    });
  }
});

// @desc    Delete ingredient (Admin only)
// @route   DELETE /api/admin/ingredients/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nguyên liệu'
      });
    }

    await Ingredient.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa nguyên liệu thành công'
    });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa nguyên liệu'
    });
  }
});

module.exports = router; 