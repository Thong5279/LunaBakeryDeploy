const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const moment = require("moment");
const qs = require("qs");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ZaloPay Demo configuration (official demo credentials)
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz", 
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// @desc Tạo đơn hàng ZaloPay
// @route POST /api/payment/zalopay/create
// @access Private
router.post("/zalopay/create", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    // Generate transaction ID
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    // Create order object with exact ZaloPay format
    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify([]),
      embed_data: JSON.stringify({
        redirecturl: "http://localhost:5173/zalopay-return"
      }),
      amount: parseInt(amount),
      description: "Thanh toan don hang #" + transID,
      bank_code: "",
      callback_url: "http://localhost:9000/api/payment/zalopay/callback"
    };

    // Create MAC signature according to ZaloPay specs
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    console.log('📝 ZaloPay Order:', JSON.stringify(order, null, 2));

    // Send to ZaloPay using form data
    const response = await axios.post(config.endpoint, qs.stringify(order), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('🚀 ZaloPay Response:', response.data);

    if (response.data.return_code === 1) {
      res.json({
        success: true,
        paymentUrl: response.data.order_url,
        app_trans_id: order.app_trans_id,
        order_token: response.data.order_token
      });
    } else {
      throw new Error(response.data.return_message || 'Failed to create payment');
    }

  } catch (error) {
    console.error('❌ ZaloPay Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.return_message || error.message || 'Server error'
    });
  }
});

// @desc Callback từ ZaloPay sau khi thanh toán
// @route POST /api/payment/zalopay/callback
// @access Public
router.post("/zalopay/callback", async (req, res) => {
  try {
    console.log('📨 ZaloPay Callback received:', req.body);

    const { data: dataStr, mac: reqMac } = req.body;

    // Verify MAC signature
    const mac = crypto.createHmac('sha256', config.key2).update(dataStr).digest('hex');

    if (reqMac !== mac) {
      console.log('❌ Invalid MAC signature');
      return res.json({ return_code: -1, return_message: "mac not equal" });
    }

    // Parse data
    const dataJson = JSON.parse(dataStr);
    console.log('✅ Verified ZaloPay callback data:', dataJson);

    // TODO: Implement automatic finalization logic here
    // Tìm checkout gần đây nhất có amount matching và finalize nó
    try {
      const Checkout = require("../models/Checkout");
      const Order = require("../models/Order");
      const Cart = require("../models/Cart");
      
      // Tìm checkout chưa finalize với amount matching
      const checkout = await Checkout.findOne({
        totalPrice: dataJson.amount,
        isPaid: false,
        isFinalized: false
      }).sort({ createdAt: -1 });
      
      if (checkout) {
        console.log('🔄 Auto finalizing checkout:', checkout._id);
        
        // Update checkout status
        checkout.isPaid = true;
        checkout.paidAt = new Date();
        checkout.paymentStatus = 'paid';
        checkout.paymentDetails = {
          method: 'ZaloPay',
          transactionId: dataJson.app_trans_id,
          amount: dataJson.amount,
          callbackData: dataJson
        };
        await checkout.save();
        
        // Auto finalize to order
        checkout.isFinalized = true;
        checkout.isFinalizedAt = new Date();
        await checkout.save();
        
        const finalOrder = await Order.create({
          user: checkout.user,
          orderItems: checkout.checkoutItems,
          shippingAddress: checkout.shippingAddress,
          paymentMethod: checkout.paymentMethod,
          totalPrice: checkout.totalPrice,
          isPaid: true,
          paidAt: checkout.paidAt,
          isDelivered: false,
          paymentStatus: "Paid",
          paymentDetails: checkout.paymentDetails,
        });
        
        // Clear cart
        await Cart.findOneAndDelete({ user: checkout.user });
        
        console.log('✅ Auto finalized order:', finalOrder._id);
      } else {
        console.log('⚠️ No matching checkout found for auto finalization');
      }
    } catch (autoError) {
      console.error('❌ Auto finalization error:', autoError);
      // Callback vẫn trả success để ZaloPay không retry
    }

    console.log('🎉 Payment successful for transaction:', dataJson.app_trans_id);

    res.json({ return_code: 1, return_message: "success" });

  } catch (error) {
    console.error('❌ ZaloPay Callback Error:', error);
    res.json({ return_code: 0, return_message: error.message });
  }
});

// @desc Xử lý redirect từ ZaloPay (GET)
// @route GET /api/payment/zalopay/return
// @access Public
router.get("/zalopay/return", async (req, res) => {
  try {
    console.log('🔄 ZaloPay GET redirect received:', req.query);
    console.log('🔄 ZaloPay redirect headers:', req.headers);
    
    const { status, apptransid, amount, checksum, order_token } = req.query;

    // Log full URL for debugging
    console.log('🔍 Full ZaloPay return URL:', req.url);

    // Redirect về frontend zalopay-return page
    const redirectUrl = `http://localhost:5173/zalopay-return?status=${status || '1'}&apptransid=${apptransid || ''}&amount=${amount || '0'}&source=zalopay_gateway`;
    
    console.log('🔄 Redirecting to zalopay-return page:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ ZaloPay redirect error:', error);
    res.redirect('http://localhost:5173/zalopay-return?status=0&source=error');
  }
});

// @desc Xử lý redirect từ ZaloPay (POST) - ZaloPay có thể dùng POST
// @route POST /api/payment/zalopay/return  
// @access Public
router.post("/zalopay/return", async (req, res) => {
  try {
    console.log('🔄 ZaloPay POST redirect received:', req.body);
    console.log('🔄 ZaloPay POST query:', req.query);
    
    const { status, apptransid, amount } = req.body.data ? JSON.parse(req.body.data) : req.body;

    // Redirect về frontend với status
    const redirectUrl = `http://localhost:5173/payment-success?status=${status}&apptransid=${apptransid}&amount=${amount}`;
    
    console.log('🔄 POST Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ ZaloPay POST redirect error:', error);
    res.redirect('http://localhost:5173/payment-success?status=0');
  }
});

// @desc Kiểm tra trạng thái thanh toán ZaloPay
// @route POST /api/payment/zalopay/query
// @access Private
router.post("/zalopay/query", protect, async (req, res) => {
  try {
    const { app_trans_id } = req.body;

    const postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
    };

    const data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
    postData.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const response = await axios.post(config.query_endpoint, postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 ZaloPay Query Response:', response.data);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('❌ ZaloPay Query Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi kiểm tra trạng thái thanh toán'
    });
  }
});

// @desc Test route để debug ZaloPay return
// @route GET /api/payment/test-zalopay-return
// @access Public
router.get("/test-zalopay-return", async (req, res) => {
  try {
    const { amount } = req.query;
    
    // Simulate successful ZaloPay return
    const testParams = new URLSearchParams({
      status: '1',
      apptransid: `test_${Date.now()}`,
      amount: amount || '200000',
      source: 'test'
    });
    
    const redirectUrl = `http://localhost:5173/zalopay-return?${testParams.toString()}`;
    
    console.log('🧪 Test redirecting to:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Test redirect error:', error);
    res.redirect('http://localhost:5173/zalopay-return?status=0&source=test_error');
  }
});

module.exports = router; 