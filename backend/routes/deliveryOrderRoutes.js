const express = require("express");
const Order = require("../models/Order");
const { protect, delivery } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/delivery/orders
//@desc Get orders with status 'ready' for delivery to process
//@access Private/Delivery
router.get("/", protect, delivery, async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: { $in: ['ready', 'shipping', 'delivered', 'cannot_deliver'] }
        })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//@route PUT /api/delivery/orders/:id/start-shipping
//@desc Start shipping order (change status from ready to shipping)
//@access Private/Delivery
router.put("/:id/start-shipping", protect, delivery, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'ready') {
            return res.status(400).json({ message: "Chỉ có thể bắt đầu giao hàng cho đơn hàng đã sẵn sàng" });
        }

        order.status = 'shipping';
        order.statusHistory.push({
            status: 'shipping',
            updatedBy: req.user._id,
            note: 'Đang giao hàng',
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

//@route PUT /api/delivery/orders/:id/cannot-deliver
//@desc Mark order as cannot deliver (change status from shipping to cannot_deliver)
//@access Private/Delivery
router.put("/:id/cannot-deliver", protect, delivery, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'shipping') {
            return res.status(400).json({ message: "Chỉ có thể đánh dấu không thể giao cho đơn hàng đang giao" });
        }

        order.status = 'cannot_deliver';
        order.statusHistory.push({
            status: 'cannot_deliver',
            updatedBy: req.user._id,
            note: 'Không thể giao hàng',
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

//@route PUT /api/delivery/orders/:id/delivered
//@desc Mark order as delivered (change status from shipping to delivered)
//@access Private/Delivery
router.put("/:id/delivered", protect, delivery, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'shipping') {
            return res.status(400).json({ message: "Chỉ có thể xác nhận giao thành công cho đơn hàng đang giao" });
        }

        order.status = 'delivered';
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.statusHistory.push({
            status: 'delivered',
            updatedBy: req.user._id,
            note: 'Đã giao hàng thành công',
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
