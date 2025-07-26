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

    // Kiểm tra sản phẩm đã có flash sale
    const conflictingProducts = [];
    const conflictingIngredients = [];

    if (products && products.length > 0) {
      for (const product of products) {
        // Kiểm tra flash sale hiện tại hoặc sắp diễn ra
        const existingFlashSale = await FlashSale.findOne({
          'products.productId': product.productId,
          $or: [
            { status: 'active' },
            { 
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            }
          ]
        });

        if (existingFlashSale) {
          const productDoc = await Product.findById(product.productId);
          conflictingProducts.push({
            id: product.productId,
            name: productDoc?.name || 'Unknown Product',
            flashSaleName: existingFlashSale.name,
            startDate: existingFlashSale.startDate,
            endDate: existingFlashSale.endDate
          });
        }
      }
    }

    if (ingredients && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        // Kiểm tra flash sale hiện tại hoặc sắp diễn ra
        const existingFlashSale = await FlashSale.findOne({
          'ingredients.ingredientId': ingredient.ingredientId,
          $or: [
            { status: 'active' },
            { 
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            }
          ]
        });

        if (existingFlashSale) {
          const ingredientDoc = await Ingredient.findById(ingredient.ingredientId);
          conflictingIngredients.push({
            id: ingredient.ingredientId,
            name: ingredientDoc?.name || 'Unknown Ingredient',
            flashSaleName: existingFlashSale.name,
            startDate: existingFlashSale.startDate,
            endDate: existingFlashSale.endDate
          });
        }
      }
    }

    // Nếu có xung đột, trả về lỗi
    if (conflictingProducts.length > 0 || conflictingIngredients.length > 0) {
      return res.status(400).json({
        message: 'Một số sản phẩm/nguyên liệu đã có flash sale trong khoảng thời gian này',
        conflictingProducts,
        conflictingIngredients
      });
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

    console.log('📅 Flash Sale Date Debug:', {
      startDate,
      endDate,
      parsedStartDate: new Date(startDate),
      parsedEndDate: new Date(endDate),
      startDateISO: new Date(startDate).toISOString(),
      endDateISO: new Date(endDate).toISOString(),
      serverTime: new Date().toISOString()
    });

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
    console.log('✅ Flash Sale created successfully:', savedFlashSale._id);

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
    const { search, category, type, startDate, endDate } = req.query;
    console.log('🔍 Flash Sale Items Query:', { search, category, type, startDate, endDate });
    
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

      // Lọc sản phẩm đã có flash sale nếu có thời gian
      if (startDate && endDate) {
        const conflictingFlashSales = await FlashSale.find({
          $or: [
            { status: 'active' },
            { 
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            }
          ]
        });

        const conflictingProductIds = conflictingFlashSales.flatMap(fs => 
          fs.products.map(p => p.productId.toString())
        );

        products = products.filter(product => 
          !conflictingProductIds.includes(product._id.toString())
        );

        console.log('📦 Products after filtering conflicts:', products.length);
      }
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

      // Lọc nguyên liệu đã có flash sale nếu có thời gian
      if (startDate && endDate) {
        const conflictingFlashSales = await FlashSale.find({
          $or: [
            { status: 'active' },
            { 
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            }
          ]
        });

        const conflictingIngredientIds = conflictingFlashSales.flatMap(fs => 
          fs.ingredients.map(i => i.ingredientId.toString())
        );

        ingredients = ingredients.filter(ingredient => 
          !conflictingIngredientIds.includes(ingredient._id.toString())
        );

        console.log('🥘 Ingredients after filtering conflicts:', ingredients.length);
      }
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
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    
    // Cập nhật status cho tất cả flash sales trước khi query
    await FlashSale.updateMany(
      { endDate: { $lt: now } },
      { status: 'expired' }
    );
    
    await FlashSale.updateMany(
      { 
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      { status: 'active' }
    );
    
    const activeFlashSales = await FlashSale.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active',
      isActive: true
    }).populate('products.productId', 'name price images category')
      .populate('ingredients.ingredientId', 'name price images category');

    console.log('🔥 Active Flash Sales found:', activeFlashSales.length);
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

