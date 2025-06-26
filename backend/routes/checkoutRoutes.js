const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to update inventory based on item type
const updateInventory = async (orderItems) => {
  try {
    for (const item of orderItems) {
      const { productId, quantity } = item;
      let { itemType } = item;
      
      // Nếu không có itemType (data cũ), hãy detect automatically
      if (!itemType) {
        console.log(`🔍 ItemType missing for ${productId}, detecting automatically...`);
        
        // Thử tìm trong Product trước
        const product = await Product.findById(productId);
        if (product) {
          itemType = 'Product';
          console.log(`✅ Detected as Product: ${productId}`);
        } else {
          // Nếu không tìm thấy trong Product, thử Ingredient
          const ingredient = await Ingredient.findById(productId);
          if (ingredient) {
            itemType = 'Ingredient';
            console.log(`✅ Detected as Ingredient: ${productId}`);
          } else {
            console.log(`❌ Item ${productId} not found in both Product and Ingredient collections`);
            continue; // Skip item này nếu không tìm thấy
          }
        }
      }
      
      console.log(`📦 Updating inventory for ${itemType}: ${productId}, quantity: ${quantity}`);
      
      if (itemType === 'Ingredient') {
        // Update ingredient quantity
        const result = await Ingredient.findByIdAndUpdate(
          productId,
          { $inc: { quantity: -quantity } },
          { new: true }
        );
        if (result) {
          console.log(`✅ Updated ingredient ${productId}: ${result.quantity + quantity} → ${result.quantity}`);
        } else {
          console.log(`❌ Failed to update ingredient ${productId}`);
        }
      } else {
        // Default to Product (backwards compatibility)
        const result = await Product.findByIdAndUpdate(
          productId,
          { $inc: { quantity: -quantity } },
          { new: true }
        );
        if (result) {
          console.log(`✅ Updated product ${productId}: ${result.quantity + quantity} → ${result.quantity}`);
        } else {
          console.log(`❌ Failed to update product ${productId}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    throw error;
  }
};

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
      
      // Check từng item trong checkout
      console.log('🔍 Analyzing checkout items:');
      checkout.checkoutItems.forEach((item, index) => {
        console.log(`  Item ${index + 1}:`, {
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          itemType: item.itemType || 'MISSING',
          price: item.price
        });
      });
      
      // Update inventory trước khi tạo order
      try {
        console.log('🔄 Starting inventory update...');
        await updateInventory(checkout.checkoutItems);
        console.log('✅ Inventory updated successfully');
      } catch (inventoryError) {
        console.error('❌ Error updating inventory:', inventoryError);
        // Không fail toàn bộ transaction, chỉ log error
        // Vì order đã được paid, cần tạo order dù inventory có lỗi
      }
      
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
      
      console.log('✅ Order created with ID:', finalOrder._id);

      //delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      console.log('✅ Cart cleared for user:', checkout.user);
      
      res.status(201).json(finalOrder);
    }
  } catch (error) {
    console.log("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 
module.exports = router;