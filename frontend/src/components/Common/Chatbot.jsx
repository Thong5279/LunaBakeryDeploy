import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
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
      {/* Nút mở chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all z-40"
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <FaRobot size={24} />
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 md:bottom-24 lg:bottom-28 w-[calc(100%-2rem)] md:w-96 h-[60vh] md:h-[70vh] max-h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40">
          {/* Header */}
          <div className="bg-pink-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-semibold">Luna Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <FaUser className="mr-2" size={12} />
                    ) : (
                      <FaRobot className="mr-2" size={12} />
                    )}
                    <span className="text-xs">
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
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot; 