// @desc    Cập nhật sold quantity cho flash sale
// @route   PUT /api/flash-sales/:id/update-sold
// @access  Public
router.put('/:id/update-sold', async (req, res) => {
  try {
    const { productId, ingredientId, quantity } = req.body;
    const flashSale = await FlashSale.findById(req.params.id);
    
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    // Cập nhật sold quantity cho sản phẩm
    if (productId && flashSale.products) {
      const productIndex = flashSale.products.findIndex(p => 
        p.productId.toString() === productId
      );
      
      if (productIndex !== -1) {
        flashSale.products[productIndex].soldQuantity += quantity;
      }
    }

    // Cập nhật sold quantity cho nguyên liệu
    if (ingredientId && flashSale.ingredients) {
      const ingredientIndex = flashSale.ingredients.findIndex(i => 
        i.ingredientId.toString() === ingredientId
      );
      
      if (ingredientIndex !== -1) {
        flashSale.ingredients[ingredientIndex].soldQuantity += quantity;
      }
    }

    await flashSale.save();
    
    res.json({
      message: 'Đã cập nhật sold quantity thành công',
      flashSale
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật sold quantity:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật sold quantity' });
  }
});

// @desc    Xóa sản phẩm flash sale khỏi giỏ hàng khi flash sale kết thúc
// @route   POST /api/flash-sales/:id/cleanup-cart
// @access  Private
router.post('/:id/cleanup-cart', async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    const Cart = require('../models/Cart');
    
    // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
    const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
    const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

    console.log('🔍 Flash Sale Products:', flashSaleProductIds);
    console.log('🔍 Flash Sale Ingredients:', flashSaleIngredientIds);

    // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
    const cartsWithFlashSaleItems = await Cart.find({
      'products.productId': { 
        $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
      }
    });

    console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

    let cleanedCarts = 0;
    let removedItems = 0;

    for (const cart of cartsWithFlashSaleItems) {
      let cartUpdated = false;
      
      // Lọc ra các item không phải flash sale
      const originalProducts = [...cart.products];
      cart.products = cart.products.filter(item => {
        const itemProductId = item.productId.toString();
        const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
        const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
        
        if (isFlashSaleProduct || isFlashSaleIngredient) {
          console.log(`🗑️ Removing item: ${item.name} (${itemProductId}) from cart ${cart._id}`);
          removedItems++;
          cartUpdated = true;
          return false;
        }
        return true;
      });

      // Cập nhật tổng giá
      if (cartUpdated) {
        cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        cleanedCarts++;
        console.log(`✅ Updated cart ${cart._id}: removed ${originalProducts.length - cart.products.length} items`);
      }
    }

    console.log(`🧹 Cleanup completed: ${cleanedCarts} carts, ${removedItems} items`);

    res.json({
      message: 'Đã xóa sản phẩm flash sale khỏi giỏ hàng',
      cleanedCarts,
      removedItems,
      flashSaleName: flashSale.name
    });

  } catch (error) {
    console.error('❌ Lỗi cleanup cart:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa sản phẩm flash sale khỏi giỏ hàng' });
  }
});

