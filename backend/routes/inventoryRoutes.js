const express = require("express");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const { protect, adminOrManager } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/inventory
// @desc Lấy danh sách tất cả items trong kho
// @access Private/Admin-Manager
router.get("/", protect, adminOrManager, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      productType = "",
      status = "",
      lowStock = false,
      slowMoving = false
    } = req.query;

    // Tạo filter object
    const filter = {};
    
    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }
    
    if (productType) {
      filter.productType = productType;
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Lọc hàng sắp hết
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$currentStock', '$minimumStock'] };
    }
    
    // Lọc hàng tồn lâu (30 ngày không bán)
    if (slowMoving === 'true') {
      filter.lastSaleDate = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    // Tạo sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const inventory = await Inventory.find(filter)
      .populate('productId', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inventory.countDocuments(filter);

    res.json({
      inventory,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách kho", error: error.message });
  }
});

// @route GET /api/inventory/statistics
// @desc Lấy thống kê tổng quan kho
// @access Private/Admin-Manager
router.get("/statistics", protect, adminOrManager, async (req, res) => {
  try {
    const stats = await Inventory.getStatistics();
    
    // Lấy top 5 sản phẩm tồn kho lâu nhất
    const slowMovingItems = await Inventory.find({
      status: 'active',
      lastSaleDate: { $exists: true }
    })
    .sort({ lastSaleDate: 1 })
    .limit(5)
    .populate('productId', 'name images');
    
    // Lấy top 5 sản phẩm sắp hết hàng
    const lowStockItems = await Inventory.find({
      status: 'active',
      $expr: { $lte: ['$currentStock', '$minimumStock'] }
    })
    .sort({ currentStock: 1 })
    .limit(5)
    .populate('productId', 'name images');
    
    // Lấy các cảnh báo
    const allItems = await Inventory.find({ status: 'active' });
    const alerts = [];
    allItems.forEach(item => {
      const itemAlerts = item.needsAlert();
      alerts.push(...itemAlerts);
    });

    res.json({
      ...stats,
      slowMovingItems,
      lowStockItems,
      alerts: alerts.slice(0, 10) // Giới hạn 10 cảnh báo
    });
  } catch (error) {
    console.error("Error fetching inventory statistics:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê", error: error.message });
  }
});

// @route POST /api/inventory
// @desc Tạo mới item trong kho
// @access Private/Admin-Manager
router.post("/", protect, adminOrManager, async (req, res) => {
  try {
    const {
      productId,
      productType,
      currentStock,
      minimumStock,
      maximumStock,
      purchasePrice,
      sellingPrice,
      expiryDate,
      location,
      supplier
    } = req.body;

    // Kiểm tra xem product có tồn tại không
    let product;
    if (productType === 'product') {
      product = await Product.findById(productId);
    } else if (productType === 'ingredient') {
      product = await Ingredient.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Kiểm tra xem đã có trong kho chưa
    const existingItem = await Inventory.findOne({ productId, productType });
    if (existingItem) {
      return res.status(400).json({ message: "Sản phẩm đã có trong kho" });
    }

    const inventoryItem = new Inventory({
      productId,
      productType,
      productName: product.name,
      currentStock: currentStock || 0,
      minimumStock: minimumStock || 10,
      maximumStock: maximumStock || 1000,
      purchasePrice: purchasePrice || 0,
      sellingPrice: sellingPrice || product.price || product.discountPrice || 0,
      expiryDate: expiryDate || null,
      location: location || '',
      supplier: supplier || ''
    });

    // Thêm transaction đầu tiên nếu có currentStock
    if (currentStock > 0) {
      inventoryItem.addTransaction({
        type: 'import',
        quantity: currentStock,
        reason: 'Nhập kho ban đầu',
        userId: req.user._id,
        notes: 'Tạo mới item trong kho'
      });
    }

    await inventoryItem.save();
    await inventoryItem.populate('productId', 'name images');

    res.status(201).json({
      message: "Tạo item trong kho thành công",
      inventoryItem
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ message: "Lỗi server khi tạo item", error: error.message });
  }
});

// @route PUT /api/inventory/:id
// @desc Cập nhật thông tin item trong kho
// @access Private/Admin-Manager
router.put("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const {
      minimumStock,
      maximumStock,
      purchasePrice,
      sellingPrice,
      expiryDate,
      location,
      supplier,
      status,
      alertLowStock,
      alertExpiry
    } = req.body;

    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Không tìm thấy item trong kho" });
    }

    // Cập nhật thông tin
    if (minimumStock !== undefined) inventoryItem.minimumStock = minimumStock;
    if (maximumStock !== undefined) inventoryItem.maximumStock = maximumStock;
    if (purchasePrice !== undefined) inventoryItem.purchasePrice = purchasePrice;
    if (sellingPrice !== undefined) inventoryItem.sellingPrice = sellingPrice;
    if (expiryDate !== undefined) inventoryItem.expiryDate = expiryDate;
    if (location !== undefined) inventoryItem.location = location;
    if (supplier !== undefined) inventoryItem.supplier = supplier;
    if (status !== undefined) inventoryItem.status = status;
    if (alertLowStock !== undefined) inventoryItem.alertLowStock = alertLowStock;
    if (alertExpiry !== undefined) inventoryItem.alertExpiry = alertExpiry;

    await inventoryItem.save();
    await inventoryItem.populate('productId', 'name images');

    res.json({
      message: "Cập nhật item thành công",
      inventoryItem
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật item", error: error.message });
  }
});

