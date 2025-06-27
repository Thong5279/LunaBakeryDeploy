import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ZaloPayButton = ({ amount, orderInfo, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleZaloPayment = async () => {
    try {
      setIsLoading(true);
      
      // Lưu amount để dùng sau
      localStorage.setItem('zalopay_amount', amount.toString());
      localStorage.setItem('zalopay_payment_time', Date.now().toString());
      
      // Gọi API backend để tạo order ZaloPay
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/zalopay/create`,
        {
          amount: amount,
          orderInfo: orderInfo || `Thanh toán đơn hàng Luna Bakery - ${amount.toLocaleString('vi-VN')}₫`,
          redirectUrl: `${window.location.origin}/zalopay-return`,
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
        // Lưu thông tin transaction
        localStorage.setItem('zalopay_app_trans_id', response.data.app_trans_id);
        
        // Redirect trực tiếp đến ZaloPay - sau khi thanh toán sẽ tự động về zalopay-return
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
      
      <div className="mt-3 text-center space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-3">📱 Hướng dẫn thanh toán ZaloPay</h4>
          <div className="text-xs text-blue-700 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <p>Nhấn nút thanh toán → Chuyển đến ZaloPay</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <p>Hoàn tất thanh toán trên ZaloPay</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <p><strong className="text-green-700">Sau khi thành công → Tự động về Luna Bakery</strong></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <p>Hệ thống sẽ tự động hoàn tất đơn hàng cho bạn!</p>
            </div>
          </div>
          
          <div className="mt-3 bg-green-50 border border-green-200 rounded p-2">
            <p className="text-xs text-green-700 font-medium">
              ✨ <strong>Hoàn toàn tự động:</strong> Thanh toán xong → Tự động về website → Tự động tạo đơn hàng!
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          🔒 Bảo mật với công nghệ mã hóa SSL 256-bit
        </p>
        <p className="text-xs text-blue-600">
          ✨ Hỗ trợ thanh toán qua ví ZaloPay, thẻ ATM, thẻ tín dụng
        </p>
        
        <div className="space-y-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 font-medium mb-1">
              🆘 <strong>Nếu bị kẹt ở ZaloPay sau khi thanh toán:</strong>
            </p>
            <div className="space-y-1">
              <p className="text-xs text-yellow-700">
                • <a 
                  href="/zalopay-return" 
                  target="_blank" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Nhấn vào đây để quay về thủ công
                </a>
              </p>
              <p className="text-xs text-yellow-700">
                • <a 
                  href="/payment-helper" 
                  target="_blank" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Trang hỗ trợ thanh toán
                </a>
              </p>
            </div>
          </div>
          
          {import.meta.env.DEV && (
            <p className="text-xs text-orange-600">
              🧪 Test flow: 
              <a 
                href={`${import.meta.env.VITE_BACKEND_URL}/api/payment/test-zalopay-return?amount=${amount}`}
                target="_blank" 
                className="text-orange-700 underline hover:text-orange-900 ml-1"
              >
                Test ZaloPay return
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZaloPayButton; 