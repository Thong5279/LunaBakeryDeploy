const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const chatbotData = require('../data/chatbotData');

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
    console.error('Lỗi khởi tạo chat:', error);
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
    console.error('Lỗi xử lý tin nhắn:', error);
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
    console.error('Lỗi lấy lịch sử chat:', error);
    res.status(500).json({ message: 'Lỗi lấy lịch sử chat' });
  }
});

// Hàm xử lý tin nhắn và tạo câu trả lời
async function generateBotResponse(message) {
  const lowercaseMessage = message.toLowerCase();

  // Kiểm tra từ khóa trong tin nhắn
  for (const [category, keywords] of Object.entries(chatbotData.keywords)) {
    for (const keyword of keywords) {
      if (lowercaseMessage.includes(keyword)) {
        // Tìm câu trả lời phù hợp từ các danh mục
        if (category === 'giá' && lowercaseMessage.includes('bánh')) {
          return chatbotData.products['bánh kem'];
        }
        if (category === 'đặt hàng') {
          return chatbotData.ordering['cách đặt hàng'];
        }
        if (category === 'giao hàng') {
          return chatbotData.ordering['giao hàng'];
        }
        if (category === 'thanh toán') {
          return chatbotData.ordering['thanh toán'];
        }
        if (category === 'liên hệ') {
          return chatbotData.general['liên hệ'];
        }
        if (category === 'thời gian') {
          return chatbotData.general['giờ làm việc'];
        }
      }
    }
  }

  // Kiểm tra các từ khóa cụ thể về sản phẩm
  for (const [product, info] of Object.entries(chatbotData.products)) {
    if (lowercaseMessage.includes(product)) {
      return info;
    }
  }

  // Kiểm tra các từ khóa về dịch vụ đặc biệt
  for (const [service, info] of Object.entries(chatbotData.special)) {
    if (lowercaseMessage.includes(service)) {
      return info;
    }
  }

  // Kiểm tra các từ khóa chung
  for (const [topic, info] of Object.entries(chatbotData.general)) {
    if (lowercaseMessage.includes(topic)) {
      return info;
    }
  }

  // Trả về câu mặc định nếu không tìm thấy câu trả lời phù hợp
  return chatbotData.greetings.default;
}

module.exports = router; 