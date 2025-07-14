const express = require('express');
const router = express.Router();
const FlashSale = require('../models/FlashSale');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const { protect, admin, adminOrManager, manager } = require('../middleware/authMiddleware');

// @desc    Tạo flash sale mới
// @route   POST /api/flash-sales
// @access  Admin, Manager
router.post('/', protect, adminOrManager, async (req, res) => {
  try {
    console.log('📥 Flash Sale Request Body:', req.body);
    
    const {
      name,
      description,
      startDate,
      endDate,
      discountType,
      discountValue,
      products,
      ingredients
    } = req.body;

    // Validate dữ liệu
    if (!name || !startDate || !endDate || !discountType || discountValue === undefined || discountValue === null) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
    }

    if (discountValue <= 0) {
      return res.status(400).json({ message: 'Giá trị giảm giá phải lớn hơn 0' });
    }

    // Validate discountType
    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({ message: 'Loại giảm giá không hợp lệ' });
    }

    // Validate products và ingredients
    const flashSaleProducts = [];
    const flashSaleIngredients = [];

    if (products && products.length > 0) {
      for (const product of products) {
        const productDoc = await Product.findById(product.productId);
        if (!productDoc) {
          return res.status(400).json({ message: `Sản phẩm ${product.productId} không tồn tại` });
        }

        const salePrice = discountType === 'percentage' 
          ? productDoc.price * (1 - discountValue / 100)
          : Math.max(0, productDoc.price - discountValue);

        flashSaleProducts.push({
          productId: product.productId,
          originalPrice: productDoc.price,
          salePrice: Math.round(salePrice),
          quantity: product.quantity || productDoc.countInStock,
          soldQuantity: 0
        });
      }
    }

    if (ingredients && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        const ingredientDoc = await Ingredient.findById(ingredient.ingredientId);
        if (!ingredientDoc) {
          return res.status(400).json({ message: `Nguyên liệu ${ingredient.ingredientId} không tồn tại` });
        }

        const salePrice = discountType === 'percentage' 
          ? ingredientDoc.price * (1 - discountValue / 100)
          : Math.max(0, ingredientDoc.price - discountValue);

        flashSaleIngredients.push({
          ingredientId: ingredient.ingredientId,
          originalPrice: ingredientDoc.price,
          salePrice: Math.round(salePrice),
          quantity: ingredient.quantity || ingredientDoc.quantity,
          soldQuantity: 0
        });
      }
    }

    const flashSale = new FlashSale({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      discountType,
      discountValue,
      products: flashSaleProducts,
      ingredients: flashSaleIngredients,
      createdBy: req.user._id
    });

    const savedFlashSale = await flashSale.save();

    res.status(201).json({
      message: 'Flash sale đã được tạo thành công!',
      flashSale: savedFlashSale
    });

  } catch (error) {
    console.error('❌ Lỗi tạo flash sale:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo flash sale' });
  }
});

// @desc    Lấy danh sách tất cả flash sales
// @route   GET /api/flash-sales
// @access  Admin, Manager
router.get('/', protect, adminOrManager, async (req, res) => {
  try {
    const flashSales = await FlashSale.find({})
      .populate('products.productId', 'name price images')
      .populate('ingredients.ingredientId', 'name price images')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(flashSales);
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách flash sales:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách flash sales' });
  }
});

// @desc    Lấy danh sách sản phẩm và nguyên liệu để chọn cho flash sale
// @route   GET /api/flash-sales/items/available
// @access  Admin, Manager
router.get('/items/available', protect, adminOrManager, async (req, res) => {
  try {
    const { search, category, type } = req.query;
    console.log('🔍 Flash Sale Items Query:', { search, category, type });
    
    let products = [];
    let ingredients = [];

    // Lấy sản phẩm
    if (!type || type === 'products') {
      let productQuery = {};
      
      if (search) {
        productQuery.name = { $regex: search, $options: 'i' };
      }
      
      if (category) {
        productQuery.category = category;
      }

      console.log('📦 Product Query:', productQuery);
      products = await Product.find(productQuery)
        .select('name price images category countInStock sku')
        .sort({ name: 1 });
      console.log('📦 Found Products:', products.length);
    }

    // Lấy nguyên liệu
    if (!type || type === 'ingredients') {
      let ingredientQuery = {};
      
      if (search) {
        ingredientQuery.name = { $regex: search, $options: 'i' };
      }
      
      if (category) {
        ingredientQuery.category = category;
      }

      console.log('🥘 Ingredient Query:', ingredientQuery);
      ingredients = await Ingredient.find(ingredientQuery)
        .select('name price images category quantity sku')
        .sort({ name: 1 });
      console.log('🥘 Found Ingredients:', ingredients.length);
    }

    res.json({
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        images: p.images,
        category: p.category,
        stock: p.countInStock,
        sku: p.sku,
        type: 'product'
      })),
      ingredients: ingredients.map(i => ({
        _id: i._id,
        name: i.name,
        price: i.price,
        images: i.images,
        category: i.category,
        stock: i.quantity,
        sku: i.sku,
        type: 'ingredient'
      }))
    });
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách items:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách items' });
  }
});

// @desc    Lấy flash sales đang hoạt động (cho frontend)
// @route   GET /api/flash-sales/active
// @access  Public
router.get('/active/active', async (req, res) => {
  try {
    const now = new Date();
    const activeFlashSales = await FlashSale.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active',
      isActive: true
    }).populate('products.productId', 'name price images category')
      .populate('ingredients.ingredientId', 'name price images category');

    res.json(activeFlashSales);
  } catch (error) {
    console.error('❌ Lỗi lấy active flash sales:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy active flash sales' });
  }
});

// @desc    Lấy flash sale theo ID
// @route   GET /api/flash-sales/:id
// @access  Admin, Manager
router.get('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id)
      .populate('products.productId', 'name price images category')
      .populate('ingredients.ingredientId', 'name price images category')
      .populate('createdBy', 'name email');

    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    res.json(flashSale);
  } catch (error) {
    console.error('❌ Lỗi lấy flash sale:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin flash sale' });
  }
});

// @desc    Cập nhật flash sale
// @route   PUT /api/flash-sales/:id
// @access  Admin, Manager
router.put('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    const updatedFlashSale = await FlashSale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('products.productId', 'name price images')
     .populate('ingredients.ingredientId', 'name price images')
     .populate('createdBy', 'name email');

    res.json({
      message: 'Flash sale đã được cập nhật thành công!',
      flashSale: updatedFlashSale
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật flash sale:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật flash sale' });
  }
});

// @desc    Xóa flash sale
// @route   DELETE /api/flash-sales/:id
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    await FlashSale.findByIdAndDelete(req.params.id);

    res.json({ message: 'Flash sale đã được xóa thành công!' });
  } catch (error) {
    console.error('❌ Lỗi xóa flash sale:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa flash sale' });
  }
});

module.exports = router; 