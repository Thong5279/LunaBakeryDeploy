import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ZaloPayButton = ({ amount, orderInfo, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleZaloPayment = async () => {
    try {
      setIsLoading(true);
      
      // Gọi API backend để tạo order ZaloPay
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/zalopay/create`,
        {
          amount: amount,
          orderInfo: orderInfo || `Thanh toán đơn hàng Luna Bakery - ${amount.toLocaleString('vi-VN')}₫`,
          redirectUrl: `${window.location.origin}/payment-success`,
          callbackUrl: `${import.meta.env.VITE_BACKEND_URL}/api/payment/zalopay/callback`
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Redirect đến ZaloPay payment URL
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.data.message || 'Tạo đơn thanh toán thất bại');
      }
    } catch (error) {
      console.error('ZaloPay payment error:', error);
      onError(error.response?.data?.message || error.message || 'Lỗi thanh toán ZaloPay');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        onClick={handleZaloPayment}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Đang xử lý...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <img 
                src="https://developers.zalopay.vn/assets/images/logo.png" 
                alt="ZaloPay" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback nếu logo không load được
                  e.target.style.display = 'none';
                }}
              />
              <span>💰</span>
            </div>
            <span>Thanh toán với ZaloPay</span>
            <span className="text-blue-100 text-sm">
              {amount.toLocaleString('vi-VN')}₫
            </span>
          </>
        )}
      </motion.button>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          🔒 Bảo mật với công nghệ mã hóa SSL 256-bit
        </p>
        <p className="text-xs text-blue-600 mt-1">
          ✨ Hỗ trợ thanh toán qua ví ZaloPay, thẻ ATM, thẻ tín dụng
        </p>
      </div>
    </div>
  );
};

export default ZaloPayButton; 