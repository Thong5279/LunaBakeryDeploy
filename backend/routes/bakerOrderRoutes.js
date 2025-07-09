const express = require("express");
const Order = require("../models/Order");
const { protect, baker } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/baker/orders
//@desc Get orders with status 'approved' for baker to process
//@access Private/Baker
router.get("/", protect, baker, async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: { $in: ['approved', 'baking', 'ready'] }
        })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

//@route PUT /api/baker/orders/:id/start-baking
//@desc Start baking order (change status from approved to baking)
//@access Private/Baker
router.put("/:id/start-baking", protect, baker, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'approved') {
            return res.status(400).json({ message: "Chỉ có thể bắt đầu làm bánh cho đơn hàng đã được duyệt" });
        }

        order.status = 'baking';
        order.statusHistory.push({
            status: 'baking',
            updatedBy: req.user._id,
            note: 'Đang làm bánh',
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

//@route PUT /api/baker/orders/:id/complete
//@desc Complete baking order (change status from baking to ready)
//@access Private/Baker
router.put("/:id/complete", protect, baker, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== 'baking') {
            return res.status(400).json({ message: "Chỉ có thể hoàn thành đơn hàng đang trong quá trình làm bánh" });
        }

        order.status = 'ready';
        order.statusHistory.push({
            status: 'ready',
            updatedBy: req.user._id,
            note: 'Bánh đã làm xong',
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
