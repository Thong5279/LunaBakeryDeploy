const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const chatbotData = require('../data/chatbotData');
const Product = require('../models/Product');

// Khởi tạo session chat mới
router.post('/start', async (req, res) => {
  try {
    const sessionId = Math.random().toString(36).substring(7);
    const chat = new Chat({
      userId: req.user ? req.user._id : null,
      sessionId,
      messages: [],
      context: {
        lastTopic: null,
        userPreferences: [],
        conversationFlow: []
      }
    });
    await chat.save();
    res.json({ 
      sessionId,
      quickActions: getQuickActions()
    });
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

    // Logic xử lý câu trả lời của bot với context
    const { response, quickActions, suggestedProducts } = await generateSmartBotResponse(message, chat);
    
    // Lưu tin nhắn của bot
    chat.messages.push({
      sender: 'bot',
      content: response
    });

    // Cập nhật context
    updateChatContext(chat, message, response);

    await chat.save();
    res.json({ 
      response, 
      quickActions,
      suggestedProducts 
    });
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

// Hàm xử lý tin nhắn thông minh với NLP cải tiến
async function generateSmartBotResponse(message, chat) {
  const lowercaseMessage = message.toLowerCase();
  const context = chat.context || {};
  let response = '';
  let quickActions = [];
  let suggestedProducts = [];

  // Phân tích intent của người dùng
  const intent = analyzeIntent(lowercaseMessage);
  
  // Xử lý theo intent
  switch(intent.type) {
    case 'greeting':
      response = handleGreeting(lowercaseMessage);
      quickActions = getQuickActions();
      break;
      
    case 'product_inquiry':
      const productResponse = await handleProductInquiry(lowercaseMessage, intent.entities);
      response = productResponse.response;
      suggestedProducts = productResponse.products;
      quickActions = getProductQuickActions();
      break;
      
    case 'order_inquiry':
      response = handleOrderInquiry(lowercaseMessage);
      quickActions = getOrderQuickActions();
      break;
      
    case 'price_inquiry':
      response = handlePriceInquiry(lowercaseMessage);
      quickActions = getPriceQuickActions();
      break;
      
    case 'nutrition_inquiry':
      response = handleNutritionInquiry(lowercaseMessage);
      quickActions = getNutritionQuickActions();
      break;
      
    case 'promotion_inquiry':
      response = handlePromotionInquiry(lowercaseMessage);
      quickActions = getPromotionQuickActions();
      break;
      
    case 'suggestion_request':
      const suggestionResponse = await handleSuggestionRequest(lowercaseMessage);
      response = suggestionResponse.response;
      suggestedProducts = suggestionResponse.products;
      quickActions = getSuggestionQuickActions();
      break;
      
    default:
      // Tìm kiếm trong knowledge base
      response = searchKnowledgeBase(lowercaseMessage);
      if (!response) {
        response = chatbotData.greetings.default;
      }
      quickActions = getQuickActions();
  }

  // Thêm context vào response nếu cần
  if (context.lastTopic && shouldAddContext(intent.type)) {
    response = addContextToResponse(response, context);
  }

  return { response, quickActions, suggestedProducts };
}

// Phân tích intent của tin nhắn
function analyzeIntent(message) {
  const intents = {
    greeting: ['xin chào', 'hello', 'hi', 'chào', 'hey'],
    product_inquiry: ['bánh', 'sản phẩm', 'món', 'menu', 'có gì', 'bán gì'],
    order_inquiry: ['đặt', 'order', 'mua', 'đặt hàng', 'làm sao'],
    price_inquiry: ['giá', 'bao nhiêu', 'chi phí', 'tiền'],
    nutrition_inquiry: ['calories', 'calo', 'dinh dưỡng', 'healthy', 'dị ứng'],
    promotion_inquiry: ['khuyến mãi', 'giảm giá', 'ưu đãi', 'sale'],
    suggestion_request: ['gợi ý', 'tư vấn', 'nên mua', 'phù hợp', 'recommend']
  };

  let detectedIntent = { type: 'unknown', confidence: 0, entities: [] };

  for (const [intentType, keywords] of Object.entries(intents)) {
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        detectedIntent = {
          type: intentType,
          confidence: 0.8,
          entities: extractEntities(message, intentType)
        };
        break;
      }
    }
    if (detectedIntent.type !== 'unknown') break;
  }

  return detectedIntent;
}

// Trích xuất entities từ tin nhắn
function extractEntities(message, intentType) {
  const entities = [];
  
  if (intentType === 'product_inquiry') {
    const products = ['bánh kem', 'bánh sinh nhật', 'cookies', 'cupcake', 'bánh mì'];
    products.forEach(product => {
      if (message.includes(product)) {
        entities.push({ type: 'product', value: product });
      }
    });
  }

  if (intentType === 'suggestion_request') {
    const occasions = ['sinh nhật', 'cưới', 'lễ', 'họp mặt', 'valentine'];
    occasions.forEach(occasion => {
      if (message.includes(occasion)) {
        entities.push({ type: 'occasion', value: occasion });
      }
    });
  }

  return entities;
}

// Xử lý các loại câu hỏi khác nhau
function handleGreeting(message) {
  const greetings = [
    'Xin chào! Tôi là Luna Assistant 🤖. Tôi có thể giúp bạn tìm hiểu về sản phẩm, đặt hàng, khuyến mãi và nhiều thông tin khác. Bạn cần tôi hỗ trợ gì?',
    'Chào bạn! Chào mừng đến với Luna Bakery 🍰. Tôi sẵn sàng tư vấn cho bạn về các loại bánh ngon và dịch vụ của chúng tôi!',
    'Hi! Tôi là trợ lý ảo của Luna Bakery. Hãy cho tôi biết bạn đang tìm kiếm gì nhé!'
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

async function handleProductInquiry(message, entities) {
  let response = '';
  let products = [];

  if (entities.length > 0) {
    const productEntity = entities.find(e => e.type === 'product');
    if (productEntity) {
      response = chatbotData.products[productEntity.value] || 'Xin lỗi, tôi không tìm thấy thông tin về sản phẩm này.';
      
      // Lấy sản phẩm từ database với đầy đủ thông tin
      try {
        products = await Product.find({ 
          category: { $regex: productEntity.value, $options: 'i' } 
        })
        .select('name price images description category')
        .limit(3);

        // Format lại dữ liệu sản phẩm
        products = products.map(product => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0].url : null,
          description: product.description,
          category: product.category
        }));

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  } else {
    response = 'Luna Bakery có rất nhiều loại bánh ngon:\n\n' +
               '🎂 **Bánh kem**: Đa dạng mẫu mã, giá từ 200k\n' +
               '🧁 **Cupcake**: Nhỏ xinh, nhiều vị\n' +
               '🍪 **Cookies**: Giòn tan, thơm ngon\n' +
               '🥖 **Bánh mì**: Tươi mới mỗi ngày\n' +
               '🍰 **Bánh ngọt**: Tiramisu, Cheesecake...\n\n' +
               'Bạn muốn tìm hiểu về loại bánh nào?';
  }

  return { response, products };
}

function handleOrderInquiry(message) {
  return chatbotData.ordering['cách đặt hàng'] + 
         '\n\n💡 **Mẹo**: Đăng ký tài khoản để theo dõi đơn hàng dễ dàng hơn!';
}

function handlePriceInquiry(message) {
  let response = '💰 **Bảng giá tham khảo**:\n\n';
  
  // Tìm sản phẩm cụ thể trong tin nhắn
  const products = Object.keys(chatbotData.products);
  let foundProduct = false;
  
  for (const product of products) {
    if (message.includes(product)) {
      response = chatbotData.products[product];
      foundProduct = true;
      break;
    }
  }
  
  if (!foundProduct) {
    response += '• Bánh kem: 200,000đ - 2,000,000đ\n';
    response += '• Cupcake: 35,000đ - 50,000đ/cái\n';
    response += '• Cookies: 15,000đ - 25,000đ/cái\n';
    response += '• Bánh mì: 20,000đ - 45,000đ\n';
    response += '\nBạn muốn biết giá cụ thể của sản phẩm nào?';
  }
  
      return response;
}

function handleNutritionInquiry(message) {
  if (message.includes('calo') || message.includes('calories')) {
    return chatbotData.nutrition['calories'];
  } else if (message.includes('dị ứng')) {
    return chatbotData.nutrition['dị ứng'];
  } else if (message.includes('nguyên liệu')) {
    return chatbotData.nutrition['nguyên liệu'];
  } else {
    return '🥗 **Thông tin dinh dưỡng**:\n\n' +
           'Tôi có thể cung cấp thông tin về:\n' +
           '• Lượng calories trong bánh\n' +
           '• Thông tin dị ứng\n' +
           '• Nguyên liệu sử dụng\n' +
           '• Cách bảo quản\n\n' +
           'Bạn quan tâm đến thông tin nào?';
  }
}

function handlePromotionInquiry(message) {
  return '🎉 **Ưu đãi đặc biệt**:\n\n' +
         chatbotData.promotions['khuyến mãi hiện tại'] +
         '\n\n🎁 Đừng bỏ lỡ cơ hội tiết kiệm!';
}

async function handleSuggestionRequest(message) {
  let response = '';
  let products = [];
  
  // Tìm dịp đặc biệt trong tin nhắn
  const occasions = Object.keys(chatbotData.suggestions);
  let foundOccasion = false;
  
  for (const occasion of occasions) {
    if (message.includes(occasion)) {
      response = '🎯 ' + chatbotData.suggestions[occasion];
      foundOccasion = true;
      
      // Lấy sản phẩm phù hợp
      try {
        products = await Product.find({ 
          tags: { $in: [occasion] } 
        }).limit(3);
      } catch (error) {
        console.error('Error fetching suggested products:', error);
      }
      break;
    }
  }
  
  if (!foundOccasion) {
    response = '💡 **Để tư vấn chính xác, bạn cho tôi biết**:\n\n' +
               '• Dịp/sự kiện nào? (sinh nhật, họp mặt, v.v.)\n' +
               '• Số lượng người?\n' +
               '• Ngân sách dự kiến?\n' +
               '• Có yêu cầu đặc biệt nào không?';
  }
  
  return { response, products };
}

// Tìm kiếm trong knowledge base
function searchKnowledgeBase(message) {
  // Tìm trong tất cả categories
  const allCategories = [
    chatbotData.general,
    chatbotData.products,
    chatbotData.ordering,
    chatbotData.special,
    chatbotData.nutrition,
    chatbotData.promotions,
    chatbotData.recipes,
    chatbotData.faq
  ];

  for (const category of allCategories) {
    for (const [key, value] of Object.entries(category)) {
      if (message.includes(key)) {
        return value;
      }
    }
  }

  // Tìm theo keywords
  for (const [category, keywords] of Object.entries(chatbotData.keywords)) {
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        // Trả về thông tin phù hợp nhất
        return getResponseByCategory(category);
      }
    }
  }

  return null;
}

