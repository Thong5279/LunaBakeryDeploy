import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaStar, FaHeart, FaBirthdayCake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Contact = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // Tạo các floating elements cho background
  const createFloatingElements = () => {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        type: Math.random() > 0.6 ? 'star' : Math.random() > 0.3 ? 'heart' : 'cake',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 4 + Math.random() * 6,
        size: 1.5 + Math.random() * 2
      });
    }
    return elements;
  };

  const floatingElements = createFloatingElements();

  // Tự động điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
      {/* Floating elements background */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute z-0 ${
            element.type === 'star' ? 'text-yellow-500/60' : 
            element.type === 'heart' ? 'text-pink-500/60' : 'text-rose-500/60'
          }`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            fontSize: `${element.size}rem`
          }}
          animate={{
            y: [0, -30, 0],
            rotate: element.type === 'star' ? [0, 360] : 
                   element.type === 'heart' ? [0, 15, -15, 0] : [0, -360],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: element.animationDuration,
            delay: element.animationDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {element.type === 'star' ? <FaStar /> : 
           element.type === 'heart' ? <FaHeart /> : <FaBirthdayCake />}
        </motion.div>
      ))}

      {/* Overlay pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3amkwN3JxZzcydzc3N2Z0aTE4bW53eThpZjR0OGJ1NTZleXUxNXVlbSZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/2weSkZg9hvQW5Zv2fk/giphy.gif" alt="Contact" className="w-12 h-12" />
            Liên Hệ Với Chúng Tôi
            <img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3amkwN3JxZzcydzc3N2Z0aTE4bW53eThpZjR0OGJ1NTZleXUxNXVlbSZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/2weSkZg9hvQW5Zv2fk/giphy.gif" alt="Contact" className="w-12 h-12" />
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300 border border-pink-100"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">Thông Tin Liên Hệ</h2>
              
              <div className="space-y-8">
                <div className="flex items-start group">
                  <FaMapMarkerAlt className="text-pink-500 text-2xl mt-1 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">Địa Chỉ</h3>
                    <p className="text-gray-600">
                      số 69 đường B2 khu dân cư hưng phú Q.Cái Răng<br />
                      TP. Cần thơ, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <FaPhone className="text-pink-500 text-2xl mt-1 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">Điện Thoại</h3>
                    <p className="text-gray-600">
                      Hotline: (84) 919 164 967<br />
                      Đặt bánh: (84) 337 615 279
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <FaEnvelope className="text-pink-500 text-2xl mt-1 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">Email</h3>
                    <p className="text-gray-600">
                      info@lunabakery.com<br />
                      phamhuynhthong192@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <FaClock className="text-pink-500 text-2xl mt-1 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">Giờ Làm Việc</h3>
                    <p className="text-gray-600">
                      Thứ 2 - Thứ 7: 7:00 - 21:00<br />
                      Chủ nhật: 8:00 - 20:00
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 text-lg mb-4">Theo dõi chúng tôi</h3>
                  <div className="flex space-x-6">
                    <a 
                      href="https://www.facebook.com/pham.huynh.thong.2025/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600 text-3xl transform hover:scale-110 transition-transform duration-300"
                    >
                      <FaFacebook />
                    </a>
                    <a 
                      href="https://www.instagram.com/thongpham.huynh/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-pink-500 hover:text-pink-600 text-3xl transform hover:scale-110 transition-transform duration-300"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300 border border-pink-100"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">Gửi Tin Nhắn</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      placeholder="0919 xxx xxx"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Nhập chủ đề"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm"
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  ></textarea>
                </div>

                <div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 px-6 text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      'Gửi tin nhắn'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300 border border-pink-100">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">Vị Trí Của Chúng Tôi</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.9362289084293!2d105.78411337588592!3d10.022121372651931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0629cb70e5707%3A0xbd4b585c67938484!2zNjktYmkgxJDGsOG7nW5nIEIyLCBIxrBuZyBQaMO6LCBDw6FpIFLEg25nLCBD4bqnbiBUaMahLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1752115585161!5m2!1svi!2s"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 