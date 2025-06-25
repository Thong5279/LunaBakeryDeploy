import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowRight, FaQuestionCircle, FaPhone } from 'react-icons/fa';

const PaymentReturnHelper = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-6"
        >
          <FaQuestionCircle className="text-6xl text-blue-500 mx-auto" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🤔 Bạn vừa thanh toán ZaloPay?
        </h1>
        
        <p className="text-gray-600 text-lg mb-6">
          Nếu bạn vừa hoàn tất thanh toán trên ZaloPay và muốn quay về Luna Bakery để hoàn tất đơn hàng:
        </p>

        <div className="space-y-4 mb-8">
          <motion.button
            onClick={() => navigate('/zalopay-return?status=1')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
          >
            <span>✅ Đã thanh toán thành công</span>
            <FaArrowRight />
          </motion.button>

          <motion.button
            onClick={() => navigate('/checkout')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
          >
            Quay lại thanh toán
          </motion.button>

          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-pink-100 text-pink-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-pink-200 transition-all flex items-center justify-center gap-2"
          >
            <FaHome />
            Về trang chủ
          </motion.button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              💡 <strong>Bookmark trang này</strong> để dễ dàng quay về Luna Bakery từ ZaloPay
            </p>
            <p className="text-xs text-gray-400">
              URL: {window.location.origin}/payment-helper
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500">
            <FaPhone className="text-pink-500" />
            <span>Hỗ trợ: 1900-xxxx</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentReturnHelper; 