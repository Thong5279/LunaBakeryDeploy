import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaComments } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isButtonAnimated, setIsButtonAnimated] = useState(true);
  const messagesEndRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

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

  // Hiệu ứng nhảy cho nút chat khi chưa mở
  useEffect(() => {
    if (!isOpen && isButtonAnimated) {
      const interval = setInterval(() => {
        setIsButtonAnimated(prev => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isButtonAnimated]);

  const startNewSession = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/start`);
      setSessionId(data.sessionId);
      setMessages([{
        sender: 'bot',
        content: 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp gì cho bạn?'
      }]);
    } catch (error) {
      console.error('Lỗi khởi tạo chat:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
        sessionId,
        message: userMessage
      });
      setMessages(prev => [...prev, { sender: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.'
      }]);
    }
  };

  return (
    <>
      {/* Nút mở chatbot với animation */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsButtonAnimated(false);
        }}
        className={`fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 p-4 rounded-full shadow-lg z-40 group
          ${isOpen ? 'hidden' : 'flex items-center gap-3'}
          bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700
          transform transition-all duration-500 ease-in-out
          ${isButtonAnimated ? 'animate-bounce' : ''}
          hover:scale-110 hover:rotate-6
          before:content-[''] before:absolute before:-z-10 before:inset-0 before:bg-pink-500/20 
          before:rounded-full before:animate-ping before:scale-150`}
        style={{ 
          boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
        }}
      >
        <FaComments className="text-white text-2xl animate-pulse" />
        <span className="hidden md:block text-white font-medium pr-2  group-hover:opacity-100 transition-opacity duration-300">
          Chat với Luna
        </span>
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 w-[calc(100%-2rem)] md:w-96 h-[60vh] md:h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaRobot className="text-2xl animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <h3 className="font-semibold text-lg">Luna Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-pink-200 transform hover:rotate-180 transition-all duration-300"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl shadow-md transform transition-all duration-300 hover:scale-105 
                    ${message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                      : 'bg-white text-gray-800'
                    } animate-fadeIn`}
                >
                  <div className="flex items-center mb-1 gap-2">
                    {message.sender === 'user' ? (
                      <FaUser className="text-sm" />
                    ) : (
                      <FaRobot className="text-sm animate-bounce" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'Bạn' : 'Luna Assistant'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

// Thêm CSS animation vào file CSS chính
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideUp {
    animation: slideUp 0.5s ease-out;
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default Chatbot; 