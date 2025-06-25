import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaHome, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { clearCart } from '../redux/slices/cartSlice';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);

  const finalizeCheckout = async (transactionId) => {
    try {
      // Lấy checkoutId từ localStorage
      let checkoutId = localStorage.getItem('currentCheckoutId');
      
      if (!checkoutId) {
        console.warn('Không tìm thấy checkoutId trong localStorage, tìm checkout pending của user...');
        
        // Fallback: Tìm checkout pending của user
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/pending`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          
          if (response.data && response.data._id) {
            checkoutId = response.data._id;
            console.log('✅ Tìm thấy checkout pending:', checkoutId);
          }
        } catch (error) {
          console.error('❌ Không tìm thấy checkout pending:', error);
          return;
        }
      }

      if (!checkoutId) {
        console.warn('Không tìm thấy checkout nào để finalize');
        return;
      }

      console.log('🔄 Finalizing checkout:', checkoutId, 'với transaction:', transactionId);

      // 1. Cập nhật checkout status thành paid
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { 
          paymentStatus: "paid", 
          paymentDetails: {
            transactionId: transactionId,
            method: 'ZaloPay',
            paidAt: new Date().toISOString()
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
        { source: 'PaymentSuccessPage' }, // Thêm identifier
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 3. Clear cart sau khi finalize thành công
      dispatch(clearCart());
      
      // 4. Xóa checkoutId khỏi localStorage
      localStorage.removeItem('currentCheckoutId');

      console.log('✅ Checkout finalized successfully');
      toast.success('Đơn hàng đã được tạo thành công!');

    } catch (error) {
      console.error('❌ Error finalizing checkout:', error);
      toast.error('Có lỗi khi tạo đơn hàng, vui lòng liên hệ hỗ trợ');
    }
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Lấy parameters từ URL
        const status = searchParams.get('status');
        const app_trans_id = searchParams.get('apptransid');
        const amount = searchParams.get('amount');
        const method = searchParams.get('method');
        const transactionId = searchParams.get('transactionId');
        
        console.log('🔍 Payment callback params:', { status, app_trans_id, amount, method, transactionId });
        console.log('🔍 All URL params:', Object.fromEntries(searchParams.entries()));

        if (status === 'success' || status === '1') {
          // Thanh toán thành công (PayPal hoặc ZaloPay)
          setPaymentStatus('success');
          
          if (method === 'PayPal') {
            // PayPal success
            setPaymentDetails({
              transactionId: transactionId || 'N/A',
              amount: amount || '0',
              method: 'PayPal'
            });
            toast.success('Thanh toán PayPal thành công!');
            
            // PayPal đã finalize rồi, chỉ cần redirect
            setTimeout(() => {
              navigate('/orders-confirmation');
            }, 3000);
            
          } else {
            // ZaloPay success
            setPaymentDetails({
              transactionId: app_trans_id || transactionId || 'N/A',
              amount: amount || '0',
              method: 'ZaloPay'
            });
            toast.success('Thanh toán ZaloPay thành công!');
            
            // Chỉ finalize cho ZaloPay (có app_trans_id)
            if (app_trans_id || transactionId) {
              await finalizeCheckout(app_trans_id || transactionId);
            }
            
            // Redirect đến trang order confirmation sau 3 giây
            setTimeout(() => {
              navigate('/orders-confirmation');
            }, 3000);
          }
          
        } else if (status === '0') {
          // Thanh toán thất bại
          setPaymentStatus('failed');
          toast.error('Thanh toán thất bại!');
        } else {
          // Không có thông tin thanh toán hoặc đang processing
          if (!status) {
            // Có thể đang processing
            setPaymentStatus('processing');
          } else {
            setPaymentStatus('failed');
            toast.error('Thanh toán bị hủy hoặc không thành công');
          }
        }
      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setPaymentStatus('failed');
        toast.error('Có lỗi xảy ra khi xác thực thanh toán');
      }
    };

    checkPaymentStatus();
  }, [searchParams, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { delay: 0.2, duration: 0.6, ease: "easeOut" }
    }
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-6"
            >
              <FaSpinner className="text-6xl text-blue-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Đang xử lý thanh toán...
            </h1>
            <p className="text-gray-600 text-lg">
              Vui lòng chờ trong giây lát để chúng tôi xác nhận thanh toán của bạn
            </p>
            <div className="mt-6">
              <div className="flex justify-center items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={iconVariants}
              className="mx-auto mb-6"
            >
              <FaCheckCircle className="text-6xl text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🎉 Thanh toán thành công!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Cảm ơn bạn đã tin tưởng Luna Bakery. Đơn hàng của bạn đang được xử lý.
            </p>
            
            {paymentDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
              >
                <h3 className="font-semibold text-gray-800 mb-3">Chi tiết thanh toán:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-mono text-gray-800">{paymentDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-green-600">
                      {parseInt(paymentDetails.amount).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="text-blue-600">{paymentDetails.method}</span>
                  </div>
                </div>
                
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <p className="text-xs text-gray-600 font-mono">
                      Debug: {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/my-orders')}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-pink-600 transition"
              >
                <FaShoppingBag />
                Xem đơn hàng
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition"
              >
                <FaHome />
                Về trang chủ
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-gray-500 mt-6"
            >
              Bạn sẽ được chuyển đến trang xác nhận đơn hàng trong 3 giây...
            </motion.p>
          </motion.div>
        );

      case 'failed':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={iconVariants}
              className="mx-auto mb-6"
            >
              <FaTimesCircle className="text-6xl text-red-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              😞 Thanh toán thất bại
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-red-800 mb-2">Có thể do:</h3>
              <ul className="text-sm text-red-600 text-left space-y-1">
                <li>• Số dư tài khoản không đủ</li>
                <li>• Thông tin thẻ không đúng</li>
                <li>• Giao dịch bị ngân hàng từ chối</li>
                <li>• Kết nối mạng không ổn định</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout')}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-pink-600 transition"
              >
                Thử lại thanh toán
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition"
              >
                <FaHome />
                Về trang chủ
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 