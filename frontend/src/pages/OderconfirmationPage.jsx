import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaTruck } from "react-icons/fa";
import { clearCart } from "../redux/slices/cartSlice";

const OderconfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkout = useSelector((state) => state.checkout.checkoutData);

  useEffect(() => {
    if(checkout && checkout._id){
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }else{
      navigate("/my-orders")
    }
  },[checkout,dispatch]);

  const calculateEstimatedDelivery = (createdAt, daysToAdd) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + daysToAdd);
    return orderDate.toLocaleDateString("vi-VN", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentMethodDisplay = () => {
    if (checkout?.paymentDetails?.method) {
      return checkout.paymentDetails.method;
    }
    return checkout?.paymentMethod || "Chưa xác định";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-green-700 mb-4 flex items-center justify-center gap-3">
            <img src="https://i.pinimg.com/originals/6f/d3/43/6fd34383dcc18aa07775bf1f62af2ec1.gif" alt="Jumping Cat" className="w-12 h-12" />
            Đặt hàng thành công!
            <img src="https://i.pinimg.com/originals/6f/d3/43/6fd34383dcc18aa07775bf1f62af2ec1.gif" alt="Jumping Cat" className="w-12 h-12" />
          </h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng Luna Bakery. Đơn hàng của bạn đang được chuẩn bị.
          </p>
        </motion.div>

        {checkout && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Order Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    📋 Mã đơn hàng
                  </h2>
                  <p className="text-lg font-mono text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    #{checkout._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    Ngày đặt hàng
                  </h3>
                  <p className="text-gray-600">
                    {new Date(checkout.createdAt).toLocaleDateString("vi-VN", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Estimation */}
            <motion.div 
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <FaTruck className="text-purple-600" />
                📦 Thời gian giao hàng dự kiến
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium mb-1">Sớm nhất:</p>
                  <p className="text-lg font-bold text-purple-800">
                    {calculateEstimatedDelivery(checkout.createdAt, 2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium mb-1">Muộn nhất:</p>
                  <p className="text-lg font-bold text-purple-800">
                    {calculateEstimatedDelivery(checkout.createdAt, 4)}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⏰ <strong>Lưu ý:</strong> Bánh được làm tươi theo đơn hàng, thời gian có thể thay đổi tùy theo độ phức tạp của sản phẩm.
                </p>
              </div>
            </motion.div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🧁 Danh sách sản phẩm
              </h3>
              <div className="space-y-4">
                {checkout.checkoutItems.map((item, index) => (
                  <motion.div 
                    key={item.productId} 
                    className="flex items-center bg-gray-50 rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <img
                      src={item.image}
                      referrerPolicy="no-referrer"
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg mr-4 border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        🍰 Vị: <span className="font-medium">{item.flavor}</span> • 
                        📏 Size: <span className="font-medium">{item.size}</span> • 
                        🔢 SL: <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {item.price.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment & Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" />
                  💳 Thanh toán
                </h4>
                <div className="space-y-2">
                  <p className="text-blue-700 font-medium">
                    Phương thức: <span className="font-bold">{getPaymentMethodDisplay()}</span>
                  </p>
                  {checkout.paymentDetails?.transactionId && (
                    <p className="text-blue-600 text-sm">
                      Mã GD: <span className="font-mono">{checkout.paymentDetails.transactionId}</span>
                    </p>
                  )}
                  <p className="text-2xl font-bold text-blue-800">
                    {checkout.totalPrice.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-green-50 border border-green-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  🏠 Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-green-700">
                  <p><strong>Họ tên:</strong> {checkout.shippingAddress.name}</p>
                  <p><strong>SĐT:</strong> {checkout.shippingAddress.phonenumber}</p>
                  <p><strong>Địa chỉ:</strong> {checkout.shippingAddress.address}</p>
                  <p><strong>Thành phố:</strong> {checkout.shippingAddress.city}</p>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={() => navigate('/my-orders')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                📋 Xem tất cả đơn hàng
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                🛒 Tiếp tục mua sắm
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Support Info */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">
              📞 Cần hỗ trợ?
            </h4>
            <p className="text-yellow-700 mb-2">
              Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-yellow-800">📧 Email: support@lunabakery.com</span>
              <span className="text-yellow-800">📱 Hotline: 1900-xxxx</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OderconfirmationPage;
