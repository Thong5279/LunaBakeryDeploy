const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc GET api/checkout/pending
// @desc Get user's pending checkout
// @access Private
router.get("/pending", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findOne({
      user: req.user._id,
      isPaid: true,
      isFinalized: false
    }).sort({ createdAt: -1 });

    if (!checkout) {
      return res.status(404).json({ message: "No pending checkout found" });
    }

    res.json(checkout);
  } catch (error) {
    console.error("Error fetching pending checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc POST api/checkout
//@desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }
  try {
    // Debug: Log checkout items để kiểm tra quantity
    console.log('📦 Creating checkout with items:', JSON.stringify(checkoutItems, null, 2));
    
    //create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`✅ Checkout created: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//router PUT /api/checkout/:id/pay
// @desc Update checkout to  mark as paid after successful payment
//@access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now(); // Set the paidAt date to now
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "invalid Payment Status" });
    }
  } catch (error) {
    console.error("Error updating checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment confirmation
//@access Private

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const { source = 'Unknown' } = req.body;
    console.log(`🔄 Finalize called from: ${source} for checkout: ${req.params.id}`);
    
    // Sử dụng findOneAndUpdate để atomic operation - chỉ update nếu chưa finalized
    const checkout = await Checkout.findOneAndUpdate(
      { 
        _id: req.params.id, 
        isPaid: true, 
        isFinalized: false 
      },
      { 
        isFinalized: true, 
        isFinalizedAt: new Date() 
      },
      { new: true }
    );
    
    if (!checkout) {
      console.log(`⚠️ Checkout ${req.params.id} not found or already finalized`);
      // Tìm existing order nếu checkout đã được finalized
      const existingOrder = await Order.findOne({
        user: req.user._id,
        createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } // 10 phút gần đây
      }).sort({ createdAt: -1 });
      
      if (existingOrder) {
        return res.status(200).json(existingOrder);
      }
      return res.status(400).json({ message: "Checkout not found or already processed" });
    }
    
    // Checkout đã được mark là finalized, giờ tạo order
    if (checkout) {
      // Debug: Log checkout items trước khi tạo order
      console.log('🔄 Finalizing checkout with items:', JSON.stringify(checkout.checkoutItems, null, 2));
      
      // Create a new order from the checkout
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false, // Assuming the order is not delivered yet
        paymentStatus: "Paid", // Set the payment status to Paid
        paymentDetails: checkout.paymentDetails, // Include payment details
      });
      
      console.log('✅ Order created with items:', JSON.stringify(finalOrder.orderItems, null, 2));

      //delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    }
  } catch (error) {
    console.log("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 
module.exports = router;