// @route POST /api/inventory/:id/transaction
// @desc Thêm giao dịch kho (nhập/xuất/điều chỉnh/trả hàng)
// @access Private/Admin-Manager
router.post("/:id/transaction", protect, adminOrManager, async (req, res) => {
  try {
    const { type, quantity, reason, orderId, notes } = req.body;

    if (!type || !quantity || !reason) {
      return res.status(400).json({ message: "Thiếu thông tin giao dịch" });
    }

    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Không tìm thấy item trong kho" });
    }

    // Kiểm tra số lượng xuất không vượt quá tồn kho
    if (type === 'export' && quantity > inventoryItem.currentStock) {
      return res.status(400).json({ 
        message: `Không thể xuất ${quantity} sản phẩm. Chỉ còn ${inventoryItem.currentStock} trong kho` 
      });
    }

    // Thêm giao dịch
    inventoryItem.addTransaction({
      type,
      quantity: parseInt(quantity),
      reason,
      orderId: orderId || null,
      userId: req.user._id,
      notes: notes || ''
    });

    await inventoryItem.save();
    await inventoryItem.populate('productId', 'name images');

    res.json({
      message: "Thêm giao dịch thành công",
      inventoryItem
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Lỗi server khi thêm giao dịch", error: error.message });
  }
});

// @route GET /api/inventory/:id/transactions
// @desc Lấy lịch sử giao dịch của một item
// @access Private/Admin-Manager
router.get("/:id/transactions", protect, adminOrManager, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const inventoryItem = await Inventory.findById(req.params.id)
      .populate('transactions.userId', 'name')
      .populate('transactions.orderId', 'orderNumber');

    if (!inventoryItem) {
      return res.status(404).json({ message: "Không tìm thấy item trong kho" });
    }

    // Pagination cho transactions
    const skip = (page - 1) * limit;
    const transactions = inventoryItem.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + parseInt(limit));

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(inventoryItem.transactions.length / limit),
        total: inventoryItem.transactions.length
      }
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử giao dịch", error: error.message });
  }
});

