const express = require("express");
const Order = require("../models/Order");
const { protect, manager } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/manager/orders
//@desc Get all orders for manager to review
//@access Private/Manager
router.get("/", protect, manager, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//@route PUT /api/manager/orders/:id/approve
//@desc Approve order (change status from pending to approved)
//@access Private/Manager
router.put("/:id/approve", protect, manager, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Chỉ có thể duyệt đơn hàng đang ở trạng thái chờ xử lý" });
        }

        order.status = 'approved';
        order.statusHistory.push({
            status: 'approved',
            updatedBy: req.user._id,
            note: 'Đơn hàng đã được duyệt',
            updatedAt: Date.now()
        });

        const updatedOrder = await order.save();

        // Emit event thông qua Socket.IO
        const io = req.app.get('io');
        io.emit('orderStatusUpdated', {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
            statusHistory: order.statusHistory
        });
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//@route PUT /api/manager/orders/:id/cancel
//@desc Cancel order (change status from pending to cancelled)
//@access Private/Manager
router.put("/:id/cancel", protect, manager, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý" });
        }

        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            updatedBy: req.user._id,
            note: 'Đơn hàng đã bị hủy',
            updatedAt: Date.now()
        });

        const updatedOrder = await order.save();

        // Emit event thông qua Socket.IO
        const io = req.app.get('io');
        io.emit('orderStatusUpdated', {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
            statusHistory: order.statusHistory
        });
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router; 