const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const Review = require('../models/Review');

const router = express.Router();

//@route POST /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    //Find Orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/orders/:id
// @desc vGet order details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if(!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    //return the full order details
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Tạo đánh giá cho sản phẩm trong đơn hàng
// @route   POST /api/orders/:orderId/products/:productId/reviews
// @access  Private
router.post('/:orderId/products/:productId/reviews', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { orderId, productId } = req.params;

        // Kiểm tra đơn hàng tồn tại và thuộc về user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: req.user._id,
            status: 'delivered' // Chỉ cho phép đánh giá đơn hàng đã giao
        });

        if (!order) {
            return res.status(404).json({ 
                message: 'Không tìm thấy đơn hàng hoặc đơn hàng chưa được giao' 
            });
        }

        // Kiểm tra sản phẩm có trong đơn hàng
        const orderItem = order.orderItems.find(
            item => item.productId.toString() === productId
        );

        if (!orderItem) {
            return res.status(404).json({ 
                message: 'Sản phẩm không tồn tại trong đơn hàng' 
            });
        }

        // Kiểm tra xem đã đánh giá chưa
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId,
            order: orderId
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng' 
            });
        }

        // Tạo đánh giá mới
        const review = await Review.create({
            user: req.user._id,
            product: productId,
            order: orderId,
            rating,
            comment
        });

        res.status(201).json({
            message: 'Đánh giá sản phẩm thành công',
            review
        });

    } catch (error) {
        console.error('Lỗi khi tạo đánh giá:', error);
        res.status(500).json({ 
            message: 'Đã xảy ra lỗi khi tạo đánh giá' 
        });
    }
});

// @desc    Lấy đánh giá của sản phẩm trong đơn hàng
// @route   GET /api/orders/:orderId/reviews
// @access  Private
router.get('/:orderId/reviews', protect, async (req, res) => {
    try {
        const { orderId } = req.params;

        // Kiểm tra đơn hàng tồn tại và thuộc về user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: req.user._id 
        });

        if (!order) {
            return res.status(404).json({ 
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        // Lấy tất cả đánh giá của đơn hàng
        const reviews = await Review.find({ order: orderId })
            .populate('product', 'name images')
            .populate('user', 'name');

        res.json(reviews);

    } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
        res.status(500).json({ 
            message: 'Đã xảy ra lỗi khi lấy đánh giá' 
        });
    }
});

module.exports = router;