// @desc    Cleanup tất cả flash sale đã kết thúc
// @route   POST /api/flash-sales/cleanup-expired
// @access  Private
router.post('/cleanup-expired', async (req, res) => {
  try {
    const now = new Date();
    
    // Tìm tất cả flash sale đã kết thúc
    const expiredFlashSales = await FlashSale.find({
      endDate: { $lt: now },
      status: { $ne: 'expired' }
    });

    console.log(`🕐 Found ${expiredFlashSales.length} expired flash sales`);

    let totalCleanedCarts = 0;
    let totalRemovedItems = 0;

    for (const flashSale of expiredFlashSales) {
      console.log(`🔄 Processing expired flash sale: ${flashSale.name}`);
      
      // Cập nhật status thành expired
      flashSale.status = 'expired';
      await flashSale.save();

      // Cleanup cart cho flash sale này
      const Cart = require('../models/Cart');
      const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
      const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

      const cartsWithFlashSaleItems = await Cart.find({
        'products.productId': { 
          $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
        }
      });

      console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts for flash sale: ${flashSale.name}`);

      for (const cart of cartsWithFlashSaleItems) {
        let cartUpdated = false;
        
        const originalProducts = [...cart.products];
        cart.products = cart.products.filter(item => {
          const itemProductId = item.productId.toString();
          const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
          const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
          
          if (isFlashSaleProduct || isFlashSaleIngredient) {
            console.log(`🗑️ Removing expired item: ${item.name} (${itemProductId}) from cart ${cart._id}`);
            totalRemovedItems++;
            cartUpdated = true;
            return false;
          }
          return true;
        });

        if (cartUpdated) {
          cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
          await cart.save();
          totalCleanedCarts++;
          console.log(`✅ Updated cart ${cart._id}: removed ${originalProducts.length - cart.products.length} items`);
        }
      }
    }

    console.log(`🧹 Cleanup completed: ${totalCleanedCarts} carts, ${totalRemovedItems} items`);

    res.json({
      message: 'Đã cleanup tất cả flash sale đã kết thúc',
      expiredFlashSales: expiredFlashSales.length,
      cleanedCarts: totalCleanedCarts,
      removedItems: totalRemovedItems
    });

  } catch (error) {
    console.error('❌ Lỗi cleanup expired flash sales:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cleanup flash sale đã kết thúc' });
  }
});

// @desc    Đồng bộ giá sản phẩm trong giỏ hàng khi flash sale kết thúc
// @route   POST /api/flash-sales/:id/sync-cart-prices
// @access  Private
router.post('/:id/sync-cart-prices', async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    const Cart = require('../models/Cart');
    const Product = require('../models/Product');
    const Ingredient = require('../models/Ingredient');
    
    // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
    const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
    const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

    console.log('🔍 Flash Sale Products:', flashSaleProductIds);
    console.log('🔍 Flash Sale Ingredients:', flashSaleIngredientIds);

    // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
    const cartsWithFlashSaleItems = await Cart.find({
      'products.productId': { 
        $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
      }
    });

    console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

    let updatedCarts = 0;
    let updatedItems = 0;

    for (const cart of cartsWithFlashSaleItems) {
      let cartUpdated = false;
      
      for (let i = 0; i < cart.products.length; i++) {
        const item = cart.products[i];
        const itemProductId = item.productId.toString();
        const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
        const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
        
        if (isFlashSaleProduct || isFlashSaleIngredient) {
          // Tìm sản phẩm/nguyên liệu để lấy giá gốc
          let originalItem;
          if (isFlashSaleProduct) {
            originalItem = await Product.findById(itemProductId);
          } else {
            originalItem = await Ingredient.findById(itemProductId);
          }

          if (originalItem) {
            // Tính giá gốc dựa trên size nếu có
            let originalPrice = originalItem.price;
            if (item.size && originalItem.sizePricing) {
              const sizePrice = originalItem.sizePricing.find(sp => sp.size === item.size);
              if (sizePrice) {
                originalPrice = sizePrice.discountPrice || sizePrice.price;
              }
            }

            // Cập nhật giá về giá gốc
            if (item.price !== originalPrice) {
              console.log(`💰 Updating price for ${item.name}: ${item.price} → ${originalPrice}`);
              item.price = originalPrice;
              cartUpdated = true;
              updatedItems++;
            }
          }
        }
      }

      // Cập nhật tổng giá
      if (cartUpdated) {
        cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        updatedCarts++;
        console.log(`✅ Updated cart ${cart._id}: synced prices for ${updatedItems} items`);
      }
    }

    console.log(`💰 Price sync completed: ${updatedCarts} carts, ${updatedItems} items`);

    res.json({
      message: 'Đã đồng bộ giá sản phẩm flash sale trong giỏ hàng',
      updatedCarts,
      updatedItems,
      flashSaleName: flashSale.name
    });

  } catch (error) {
    console.error('❌ Lỗi sync cart prices:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi đồng bộ giá sản phẩm' });
  }
});

// @desc    Cập nhật giá flash sale trong giỏ hàng khi flash sale bắt đầu
// @route   POST /api/flash-sales/:id/update-cart-prices
// @access  Private
router.post('/:id/update-cart-prices', async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale không tồn tại' });
    }

    const Cart = require('../models/Cart');
    const Product = require('../models/Product');
    const Ingredient = require('../models/Ingredient');
    
    // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
    const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
    const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

    console.log('🔍 Flash Sale Products:', flashSaleProductIds);
    console.log('🔍 Flash Sale Ingredients:', flashSaleIngredientIds);

    // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
    const cartsWithFlashSaleItems = await Cart.find({
      'products.productId': { 
        $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
      }
    });

    console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

    let updatedCarts = 0;
    let updatedItems = 0;

    for (const cart of cartsWithFlashSaleItems) {
      let cartUpdated = false;
      
      for (let i = 0; i < cart.products.length; i++) {
        const item = cart.products[i];
        const itemProductId = item.productId.toString();
        const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
        const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
        
        if (isFlashSaleProduct || isFlashSaleIngredient) {
          // Tìm flash sale item để lấy giá flash sale
          let flashSaleItem;
          if (isFlashSaleProduct) {
            flashSaleItem = flashSale.products.find(p => p.productId.toString() === itemProductId);
          } else {
            flashSaleItem = flashSale.ingredients.find(i => i.ingredientId.toString() === itemProductId);
          }

          if (flashSaleItem) {
            // Tính giá flash sale dựa trên size nếu có
            let flashSalePrice = flashSaleItem.salePrice;
            if (item.size && flashSaleItem.originalPrice) {
              // Tính tỷ lệ giảm giá
              const discountRatio = flashSaleItem.salePrice / flashSaleItem.originalPrice;
              
              // Tìm sản phẩm gốc để lấy giá size
              let originalItem;
              if (isFlashSaleProduct) {
                originalItem = await Product.findById(itemProductId);
              } else {
                originalItem = await Ingredient.findById(itemProductId);
              }

              if (originalItem && originalItem.sizePricing) {
                const sizePrice = originalItem.sizePricing.find(sp => sp.size === item.size);
                if (sizePrice) {
                  const originalSizePrice = sizePrice.discountPrice || sizePrice.price;
                  flashSalePrice = Math.round(originalSizePrice * discountRatio);
                }
              }
            }

            // Cập nhật giá flash sale
            if (item.price !== flashSalePrice) {
              console.log(`💰 Updating flash sale price for ${item.name}: ${item.price} → ${flashSalePrice}`);
              item.price = flashSalePrice;
              cartUpdated = true;
              updatedItems++;
            }
          }
        }
      }

      // Cập nhật tổng giá
      if (cartUpdated) {
        cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        updatedCarts++;
        console.log(`✅ Updated cart ${cart._id}: updated prices for ${updatedItems} items`);
      }
    }

    console.log(`💰 Flash sale price update completed: ${updatedCarts} carts, ${updatedItems} items`);

    res.json({
      message: 'Đã cập nhật giá flash sale trong giỏ hàng',
      updatedCarts,
      updatedItems,
      flashSaleName: flashSale.name
    });

  } catch (error) {
    console.error('❌ Lỗi update cart prices:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật giá flash sale' });
  }
});

// @desc    Test route để kiểm tra flash sales
// @route   GET /api/flash-sales/test/debug
// @access  Public
router.get('/test/debug', async (req, res) => {
  try {
    const now = new Date();
    console.log('🔧 Debug Flash Sales - Current time:', now.toISOString());
    
    // Lấy tất cả flash sales
    const allFlashSales = await FlashSale.find({});
    console.log(`📊 Total Flash Sales: ${allFlashSales.length}`);
    
    const debugInfo = allFlashSales.map(fs => ({
      id: fs._id,
      name: fs.name,
      startDate: fs.startDate.toISOString(),
      endDate: fs.endDate.toISOString(),
      status: fs.status,
      isActive: fs.isActive,
      productsCount: fs.products.length,
      ingredientsCount: fs.ingredients.length,
      isCurrentlyActive: fs.startDate <= now && fs.endDate >= now
    }));
    
    res.json({
      currentTime: now.toISOString(),
      totalFlashSales: allFlashSales.length,
      flashSales: debugInfo
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
});

module.exports = router; 