function getResponseByCategory(category) {
  const responses = {
    'giá': '💰 Bạn muốn biết giá sản phẩm nào? Tôi có thể cung cấp bảng giá chi tiết cho từng loại bánh.',
    'đặt hàng': chatbotData.ordering['cách đặt hàng'],
    'giao hàng': chatbotData.ordering['giao hàng'],
    'thanh toán': chatbotData.ordering['thanh toán'],
    'liên hệ': chatbotData.general['liên hệ'],
    'thời gian': chatbotData.general['giờ làm việc'],
    'khuyến mãi': chatbotData.promotions['khuyến mãi hiện tại'],
    'dinh dưỡng': '🥗 Bạn quan tâm đến thông tin dinh dưỡng nào? Calories, dị ứng, hay nguyên liệu?',
    'công thức': chatbotData.recipes['công thức đơn giản'],
    'bảo quản': chatbotData.nutrition['bảo quản']
  };
  
  return responses[category] || chatbotData.greetings.default;
}

// Quick actions cho người dùng
function getQuickActions() {
  return [
    { label: '📋 Xem menu', action: 'view_menu' },
    { label: '🛒 Cách đặt hàng', action: 'how_to_order' },
    { label: '🎉 Khuyến mãi', action: 'promotions' },
    { label: '📞 Liên hệ', action: 'contact' }
  ];
}

