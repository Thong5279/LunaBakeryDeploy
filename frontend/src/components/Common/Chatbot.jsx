import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

// CSS Keyframes
const pulseAnimation = {
  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(236, 72, 153, 0.7)' },
  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(236, 72, 153, 0)' },
  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(236, 72, 153, 0)' }
};

const floatAnimation = {
  '0%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-10px)' },
  '100%': { transform: 'translateY(0px)' }
};

const glowAnimation = {
  '0%': { boxShadow: '0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 15px #ec4899' },
  '50%': { boxShadow: '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899' },
  '100%': { boxShadow: '0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 15px #ec4899' }
};

const rotateAnimation = {
  '0%': { transform: 'rotate(0deg)' },
  '25%': { transform: 'rotate(-10deg)' },
  '75%': { transform: 'rotate(10deg)' },
  '100%': { transform: 'rotate(0deg)' }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      startNewSession();
    }
  }, [isOpen]);

  const startNewSession = async () => {
    try {
      console.log('Starting new chat session...');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/start`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Chat session started:', response.data);
      
      setSessionId(response.data.sessionId);
      setQuickActions(response.data.quickActions || []);
      setMessages([{
        sender: 'bot',
        content: 'Xin chào! Tôi là Luna Assistant 🤖. Tôi có thể giúp bạn:\n\n• 🛍️ Tìm hiểu về sản phẩm\n• 🛒 Hướng dẫn đặt hàng\n• 💰 Thông tin giá cả\n• 🎉 Khuyến mãi hiện tại\n• 🥗 Tư vấn dinh dưỡng\n• 💡 Gợi ý sản phẩm phù hợp\n\nBạn cần tôi hỗ trợ gì?'
      }]);
    } catch (error) {
      console.error('Lỗi khởi tạo chat:', error.response?.data || error.message);
      setMessages([{
        sender: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra khi khởi tạo chat. Vui lòng thử lại sau.'
      }]);
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      await simulateTyping();
      console.log('Sending message:', { sessionId, message: userMessage });
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
        sessionId,
        message: userMessage
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Bot response:', response.data);

      if (response.data && response.data.response) {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          content: response.data.response 
        }]);
        
        // Cập nhật quick actions và suggested products
        if (response.data.quickActions) {
          setQuickActions(response.data.quickActions);
        }
        if (response.data.suggestedProducts) {
          setSuggestedProducts(response.data.suggestedProducts);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error.response?.data || error.message);
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn. Vui lòng thử lại sau.'
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    const actionMessages = {
      'view_menu': 'Tôi muốn xem menu',
      'how_to_order': 'Làm sao để đặt hàng?',
      'promotions': 'Có khuyến mãi gì không?',
      'contact': 'Thông tin liên hệ',
      'birthday_cake': 'Bánh sinh nhật',
      'desserts': 'Bánh ngọt',
      'view_prices': 'Xem bảng giá',
      'order_now': 'Tôi muốn đặt hàng',
      'payment_methods': 'Phương thức thanh toán',
      'delivery_fee': 'Phí giao hàng',
      'return_policy': 'Chính sách đổi trả',
      'support': 'Tôi cần hỗ trợ',
      'cake_prices': 'Giá bánh kem',
      'cupcake_prices': 'Giá cupcake',
      'combo_deals': 'Combo tiết kiệm',
      'full_price_list': 'Bảng giá đầy đủ',
      'calories_info': 'Thông tin calories',
      'allergy_info': 'Thông tin dị ứng',
      'ingredients': 'Nguyên liệu',
      'storage_guide': 'Hướng dẫn bảo quản',
      'current_deals': 'Ưu đãi hiện tại',
      'membership': 'Thẻ thành viên',
      'shop_now': 'Mua ngay',
      'birthday_suggestion': 'Gợi ý cho sinh nhật',
      'couple_suggestion': 'Gợi ý cho cặp đôi',
      'group_suggestion': 'Gợi ý cho nhóm bạn',
      'corporate_suggestion': 'Gợi ý cho công ty'
    };

    const message = actionMessages[action] || action;
    setInput(message);
    
    // Tự động gửi tin nhắn
    const form = document.getElementById('chat-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
    alert('Đã thêm vào giỏ hàng!');
  };

  const renderMessage = (content) => {
    // Convert markdown-style formatting to HTML
    let formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/• /g, '• ');

    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  const chatbotButtonClass = `
    fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 
    bg-gradient-to-r from-pink-500 to-pink-600
    text-white p-4 rounded-full 
    shadow-lg hover:shadow-xl
    transition-all duration-300
    z-40 
    animate-[float_3s_ease-in-out_infinite]
    hover:animate-[glow_1.5s_ease-in-out_infinite]
    before:content-['']
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-pink-600 before:to-pink-400
    before:rounded-full before:opacity-0
    before:transition-opacity before:duration-300
    hover:before:opacity-100
    after:content-['']
    after:absolute after:inset-0
    after:bg-gradient-to-r after:from-pink-400 after:to-pink-600
    after:rounded-full after:animate-[pulse_2s_infinite]
    after:opacity-70
    overflow-hidden
  `;

  const chatbotVariants = {
    hidden: { opacity: 0, x: -20, rotate: -180 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      rotate: -180,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.9,
      rotate: 0
    }
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            ${Object.entries(floatAnimation).map(([key, value]) => `${key} ${value}`).join(';')}
          }
          @keyframes pulse {
            ${Object.entries(pulseAnimation).map(([key, value]) => `${key} ${value}`).join(';')}
          }
          @keyframes glow {
            ${Object.entries(glowAnimation).map(([key, value]) => `${key} ${value}`).join(';')}
          }
          @keyframes rotate {
            ${Object.entries(rotateAnimation).map(([key, value]) => `${key} ${value}`).join(';')}
          }
        `}
      </style>

      {/* Nút mở chatbot */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatbotVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className={chatbotButtonClass}
          >
            <FaRobot size={24} className="relative z-10" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              !
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cửa sổ chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatbotVariants}
            className="fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 w-[calc(100%-2rem)] md:w-96 h-[60vh] md:h-[70vh] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40"
          >
            {/* Header với gradient và animation */}
            <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite] text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <FaRobot className="mr-2" />
                </motion.div>
                <div>
                  <h3 className="font-semibold">Luna Assistant</h3>
                  <p className="text-xs opacity-90">Trợ lý AI thông minh</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={messageVariants}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-100'
                      } transform transition-all duration-200 hover:scale-[1.02]`}
                    >
                      <div className="flex items-center mb-2">
                        {message.sender === 'user' ? (
                          <FaUser className="mr-2" size={12} />
                        ) : (
                          <FaRobot className="mr-2 text-pink-500" size={12} />
                        )}
                        <span className="text-xs font-medium opacity-80">
                          {message.sender === 'user' ? 'Bạn' : 'Luna Assistant'}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed">
                        {renderMessage(message.content)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Suggested Products */}
              {suggestedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">💡 Sản phẩm gợi ý:</p>
                  <div className="space-y-2">
                    {suggestedProducts.map((product) => (
                      <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/about-hero.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                <FaShoppingCart className="text-pink-300" size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{product.name}</h4>
                            <p className="text-xs text-gray-600">{product.price.toLocaleString()}đ</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="text-xs text-pink-600 hover:text-pink-700"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
                          >
                            <FaShoppingCart size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-all duration-200"
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form id="chat-form" onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  disabled={isLoading}
                  className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 disabled:bg-gray-100 transition-all duration-200 text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" size={18} />
                  ) : (
                    <FaPaperPlane size={18} />
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 