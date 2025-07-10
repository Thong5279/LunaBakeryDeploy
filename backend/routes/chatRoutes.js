const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Khởi tạo session chat mới
router.post('/start', async (req, res) => {
  try {
    const sessionId = Math.random().toString(36).substring(7);
    const chat = new Chat({
      userId: req.user ? req.user._id : null,
      sessionId,
      messages: []
    });
    await chat.save();
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khởi tạo chat' });
  }
});

// Gửi tin nhắn và nhận phản hồi
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return res.status(404).json({ message: 'Không tìm thấy phiên chat' });
    }

    // Lưu tin nhắn của user
    chat.messages.push({
      sender: 'user',
      content: message
    });

    // Logic xử lý câu trả lời của bot
    const botResponse = await generateBotResponse(message);
    
    // Lưu tin nhắn của bot
    chat.messages.push({
      sender: 'bot',
      content: botResponse
    });

    await chat.save();
    res.json({ response: botResponse });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xử lý tin nhắn' });
  }
});

// Lấy lịch sử chat
router.get('/history/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId });
    if (!chat) {
      return res.status(404).json({ message: 'Không tìm thấy phiên chat' });
    }
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử chat' });
  }
});

// Hàm xử lý tin nhắn và tạo câu trả lời
async function generateBotResponse(message) {
  // Các câu trả lời mẫu dựa trên từ khóa
  const responses = {
    'giá': 'Bạn có thể xem giá các sản phẩm của chúng tôi trong mục Sản Phẩm. Bánh của chúng tôi có giá từ 200,000đ đến 2,000,000đ tùy loại và kích thước.',
    'đặt hàng': 'Để đặt hàng, bạn có thể chọn sản phẩm và thêm vào giỏ hàng. Sau đó tiến hành thanh toán qua các hình thức như PayPal hoặc ZaloPay.',
    'thời gian': 'Chúng tôi cần khoảng 2-3 ngày để hoàn thành đơn đặt hàng bánh thông thường. Với bánh đặc biệt có thể cần 3-5 ngày.',
    'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua số điện thoại hoặc email được hiển thị ở phần Footer của website.',
    'default': 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp bạn tư vấn về các sản phẩm bánh, quy trình đặt hàng và các thông tin khác về Luna Bakery.'
  };

  // Tìm câu trả lời phù hợp
  const lowercaseMessage = message.toLowerCase();
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowercaseMessage.includes(keyword)) {
      return response;
    }
  }
  return responses.default;
}

module.exports = router; 