import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaMobile, FaLaptop } from 'react-icons/fa';

const ZaloPayInstructions = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: '🛒',
      title: 'Chọn sản phẩm và thanh toán',
      description: 'Thêm bánh vào giỏ hàng và click "Thanh toán với ZaloPay"',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      icon: '📱',
      title: 'Chuyển đến ZaloPay',
      description: 'Bạn sẽ được chuyển đến trang thanh toán ZaloPay',
      color: 'bg-purple-500'
    },
    {
      id: 3,
      icon: '💳',
      title: 'Hoàn tất thanh toán',
      description: 'Quét mã QR hoặc đăng nhập ZaloPay để thanh toán',
      color: 'bg-green-500'
    },
    {
      id: 4,
      icon: '✅',
      title: 'Quay về Luna Bakery',
      description: 'Click nút "Quay về Luna Bakery" để hoàn tất đơn hàng',
      color: 'bg-pink-500'
    }
  ];

  const tips = [
    {
      icon: <FaCheckCircle className="text-green-500" />,
      title: 'Làm gì khi thanh toán thành công?',
      content: 'Sau khi thanh toán, bạn sẽ thấy trang "THANH TOÁN THÀNH CÔNG". Hãy click nút "Quay về Luna Bakery" để hoàn tất đơn hàng.'
    },
    {
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      title: 'Nếu không tự động chuyển hướng?',
      content: 'Đôi khi ZaloPay không tự động chuyển hướng. Hãy tìm và click nút "Quay về Luna Bakery" hoặc copy link được cung cấp.'
    },
    {
      icon: <FaInfoCircle className="text-blue-500" />,
      title: 'Bookmarket trang này',
      content: 'Để dễ dàng quay về Luna Bakery từ ZaloPay, hãy bookmark trang này: /payment-helper'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            💳 Hướng dẫn thanh toán ZaloPay
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thanh toán nhanh chóng, an toàn với ZaloPay. Làm theo các bước dưới đây để hoàn tất đơn hàng tại Luna Bakery.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                {step.id}
              </div>
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Important Tips */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔥 Mẹo quan trọng
          </h2>
          
          <div className="space-y-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="text-2xl">{tip.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                  <p className="text-gray-600 text-sm">{tip.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Device-specific instructions */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaMobile className="text-2xl text-blue-500" />
              <h3 className="text-xl font-bold text-blue-800">Trên điện thoại</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Mở app ZaloPay để thanh toán nhanh hơn</li>
              <li>• Quét mã QR trực tiếp bằng camera</li>
              <li>• Nhớ quay lại trình duyệt sau khi thanh toán</li>
              <li>• Tìm nút "Quay về Luna Bakery" để hoàn tất</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaLaptop className="text-2xl text-green-500" />
              <h3 className="text-xl font-bold text-green-800">Trên máy tính</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Quét mã QR bằng app ZaloPay trên điện thoại</li>
              <li>• Hoặc đăng nhập ZaloPay trên web</li>
              <li>• Sau khi thanh toán, đợi trang chuyển hướng</li>
              <li>• Nếu không tự động, click nút redirect</li>
            </ul>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">🎯 Sẵn sàng mua bánh?</h3>
            <p className="mb-4">Bắt đầu mua sắm và trải nghiệm thanh toán ZaloPay ngay!</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                🛒 Bắt đầu mua sắm
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all border border-white"
              >
                💳 Đến trang thanh toán
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-gray-500 text-sm">
            💬 Cần hỗ trợ? Liên hệ: <span className="font-semibold">1900-xxxx</span> hoặc email: support@lunabakery.com
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ZaloPayInstructions; 