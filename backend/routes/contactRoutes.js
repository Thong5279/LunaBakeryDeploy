const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/authMiddleware');

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

// Lấy danh sách tin nhắn liên hệ (chỉ admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    
    const query = {};
    
    // Lọc theo trạng thái
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Tìm kiếm theo tên, email, số điện thoại, chủ đề
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin nhắn liên hệ:', error);
    res.status(500).json({ 
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách tin nhắn'
    });
  }
});

// Cập nhật trạng thái tin nhắn (chỉ admin)
router.put('/admin/:id/status', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin nhắn'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      contact
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái tin nhắn:', error);
    res.status(500).json({ 
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật trạng thái'
    });
  }
});

// Xóa tin nhắn (chỉ admin)
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin nhắn'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa tin nhắn thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa tin nhắn:', error);
    res.status(500).json({ 
      success: false,
      message: 'Có lỗi xảy ra khi xóa tin nhắn'
    });
  }
});

// Lấy thống kê tin nhắn (chỉ admin)
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });
    
    // Thống kê theo ngày trong 7 ngày qua
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMessages = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      success: true,
      stats: {
        total,
        new: newMessages,
        read: readMessages,
        replied: repliedMessages,
        recent: recentMessages
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê tin nhắn:', error);
    res.status(500).json({ 
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê'
    });
  }
});

module.exports = router; 