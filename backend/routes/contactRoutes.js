const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Gửi form liên hệ
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    // Gửi email thông báo cho admin (có thể thêm sau)
    
    res.status(201).json({ 
      success: true,
      message: 'Tin nhắn đã được gửi thành công'
    });
  } catch (error) {
    console.error('Lỗi khi gửi liên hệ:', error);
    res.status(500).json({ 
      success: false,
      message: 'Có lỗi xảy ra khi gửi tin nhắn'
    });
  }
});

module.exports = router; 