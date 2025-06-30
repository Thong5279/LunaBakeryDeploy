const express = require("express");
const Order = require("../models/Order");
const { protect, manager } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/manager/orders
//@desc Get orders with status 'Processing' for manager to review
//@access Private/Manager
router.get("/", protect, manager, async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Processing' })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/manager/orders/:id/approve
//@desc Approve order (change status from Processing to Approved)
//@access Private/Manager
router.put("/:id/approve", protect, manager, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: "Order can only be approved from Processing status" });
        }

        order.status = 'Approved';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/manager/orders/:id/cancel
//@desc Cancel order (change status from Processing to Cancelled)
//@access Private/Manager
router.put("/:id/cancel", protect, manager, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: "Order can only be cancelled from Processing status" });
        }

        order.status = 'Cancelled';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router; 