import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { clearCart } from '../redux/slices/cartSlice';

const ZaloPayManualReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompletePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Lấy checkoutId từ localStorage
      const checkoutId = localStorage.getItem('currentCheckoutId');
      
      if (!checkoutId) {
        toast.error('Không tìm thấy thông tin checkout');
        return;
      }

      console.log('🔄 Manual finalizing checkout:', checkoutId);

      // 1. Update checkout status thành paid
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { 
          paymentStatus: "paid", 
          paymentDetails: {
            method: 'ZaloPay',
            paidAt: new Date().toISOString(),
            note: 'Manual completion after ZaloPay success'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 2. Finalize checkout thành order
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        { source: 'ZaloPayManualReturn' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 3. Clear cart và localStorage
      dispatch(clearCart());
      localStorage.removeItem('currentCheckoutId');

      console.log('✅ Manual finalize successful');
      toast.success('Đơn hàng đã được tạo thành công!');

      // Redirect đến trang order confirmation
      navigate('/orders-confirmation');

    } catch (error) {
      console.error('❌ Error manual finalize:', error);
      toast.error('Có lỗi khi tạo đơn hàng, vui lòng liên hệ hỗ trợ');
      setIsProcessing(false);
    }
  };

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
          <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 Thanh toán ZaloPay thành công!
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          Cảm ơn bạn đã thanh toán qua ZaloPay. Hãy click nút bên dưới để hoàn tất đơn hàng.
        </p>

        <motion.button
          onClick={handleCompletePayment}
          disabled={isProcessing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <>
              <span>Hoàn tất đơn hàng</span>
              <FaArrowRight />
            </>
          )}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 Nếu có vấn đề, vui lòng liên hệ hỗ trợ khách hàng
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ZaloPayManualReturn; 