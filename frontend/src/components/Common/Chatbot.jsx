import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
  const messagesEndRef = useRef(null);

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
      setMessages([{
        sender: 'bot',
        content: 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp gì cho bạn?'
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
            className="fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 w-[calc(100%-2rem)] md:w-96 h-[60vh] md:h-[70vh] max-h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40"
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
                <h3 className="font-semibold">Luna Assistant</h3>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-white text-gray-800'
                      } transform transition-all duration-200 hover:scale-105`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'user' ? (
                          <FaUser className="mr-2" size={12} />
                        ) : (
                          <FaRobot className="mr-2" size={12} />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === 'user' ? 'Bạn' : 'Luna Assistant'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 px-4 py-2 rounded-full">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  disabled={isLoading}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-pink-500 disabled:bg-gray-100 transition-colors"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
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