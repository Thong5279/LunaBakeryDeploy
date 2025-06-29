const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

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
// @access  Private/Admin
router.get("/product-sales", protect, admin, async (req, res) => {
  try {
    const Product = require("../models/Product");

    // Lấy tất cả sản phẩm
    const allProducts = await Product.find({}, { name: 1, category: 1 });

    // Thống kê sản phẩm đã bán (chỉ tính đơn hàng thành công)
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
        $match: {
          "orderItems.itemType": { $in: ["Product", null] } // Product hoặc null (backward compatibility)
        }
      },
      {
        $group: {
          _id: "$orderItems.product",
          productName: { $first: "$orderItems.name" },
          totalQuantitySold: { $sum: "$orderItems.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } 
          },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Tạo map để tra cứu nhanh
    const salesMap = {};
    productSales.forEach(item => {
      salesMap[item._id.toString()] = item;
    });

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
    console.error("Product sales analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get ingredient inventory analytics (in/out)
// @route   GET /api/analytics/ingredient-inventory
// @access  Private/Admin
router.get("/ingredient-inventory", protect, admin, async (req, res) => {
  try {
    const Ingredient = require("../models/Ingredient");
    const Inventory = require("../models/Inventory");

    // Lấy tất cả nguyên liệu
    const allIngredients = await Ingredient.find({}, { 
      name: 1, 
      category: 1, 
      quantityInStock: 1,
      supplier: 1
    });

    // Thống kê nguyên liệu đã bán
    const ingredientSales = await Order.aggregate([
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
        $match: {
          "orderItems.itemType": "Ingredient"
        }
      },
      {
        $group: {
          _id: "$orderItems.product", // Trong cart, ingredient cũng lưu vào field product
          ingredientName: { $first: "$orderItems.name" },
          totalQuantitySold: { $sum: "$orderItems.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } 
          },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Lấy lịch sử nhập kho (nếu có)
    const inventoryHistory = await Inventory.find({
      type: "inbound"
    }).populate("ingredient", "name");

    // Tạo map để tra cứu nhanh
    const salesMap = {};
    ingredientSales.forEach(item => {
      salesMap[item._id.toString()] = item;
    });

    const inventoryMap = {};
    inventoryHistory.forEach(item => {
      if (item.ingredient) {
        const ingredientId = item.ingredient._id.toString();
        if (!inventoryMap[ingredientId]) {
          inventoryMap[ingredientId] = { totalIn: 0, transactionCount: 0 };
        }
        inventoryMap[ingredientId].totalIn += item.quantity;
        inventoryMap[ingredientId].transactionCount += 1;
      }
    });

    // Thống kê tổng hợp
    const ingredientStats = allIngredients.map(ingredient => {
      const sales = salesMap[ingredient._id.toString()];
      const inventory = inventoryMap[ingredient._id.toString()];
      
      return {
        _id: ingredient._id,
        name: ingredient.name,
        category: ingredient.category,
        supplier: ingredient.supplier,
        currentStock: ingredient.quantityInStock,
        totalQuantityIn: inventory?.totalIn || 0,
        totalQuantitySold: sales?.totalQuantitySold || 0,
        totalRevenue: sales?.totalRevenue || 0,
        inboundTransactions: inventory?.transactionCount || 0,
        outboundOrders: sales?.orderCount || 0,
        stockMovement: (inventory?.totalIn || 0) - (sales?.totalQuantitySold || 0) // Nhập - Xuất
      };
    });

    // Sắp xếp theo các tiêu chí khác nhau
    const sortedByInput = [...ingredientStats].sort((a, b) => b.totalQuantityIn - a.totalQuantityIn);
    const sortedByOutput = [...ingredientStats].sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
    const sortedByMovement = [...ingredientStats].sort((a, b) => b.stockMovement - a.stockMovement);

    const topInput = sortedByInput.slice(0, 10); // Top 10 nhập nhiều nhất
    const topOutput = sortedByOutput.slice(0, 10); // Top 10 bán nhiều nhất
    const lowStock = ingredientStats.filter(i => i.currentStock < 10).sort((a, b) => a.currentStock - b.currentStock); // Sắp hết hàng

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
    console.error("Ingredient inventory analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router; 