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

module.exports = router; 