function getProductQuickActions() {
  return [
    { label: '🎂 Bánh sinh nhật', action: 'birthday_cake' },
    { label: '🧁 Bánh ngọt', action: 'desserts' },
    { label: '💰 Xem giá', action: 'view_prices' },
    { label: '🛒 Đặt hàng ngay', action: 'order_now' }
  ];
}

function getOrderQuickActions() {
  return [
    { label: '💳 Phương thức thanh toán', action: 'payment_methods' },
    { label: '🚚 Phí giao hàng', action: 'delivery_fee' },
    { label: '↩️ Chính sách đổi trả', action: 'return_policy' },
    { label: '📞 Hỗ trợ', action: 'support' }
  ];
}

function getPriceQuickActions() {
  return [
    { label: '🎂 Giá bánh kem', action: 'cake_prices' },
    { label: '🧁 Giá cupcake', action: 'cupcake_prices' },
    { label: '🎉 Combo tiết kiệm', action: 'combo_deals' },
    { label: '📋 Bảng giá đầy đủ', action: 'full_price_list' }
  ];
}

function getNutritionQuickActions() {
  return [
    { label: '🔥 Thông tin calories', action: 'calories_info' },
    { label: '🥜 Thông tin dị ứng', action: 'allergy_info' },
    { label: '🌾 Nguyên liệu', action: 'ingredients' },
    { label: '📦 Hướng dẫn bảo quản', action: 'storage_guide' }
  ];
}