// @route DELETE /api/inventory/:id
// @desc Xóa item khỏi kho
// @access Private/Admin-Manager
router.delete("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Không tìm thấy item trong kho" });
    }

    // Kiểm tra còn hàng trong kho hay không
    if (inventoryItem.currentStock > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa item còn ${inventoryItem.currentStock} sản phẩm trong kho` 
      });
    }

    await Inventory.findByIdAndDelete(req.params.id);

    res.json({ message: "Xóa item khỏi kho thành công" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ message: "Lỗi server khi xóa item", error: error.message });
  }
});

// @route GET /api/inventory/alerts
// @desc Lấy danh sách cảnh báo
// @access Private/Admin-Manager
router.get("/alerts", protect, adminOrManager, async (req, res) => {
  try {
    const allItems = await Inventory.find({ status: 'active' })
      .populate('productId', 'name images');
    
    const alerts = [];
    allItems.forEach(item => {
      const itemAlerts = item.needsAlert();
      itemAlerts.forEach(alert => {
        alerts.push({
          ...alert,
          item: {
            _id: item._id,
            productName: item.productName,
            currentStock: item.currentStock,
            minimumStock: item.minimumStock,
            lastSaleDate: item.lastSaleDate,
            expiryDate: item.expiryDate,
            productId: item.productId
          }
        });
      });
    });

    // Sắp xếp theo mức độ nghiêm trọng
    const sortedAlerts = alerts.sort((a, b) => {
      const priority = { 'expired': 4, 'low_stock': 3, 'expiring_soon': 2, 'slow_moving': 1 };
      return priority[b.type] - priority[a.type];
    });

    res.json(sortedAlerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Lỗi server khi lấy cảnh báo", error: error.message });
  }
});

// @route POST /api/inventory/sync-products
// @desc Đồng bộ sản phẩm vào kho
// @access Private/Admin-Manager
router.post("/sync-products", protect, adminOrManager, async (req, res) => {
  try {
    let syncCount = 0;
    let errorCount = 0;

    // Đồng bộ Products
    const products = await Product.find({ status: 'active' });
    for (const product of products) {
      try {
        const existingItem = await Inventory.findOne({ 
          productId: product._id, 
          productType: 'product' 
        });

        if (!existingItem) {
          const inventoryItem = new Inventory({
            productId: product._id,
            productType: 'product',
            productName: product.name,
            currentStock: product.countInStock || 0,
            minimumStock: 10,
            maximumStock: 1000,
            purchasePrice: 0,
            sellingPrice: product.discountPrice || product.price || 0,
            location: '',
            supplier: ''
          });

          if (product.countInStock > 0) {
            inventoryItem.addTransaction({
              type: 'import',
              quantity: product.countInStock,
              reason: 'Đồng bộ từ dữ liệu sản phẩm',
              userId: req.user._id,
              notes: 'Tự động đồng bộ'
            });
          }

          await inventoryItem.save();
          syncCount++;
        }
      } catch (err) {
        console.error(`Error syncing product ${product._id}:`, err);
        errorCount++;
      }
    }

    // Đồng bộ Ingredients
    const ingredients = await Ingredient.find({ status: 'active' });
    for (const ingredient of ingredients) {
      try {
        const existingItem = await Inventory.findOne({ 
          productId: ingredient._id, 
          productType: 'ingredient' 
        });

        if (!existingItem) {
          const inventoryItem = new Inventory({
            productId: ingredient._id,
            productType: 'ingredient',
            productName: ingredient.name,
            currentStock: ingredient.countInStock || 0,
            minimumStock: 5,
            maximumStock: 500,
            purchasePrice: 0,
            sellingPrice: ingredient.discountPrice || ingredient.price || 0,
            location: '',
            supplier: ''
          });

          if (ingredient.countInStock > 0) {
            inventoryItem.addTransaction({
              type: 'import',
              quantity: ingredient.countInStock,
              reason: 'Đồng bộ từ dữ liệu nguyên liệu',
              userId: req.user._id,
              notes: 'Tự động đồng bộ'
            });
          }

          await inventoryItem.save();
          syncCount++;
        }
      } catch (err) {
        console.error(`Error syncing ingredient ${ingredient._id}:`, err);
        errorCount++;
      }
    }

    res.json({
      message: "Đồng bộ hoàn thành",
      syncCount,
      errorCount
    });
  } catch (error) {
    console.error("Error syncing products:", error);
    res.status(500).json({ message: "Lỗi server khi đồng bộ", error: error.message });
  }
});

module.exports = router; 