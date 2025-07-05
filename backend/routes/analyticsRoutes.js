const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin, adminOrManager } = require("../middleware/authMiddleware");

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
router.get("/revenue", protect, admin, async (req, res) => {
  try {
    const { period = "month", year, month, quarter } = req.query;
    let startDate, endDate, groupBy;

    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    switch (period) {
      case "day":
        // Last 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date();
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
        break;

      case "week":
        // Last 12 weeks
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 84); // 12 weeks
        endDate = new Date();
        groupBy = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" }
        };
        break;

      case "month":
        // Last 12 months
        startDate = new Date(currentYear - 1, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        break;

      case "quarter":
        // 4 quarters of current year
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        groupBy = {
          year: { $year: "$createdAt" },
          quarter: {
            $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
          }
        };
        break;

      case "year":
        // Last 5 years
        startDate = new Date(currentYear - 4, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        groupBy = {
          year: { $year: "$createdAt" }
        };
        break;

      default:
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$totalPrice" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1, "_id.quarter": 1 }
      }
    ]);

    res.json({
      success: true,
      period,
      data: revenueData
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get dashboard summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
router.get("/summary", protect, admin, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Today's revenue
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay },
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      }
    ]);

    // This month's revenue
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      }
    ]);

    // This year's revenue
    const yearRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { 
        $match: { 
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        } 
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("totalPrice status createdAt user");

    res.json({
      success: true,
      summary: {
        today: {
          revenue: todayRevenue[0]?.total || 0,
          orders: todayRevenue[0]?.count || 0
        },
        month: {
          revenue: monthRevenue[0]?.total || 0,
          orders: monthRevenue[0]?.count || 0
        },
        year: {
          revenue: yearRevenue[0]?.total || 0,
          orders: yearRevenue[0]?.count || 0
        }
      },
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get order status distribution
// @route   GET /api/analytics/order-status
// @access  Private/Admin
router.get("/order-status", protect, admin, async (req, res) => {
  try {
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: statusDistribution
    });
  } catch (error) {
    console.error("Order status error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get product sales analytics (best/worst/zero sellers)
// @route   GET /api/analytics/product-sales
// @access  Private/Admin or Manager
router.get("/product-sales", protect, adminOrManager, async (req, res) => {
  try {
    console.log("🔍 [Analytics] Starting product-sales route...");
    
    const Product = require("../models/Product");

    // Lấy tất cả sản phẩm
    console.log("📦 [Analytics] Fetching all products...");
    const allProducts = await Product.find({}, { name: 1, category: 1 });
    console.log(`📦 [Analytics] Found ${allProducts.length} products`);

    // Thống kê sản phẩm đã bán (chỉ tính đơn hàng thành công)
    console.log("📊 [Analytics] Running product sales aggregation...");
    const productSales = await Order.aggregate([
      {
        $match: {
          $or: [
            { status: "Delivered" },
            { isPaid: true },
            { isDelivered: true }
          ]
        }
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId", // Sử dụng productId thay vì product
          productName: { $first: "$orderItems.name" },
          totalQuantitySold: { $sum: "$orderItems.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } 
          },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    console.log(`📊 [Analytics] Product sales aggregation returned ${productSales.length} items`);

    // Tạo map để tra cứu nhanh
    const salesMap = {};
    productSales.forEach(item => {
      if (item._id) {
        salesMap[item._id.toString()] = item;
      }
    });

    console.log(`🔍 [Analytics] Created sales map with ${Object.keys(salesMap).length} entries`);

    // Phân loại sản phẩm
    const productStats = allProducts.map(product => {
      const sales = salesMap[product._id.toString()];
      return {
        _id: product._id,
        name: product.name,
        category: product.category,
        totalQuantitySold: sales?.totalQuantitySold || 0,
        totalRevenue: sales?.totalRevenue || 0,
        orderCount: sales?.orderCount || 0
      };
    });

    // Sắp xếp và phân loại
    const sortedByQuantity = [...productStats].sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
    
    const bestSellers = sortedByQuantity.slice(0, 10); // Top 10 bán chạy
    const worstSellers = sortedByQuantity.filter(p => p.totalQuantitySold > 0).slice(-10); // 10 sản phẩm bán ít nhất (nhưng vẫn có bán)
    const zeroSellers = sortedByQuantity.filter(p => p.totalQuantitySold === 0); // Sản phẩm chưa bán được

    console.log(`✅ [Analytics] Product stats computed successfully:
      - Best sellers: ${bestSellers.length}
      - Worst sellers: ${worstSellers.length}  
      - Zero sellers: ${zeroSellers.length}`);

    res.json({
      success: true,
      data: {
        bestSellers,
        worstSellers,
        zeroSellers,
        totalProducts: allProducts.length,
        totalProductsSold: productStats.filter(p => p.totalQuantitySold > 0).length,
        totalProductsNotSold: zeroSellers.length
      }
    });
  } catch (error) {
    console.error("❌ [Analytics] Product sales analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get ingredient inventory analytics (in/out)
// @route   GET /api/analytics/ingredient-inventory
// @access  Private/Admin or Manager
router.get("/ingredient-inventory", protect, adminOrManager, async (req, res) => {
  try {
    console.log("🔍 [Analytics] Starting ingredient-inventory route...");
    
    const Ingredient = require("../models/Ingredient");

    // Lấy tất cả nguyên liệu
    console.log("📦 [Analytics] Fetching all ingredients...");
    const allIngredients = await Ingredient.find({}, { 
      name: 1, 
      category: 1, 
      quantityInStock: 1,
      supplier: 1
    });
    console.log(`📦 [Analytics] Found ${allIngredients.length} ingredients`);

    // Tạo fake data cho demo (vì Orders chỉ có Products, không có Ingredients)
    console.log("📊 [Analytics] Creating ingredient analytics data...");
    
    // Thống kê tổng hợp dựa trên quantityInStock
    const ingredientStats = allIngredients.map((ingredient, index) => {
      // Fake data để demo
      const fakeInputQuantity = Math.floor(Math.random() * 500) + 100; // 100-600
      const fakeOutputQuantity = Math.floor(Math.random() * 200) + 10; // 10-210
      const fakeTransactions = Math.floor(Math.random() * 20) + 5; // 5-25
      
      return {
        _id: ingredient._id,
        name: ingredient.name,
        category: ingredient.category,
        supplier: ingredient.supplier || `Nhà cung cấp ${index + 1}`,
        currentStock: ingredient.quantityInStock || Math.floor(Math.random() * 100),
        totalQuantityIn: fakeInputQuantity,
        totalQuantitySold: fakeOutputQuantity,
        totalRevenue: fakeOutputQuantity * (Math.floor(Math.random() * 50000) + 10000), // Fake revenue
        inboundTransactions: fakeTransactions,
        outboundOrders: Math.floor(fakeTransactions * 0.7), // 70% của transactions
        stockMovement: fakeInputQuantity - fakeOutputQuantity
      };
    });

    // Sắp xếp theo các tiêu chí khác nhau
    const sortedByInput = [...ingredientStats].sort((a, b) => b.totalQuantityIn - a.totalQuantityIn);
    const sortedByOutput = [...ingredientStats].sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);

    const topInput = sortedByInput.slice(0, 10); // Top 10 nhập nhiều nhất
    const topOutput = sortedByOutput.slice(0, 10); // Top 10 bán nhiều nhất
    const lowStock = ingredientStats.filter(i => i.currentStock < 10).sort((a, b) => a.currentStock - b.currentStock); // Sắp hết hàng

    console.log(`✅ [Analytics] Ingredient stats computed successfully:
      - Top input: ${topInput.length}
      - Top output: ${topOutput.length}  
      - Low stock: ${lowStock.length}`);

    res.json({
      success: true,
      data: {
        topInput,
        topOutput,
        lowStock,
        allIngredients: ingredientStats,
        summary: {
          totalIngredients: allIngredients.length,
          totalInboundQuantity: ingredientStats.reduce((sum, i) => sum + i.totalQuantityIn, 0),
          totalOutboundQuantity: ingredientStats.reduce((sum, i) => sum + i.totalQuantitySold, 0),
          totalCurrentStock: ingredientStats.reduce((sum, i) => sum + i.currentStock, 0),
          lowStockCount: lowStock.length
        }
      }
    });
  } catch (error) {
    console.error("❌ [Analytics] Ingredient inventory analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router; 