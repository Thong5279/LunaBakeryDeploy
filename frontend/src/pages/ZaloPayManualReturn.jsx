import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaTimesCircle, FaExclamationTriangle, FaGift } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { clearCart } from '../redux/slices/cartSlice';
import { setCheckoutData } from '../redux/slices/checkoutSlice';

const ZaloPayManualReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ URL params
    const status = searchParams.get('status');
    const apptransid = searchParams.get('apptransid');
    const amount = searchParams.get('amount');
    const source = searchParams.get('source');
    
    console.log('🔍 ZaloPay return params:', { status, apptransid, amount, source });
    
    setPaymentInfo({
      status,
      transactionId: apptransid,
      amount: amount ? parseInt(amount) : 0,
      isSuccess: status === '1' || status === 'success',
      source: source || 'zalopay_redirect'
    });
    
    // Chỉ hiển thị toast, không auto-process nữa
    if (status === '1' || status === 'success') {
      toast.success('🎉 ZaloPay đã thanh toán thành công!');
      toast.info('✅ Hãy click nút bên dưới để hoàn tất đơn hàng');
    } else if (status === '0' || status === 'failed') {
      toast.error('❌ Thanh toán ZaloPay thất bại!');
    }
  }, [searchParams]);

  const handleCompletePayment = useCallback(async () => {
    try {
      setIsProcessing(true);
      toast.loading('⚙️ Đang hoàn tất đơn hàng...');
      
      // Lấy checkoutId từ localStorage
      const checkoutId = localStorage.getItem('currentCheckoutId');
      
      if (!checkoutId) {
        toast.dismiss();
        toast.error('Không tìm thấy thông tin checkout. Vui lòng quay lại trang thanh toán.');
        setIsProcessing(false);
        return;
      }

      console.log('🔄 Finalizing checkout:', checkoutId);

      // 1. Update checkout status thành paid
      const updateResponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { 
          paymentStatus: "paid", 
          paymentDetails: {
            method: 'ZaloPay',
            transactionId: paymentInfo?.transactionId,
            paidAt: new Date().toISOString(),
            note: 'Completed after ZaloPay success redirect'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 2. Set checkout data từ update response vào Redux store
      dispatch(setCheckoutData(updateResponse.data));

      // 3. Finalize checkout thành order
      const finalizeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        { source: 'ZaloPayManualReturn' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 4. Clear cart
      dispatch(clearCart());
      
      console.log('✅ Order created:', finalizeResponse.data);
      toast.dismiss();
      toast.success('🎉 Đơn hàng đã được tạo thành công!');

      // 5. Redirect đến trang orders-confirmation để hiển thị ngày giao hàng
      navigate('/orders-confirmation');

      // 6. Clear checkoutId sau 5 giây để user có thể xem confirmation
      setTimeout(() => {
        localStorage.removeItem('currentCheckoutId');
      }, 5000);

    } catch (error) {
      console.error('❌ Error finalizing:', error);
      toast.dismiss();
      
      if (error.response?.status === 404) {
        toast.error('Không tìm thấy checkout. Vui lòng thử lại từ trang thanh toán.');
      } else if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('already processed')) {
          toast.success('Đơn hàng đã được xử lý! Chuyển đến danh sách đơn hàng...');
          navigate('/my-orders');
        } else {
          toast.error('Checkout đã được xử lý rồi. Kiểm tra danh sách đơn hàng.');
          navigate('/my-orders');
        }
      } else {
        toast.error('Có lỗi khi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.');
      }
      setIsProcessing(false);
    }
  }, [paymentInfo, navigate, dispatch]);

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
          {isProcessing ? (
            <div className="animate-spin text-6xl text-blue-500 mx-auto">⚙️</div>
          ) : paymentInfo?.isSuccess ? (
            <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
          ) : paymentInfo?.status === '0' ? (
            <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
          ) : (
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto" />
          )}
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isProcessing ? (
            <>⚡ Đang hoàn tất đơn hàng...</>
          ) : paymentInfo?.isSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <img src="https://s1.aigei.com/src/img/gif/9c/9c4918a5e46448649534c632e8596fcf.gif?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:bGDEkSIp468d-4_SLIaaDP558dQ=" alt="Jumping Cat" className="w-12 h-12" />
              Thanh toán ZaloPay thành công!
              <img src="https://s1.aigei.com/src/img/gif/9c/9c4918a5e46448649534c632e8596fcf.gif?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:bGDEkSIp468d-4_SLIaaDP558dQ=" alt="Jumping Cat" className="w-12 h-12" />
            </div>
          ) : paymentInfo?.status === '0' ? (
            <>😞 Thanh toán ZaloPay thất bại</>
          ) : (
            <>🤔 Kiểm tra trạng thái thanh toán</>
          )}
        </h1>
        
        {paymentInfo?.isSuccess ? (
          <>
            <p className="text-gray-600 text-lg mb-4">
              {isProcessing ? (
                <>Đang tạo đơn hàng cho bạn. Vui lòng chờ giây lát...</>
              ) : (
                <>Cảm ơn bạn đã thanh toán! Hãy click nút bên dưới để hoàn tất và xem thông tin đơn hàng + ngày giao hàng.</>
              )}
            </p>
            
            {paymentInfo && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-3">✅ Thông tin thanh toán:</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">💰 Số tiền:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {paymentInfo.amount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">🔢 Mã GD:</span>
                    <span className="font-mono text-gray-800 text-xs">
                      {paymentInfo.transactionId || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">💳 Phương thức:</span>
                    <span className="text-blue-600 font-medium">ZaloPay</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">⏰ Thời gian:</span>
                    <span className="text-gray-700 text-xs">
                      {new Date().toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-lg mb-8">
            {paymentInfo?.status === '0' ? 
              'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.' :
              'Không thể xác định trạng thái thanh toán. Vui lòng kiểm tra lại.'
            }
          </p>
        )}

        {paymentInfo?.isSuccess ? (
          <motion.button
            onClick={handleCompletePayment}
            disabled={isProcessing}
            whileHover={!isProcessing ? { scale: 1.05 } : {}}
            whileTap={!isProcessing ? { scale: 0.95 } : {}}
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
                <FaGift />
                <span>Xem đơn hàng & ngày giao</span>
                <FaArrowRight />
              </>
            )}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <motion.button
              onClick={() => navigate('/checkout')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              <span>🔄 Thử lại thanh toán</span>
              <FaArrowRight />
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
            >
              🏠 Về trang chủ
            </motion.button>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.button
              onClick={() => navigate('/my-orders')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              📋 Xem tất cả đơn hàng
            </motion.button>
          </div>
          <p className="text-xs text-gray-500">
            💡 Cần hỗ trợ? Liên hệ: 1900-xxxx
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ZaloPayManualReturn; 