function getPromotionQuickActions() {
  return [
    { label: '🎁 Ưu đãi hiện tại', action: 'current_deals' },
    { label: '💳 Thẻ thành viên', action: 'membership' },
    { label: '📦 Combo tiết kiệm', action: 'combo_deals' },
    { label: '🛒 Mua ngay', action: 'shop_now' }
  ];
}

function getSuggestionQuickActions() {
  return [
    { label: '🎂 Cho sinh nhật', action: 'birthday_suggestion' },
    { label: '💑 Cho cặp đôi', action: 'couple_suggestion' },
    { label: '👥 Cho nhóm bạn', action: 'group_suggestion' },
    { label: '🏢 Cho công ty', action: 'corporate_suggestion' }
  ];
}

// Cập nhật context của cuộc hội thoại
function updateChatContext(chat, userMessage, botResponse) {
  if (!chat.context) {
    chat.context = {
      lastTopic: null,
      userPreferences: [],
      conversationFlow: []
    };
  }

  // Cập nhật topic hiện tại
  const intent = analyzeIntent(userMessage.toLowerCase());
  if (intent.type !== 'unknown') {
    chat.context.lastTopic = intent.type;
  }

  // Lưu flow cuộc hội thoại
  chat.context.conversationFlow.push({
    timestamp: new Date(),
    userIntent: intent.type,
    responded: true
  });

  // Giới hạn độ dài conversation flow
  if (chat.context.conversationFlow.length > 10) {
    chat.context.conversationFlow.shift();
  }
}

// Kiểm tra xem có nên thêm context không
function shouldAddContext(intentType) {
  const contextualIntents = ['product_inquiry', 'price_inquiry', 'suggestion_request'];
  return contextualIntents.includes(intentType);
}

// Thêm context vào response
function addContextToResponse(response, context) {
  if (context.lastTopic === 'product_inquiry') {
    response += '\n\n💡 Bạn có muốn tôi gợi ý thêm sản phẩm tương tự không?';
  } else if (context.lastTopic === 'price_inquiry') {
    response += '\n\n💰 Hiện đang có chương trình giảm giá cho đơn hàng trên 500k!';
  }
  return response;
}

module.exports = router; 