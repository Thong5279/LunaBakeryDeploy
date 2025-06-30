const express = require("express");
const Order = require("../models/Order");
const { protect, delivery } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/delivery/orders
//@desc Get orders with status 'Ready' for delivery to process
//@access Private/Delivery
router.get("/", protect, delivery, async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: { $in: ['Ready', 'CannotDeliver', 'Delivered'] }
        })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/delivery/orders/:id/cannot-deliver
//@desc Mark order as cannot deliver (change status from Ready to CannotDeliver)
//@access Private/Delivery
router.put("/:id/cannot-deliver", protect, delivery, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Ready') {
            return res.status(400).json({ message: "Order can only be marked as cannot deliver from Ready status" });
        }

        order.status = 'CannotDeliver';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/delivery/orders/:id/delivered
//@desc Mark order as delivered (change status from Ready to Delivered)
//@access Private/Delivery
router.put("/:id/delivered", protect, delivery, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Ready') {
            return res.status(400).json({ message: "Order can only be delivered from Ready status" });
        }

        order.status = 'Delivered';
        order.isDelivered = true;
        order.deliveredAt = new Date();
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
