const express = require("express");
const Order = require("../models/Order");
const { protect, baker } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/baker/orders
//@desc Get orders with status 'Approved' for baker to process
//@access Private/Baker
router.get("/", protect, baker, async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: { $in: ['Approved', 'Baking', 'Ready'] }
        })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/baker/orders/:id/start-baking
//@desc Start baking order (change status from Approved to Baking)
//@access Private/Baker
router.put("/:id/start-baking", protect, baker, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Approved') {
            return res.status(400).json({ message: "Order can only be started from Approved status" });
        }

        order.status = 'Baking';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PUT /api/baker/orders/:id/complete
//@desc Complete baking order (change status from Baking to Ready)
//@access Private/Baker
router.put("/:id/complete", protect, baker, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Baking') {
            return res.status(400).json({ message: "Order can only be completed from Baking status" });
        }

        order.status = 'Ready';
        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
