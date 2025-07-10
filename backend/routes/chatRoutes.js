const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

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
  const lowercaseMessage = message.toLowerCase();

  // Tư vấn bánh theo hương vị
  const flavors = {
    'dâu': ['strawberry', 'dâu', 'dau'],
    'socola': ['chocolate', 'socola', 'cacao', 'sô cô la'],
    'vanilla': ['vanilla', 'vani', 'va ni'],
    'matcha': ['matcha', 'trà xanh', 'tra xanh'],
    'coffee': ['coffee', 'cà phê', 'cafe'],
    'cheese': ['cheese', 'phô mai', 'pho mai'],
    'chanh': ['chanh', 'citrus', 'lemon'],
    'việt quất': ['việt quất', 'viet quat', 'blueberry']
  };

  // Tư vấn bánh theo dịp
  const occasions = {
    'sinh nhật': ['sinh nhật', 'birthday', 'sinh nhat'],
    'cưới': ['cưới', 'wedding', 'cuoi', 'đám cưới', 'dam cuoi'],
    'năm mới': ['năm mới', 'tết', 'new year'],
    'valentine': ['valentine', 'tình nhân', 'tinh nhan'],
    'giáng sinh': ['giáng sinh', 'noel', 'christmas'],
    'đầy tháng': ['đầy tháng', 'day thang', 'thôi nôi', 'thoi noi']
  };

  // Tư vấn theo loại bánh
  const types = {
    'kem': ['kem', 'cream', 'lạnh'],
    'bông lan': ['bông lan', 'cotton', 'gato', 'gateau'],
    'mousse': ['mousse', 'mus'],
    'cupcake': ['cupcake', 'cup', 'bánh nhỏ'],
    'cheesecake': ['cheesecake', 'cheese cake', 'bánh phô mai'],
    'roll': ['roll', 'cuộn', 'swiss roll']
  };

  // Kiểm tra xem tin nhắn có chứa từ khóa về hương vị không
  for (const [flavor, keywords] of Object.entries(flavors)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      try {
        // Tìm các sản phẩm có hương vị tương ứng
        const products = await Product.find({
          $or: [
            { name: { $regex: flavor, $options: 'i' } },
            { description: { $regex: flavor, $options: 'i' } },
            { flavor: { $regex: flavor, $options: 'i' } }
          ]
        });

        if (products.length > 0) {
          let response = `🍰 Các loại bánh hương vị ${flavor} của chúng tôi:\n\n`;
          
          products.forEach(product => {
            response += `📍 ${product.name}\n`;
            response += `   💝 Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
            response += `   ⭐ Đánh giá: ${product.rating}/5\n`;
            if (product.description) {
              response += `   📝 Mô tả: ${product.description}\n`;
            }
            if (product.size) {
              response += `   📏 Size: ${product.size.join(', ')}\n`;
            }
            response += '\n';
          });

          response += `\n💡 Gợi ý:\n`;
          response += `- Bánh ${flavor} của chúng tôi được làm từ nguyên liệu tự nhiên\n`;
          response += `- Có thể điều chỉnh độ ngọt theo yêu cầu\n`;
          response += `- Phù hợp cho tiệc, sinh nhật hoặc làm quà tặng\n`;
          response += `\n🛒 Bạn có muốn đặt bánh không? Tôi có thể hướng dẫn bạn quy trình đặt hàng.`;

          return response;
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm sản phẩm:', error);
      }
    }
  }

  // Kiểm tra xem tin nhắn có chứa từ khóa về dịp đặc biệt không
  for (const [occasion, keywords] of Object.entries(occasions)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      try {
        // Tìm các sản phẩm phù hợp với dịp
        const products = await Product.find({
          $or: [
            { occasion: { $regex: occasion, $options: 'i' } },
            { description: { $regex: occasion, $options: 'i' } }
          ]
        });

        if (products.length > 0) {
          let response = `🎉 Các loại bánh cho dịp ${occasion}:\n\n`;
          
          products.forEach(product => {
            response += `📍 ${product.name}\n`;
            response += `   💝 Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
            response += `   ⭐ Đánh giá: ${product.rating}/5\n`;
            if (product.description) {
              response += `   📝 Mô tả: ${product.description}\n`;
            }
            if (product.size) {
              response += `   📏 Size: ${product.size.join(', ')}\n`;
            }
            response += '\n';
          });

          response += `\n💡 Gợi ý cho dịp ${occasion}:\n`;
          switch(occasion) {
            case 'sinh nhật':
              response += `- Có thể thêm tên và tuổi lên bánh\n`;
              response += `- Trang trí theo chủ đề yêu thích\n`;
              response += `- Nến và pháo kim tuyến miễn phí\n`;
              break;
            case 'cưới':
              response += `- Thiết kế theo concept đám cưới\n`;
              response += `- Phù hợp với không gian tiệc\n`;
              response += `- Có dịch vụ setup bánh tại địa điểm\n`;
              break;
            case 'năm mới':
              response += `- Trang trí theo chủ đề năm mới\n`;
              response += `- Phù hợp làm quà biếu\n`;
              response += `- Có hộp đựng sang trọng\n`;
              break;
            default:
              response += `- Trang trí theo yêu cầu\n`;
              response += `- Có thể điều chỉnh size\n`;
              response += `- Bảo quản tốt trong 2-3 ngày\n`;
          }

          return response;
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm sản phẩm:', error);
      }
    }
  }

  // Kiểm tra xem tin nhắn có chứa từ khóa về loại bánh không
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      try {
        // Tìm các sản phẩm thuộc loại bánh tương ứng
        const products = await Product.find({
          $or: [
            { type: { $regex: type, $options: 'i' } },
            { name: { $regex: type, $options: 'i' } }
          ]
        });

        if (products.length > 0) {
          let response = `🍰 Các loại ${type} của chúng tôi:\n\n`;
          
          products.forEach(product => {
            response += `📍 ${product.name}\n`;
            response += `   💝 Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
            response += `   ⭐ Đánh giá: ${product.rating}/5\n`;
            if (product.description) {
              response += `   📝 Mô tả: ${product.description}\n`;
            }
            if (product.size) {
              response += `   📏 Size: ${product.size.join(', ')}\n`;
            }
            response += '\n';
          });

          response += `\n💡 Đặc điểm bánh ${type}:\n`;
          switch(type) {
            case 'kem':
              response += `- Bánh được làm từ kem tươi cao cấp\n`;
              response += `- Bảo quản lạnh ở 4-8 độ C\n`;
              response += `- Nên dùng trong vòng 24h\n`;
              break;
            case 'bông lan':
              response += `- Bông lan mềm, xốp\n`;
              response += `- Không sử dụng chất bảo quản\n`;
              response += `- Bảo quản ở nhiệt độ phòng 2-3 ngày\n`;
              break;
            case 'mousse':
              response += `- Kết cấu mềm mịn, tan trong miệng\n`;
              response += `- Nhiều lớp hương vị khác nhau\n`;
              response += `- Bảo quản lạnh trước khi dùng\n`;
              break;
            default:
              response += `- Được làm từ nguyên liệu cao cấp\n`;
              response += `- Có thể điều chỉnh độ ngọt\n`;
              response += `- Đóng gói cẩn thận\n`;
          }

          return response;
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm sản phẩm:', error);
      }
    }
  }

  // Nếu tin nhắn chứa từ "bánh" nhưng không rơi vào các trường hợp trên
  if (lowercaseMessage.includes('bánh')) {
    return `👋 Xin chào! Tôi có thể tư vấn cho bạn về bánh theo:\n\n` +
           `🍓 Hương vị:\n` +
           `- Dâu, Socola, Vanilla, Matcha\n` +
           `- Coffee, Cheese, Chanh, Việt quất\n\n` +
           `🎉 Dịp đặc biệt:\n` +
           `- Sinh nhật, Đám cưới, Năm mới\n` +
           `- Valentine, Giáng sinh, Đầy tháng\n\n` +
           `🍰 Loại bánh:\n` +
           `- Bánh kem, Bông lan, Mousse\n` +
           `- Cupcake, Cheesecake, Roll\n\n` +
           `💡 Bạn muốn tư vấn loại bánh nào? Hoặc cho tôi biết sở thích và dịp bạn cần bánh, tôi sẽ gợi ý phù hợp nhất.`;
  }

  // Các câu trả lời về sản phẩm
  if (lowercaseMessage.includes('sản phẩm') || lowercaseMessage.includes('bánh')) {
    try {
      if (lowercaseMessage.includes('mới')) {
        const newProducts = await Product.find()
          .sort({ createdAt: -1 })
          .limit(5);
        return `Các sản phẩm mới nhất của chúng tôi:\n${newProducts.map(p => 
          `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ`
        ).join('\n')}`;
      }
      
      if (lowercaseMessage.includes('bán chạy') || lowercaseMessage.includes('phổ biến')) {
        const popularProducts = await Product.find()
          .sort({ soldCount: -1 })
          .limit(5);
        return `Các sản phẩm bán chạy nhất:\n${popularProducts.map(p => 
          `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ`
        ).join('\n')}`;
      }

      if (lowercaseMessage.includes('giá')) {
        const products = await Product.find().select('name price');
        return `Bảng giá một số sản phẩm tiêu biểu:\n${products.slice(0,5).map(p => 
          `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ`
        ).join('\n')}`;
      }
    } catch (error) {
      console.error('Lỗi truy vấn sản phẩm:', error);
    }
  }

  // Các câu trả lời về đơn hàng
  if (lowercaseMessage.includes('đơn hàng') || lowercaseMessage.includes('đặt hàng')) {
    if (lowercaseMessage.includes('hủy')) {
      return 'Để hủy đơn hàng, bạn vào mục "Đơn hàng của tôi", chọn đơn hàng cần hủy và nhấn nút "Hủy đơn hàng". Lưu ý chỉ có thể hủy đơn hàng chưa được xử lý.';
    }
    
    if (lowercaseMessage.includes('theo dõi') || lowercaseMessage.includes('trạng thái')) {
      return 'Bạn có thể theo dõi đơn hàng bằng cách:\n1. Đăng nhập vào tài khoản\n2. Vào mục "Đơn hàng của tôi"\n3. Chọn đơn hàng cần xem\nTại đây bạn sẽ thấy trạng thái chi tiết của đơn hàng.';
    }

    return 'Quy trình đặt hàng gồm các bước:\n1. Chọn sản phẩm và thêm vào giỏ hàng\n2. Vào giỏ hàng và nhấn "Thanh toán"\n3. Điền thông tin giao hàng\n4. Chọn phương thức thanh toán (PayPal hoặc ZaloPay)\n5. Xác nhận đơn hàng';
  }

  // Các câu trả lời về tài khoản
  if (lowercaseMessage.includes('tài khoản') || lowercaseMessage.includes('đăng ký') || lowercaseMessage.includes('đăng nhập')) {
    if (lowercaseMessage.includes('quên mật khẩu')) {
      return 'Nếu bạn quên mật khẩu, hãy:\n1. Click vào "Đăng nhập"\n2. Chọn "Quên mật khẩu"\n3. Nhập email đăng ký\n4. Làm theo hướng dẫn trong email được gửi đến';
    }

    if (lowercaseMessage.includes('đăng ký')) {
      return 'Để đăng ký tài khoản:\n1. Click vào "Đăng ký" góc phải trên\n2. Điền thông tin cá nhân\n3. Xác nhận email\n4. Đăng nhập và bắt đầu mua sắm';
    }

    return 'Bạn có thể đăng nhập bằng:\n1. Email và mật khẩu\n2. Tài khoản Google\nSau khi đăng nhập, bạn có thể:\n- Đặt hàng\n- Theo dõi đơn hàng\n- Đánh giá sản phẩm\n- Nhận ưu đãi đặc biệt';
  }

  // Các câu trả lời về thanh toán
  if (lowercaseMessage.includes('thanh toán') || lowercaseMessage.includes('payment')) {
    if (lowercaseMessage.includes('paypal')) {
      return 'Thanh toán qua PayPal:\n1. Chọn PayPal khi thanh toán\n2. Đăng nhập vào tài khoản PayPal\n3. Xác nhận thanh toán\nLưu ý: Giá sẽ được chuyển đổi sang USD theo tỷ giá hiện tại.';
    }

    if (lowercaseMessage.includes('zalopay')) {
      return 'Thanh toán qua ZaloPay:\n1. Chọn ZaloPay khi thanh toán\n2. Quét mã QR bằng ứng dụng ZaloPay\n3. Xác nhận thanh toán trong ứng dụng';
    }

    return 'Chúng tôi hỗ trợ 2 hình thức thanh toán:\n1. PayPal: Thanh toán quốc tế, an toàn\n2. ZaloPay: Thanh toán nội địa, nhanh chóng\nTất cả đều được mã hóa và bảo mật.';
  }

  // Các câu trả lời về giao hàng
  if (lowercaseMessage.includes('giao hàng') || lowercaseMessage.includes('vận chuyển')) {
    if (lowercaseMessage.includes('phí')) {
      return 'Phí giao hàng được tính dựa trên:\n- Khoảng cách giao hàng\n- Khối lượng đơn hàng\n- Thời gian giao hàng yêu cầu\nPhí sẽ được hiển thị khi bạn nhập địa chỉ giao hàng.';
    }

    if (lowercaseMessage.includes('thời gian')) {
      return 'Thời gian giao hàng:\n- Nội thành: 2-3 giờ\n- Ngoại thành: 3-5 giờ\n- Tỉnh khác: 1-2 ngày\nLưu ý: Thời gian có thể thay đổi tùy tình hình thực tế.';
    }

    return 'Dịch vụ giao hàng của chúng tôi:\n- Giao hàng tận nơi\n- Theo dõi đơn hàng realtime\n- Đội ngũ giao hàng chuyên nghiệp\n- Đảm bảo chất lượng sản phẩm khi giao';
  }

  // Các câu trả lời về chương trình khuyến mãi
  if (lowercaseMessage.includes('khuyến mãi') || lowercaseMessage.includes('giảm giá') || lowercaseMessage.includes('ưu đãi')) {
    try {
      const products = await Product.find({ discount: { $gt: 0 } })
        .sort({ discount: -1 })
        .limit(5);
      
      if (products.length > 0) {
        return `Các sản phẩm đang giảm giá:\n${products.map(p => 
          `- ${p.name}: Giảm ${p.discount}%, còn ${(p.price * (1 - p.discount/100)).toLocaleString('vi-VN')}đ`
        ).join('\n')}`;
      }
      
      return 'Hiện tại chúng tôi có các chương trình ưu đãi:\n- Giảm 10% cho đơn hàng đầu tiên\n- Tích điểm đổi quà với mỗi đơn hàng\n- Ưu đãi sinh nhật\n- Giảm giá cho khách hàng thân thiết';
    } catch (error) {
      console.error('Lỗi truy vấn khuyến mãi:', error);
    }
  }

  // Câu trả lời mặc định
  return 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp bạn về:\n- Tư vấn và đặt bánh\n- Theo dõi đơn hàng\n- Tài khoản và thanh toán\n- Chương trình khuyến mãi\n- Chính sách giao hàng\nBạn cần hỗ trợ vấn đề gì?';
}

module.exports = router; 