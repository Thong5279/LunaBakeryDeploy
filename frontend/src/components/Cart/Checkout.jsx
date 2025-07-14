import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPaypal, FaCreditCard, FaWallet, FaShieldAlt } from "react-icons/fa";
import PayPalButton from "./PayPalButton";
import ZaloPayButton from "./ZaloPayButton";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    address: "",
    city: "Cần Thơ", // Cố định thành phố
    description: "",
  });

  // Hàm tách tên thành họ và tên
  const splitFullName = (fullName) => {
    if (!fullName) return { firstname: "", lastname: "" };
    
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) {
      return { firstname: nameParts[0], lastname: "" };
    }
    
    // Lấy từ cuối làm tên, phần còn lại làm họ
    const firstname = nameParts[nameParts.length - 1];
    const lastname = nameParts.slice(0, -1).join(" ");
    
    return { firstname, lastname };
  };

  // Tự động điền thông tin từ user profile
  useEffect(() => {
    if (user) {
      const { firstname, lastname } = splitFullName(user.name);
      
      setShippingAddress(prev => ({
        ...prev,
        firstname: firstname || "",
        lastname: lastname || "",
        phonenumber: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        city: "Cần Thơ", // Luôn cố định
      }));
    }
  }, [user]);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "zalopay",
      name: "ZaloPay",
      description: "Thanh toán qua ví điện tử ZaloPay",
      icon: <FaWallet className="text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      features: ["Ví ZaloPay", "Thẻ ATM", "Thẻ tín dụng"]
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Thanh toán an toàn với PayPal",
      icon: <FaPaypal className="text-blue-600" />,
      color: "from-blue-600 to-blue-700",
      features: ["PayPal Balance", "Credit Card", "Debit Card"]
    }
  ];

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const fullName = `${shippingAddress.firstname} ${shippingAddress.lastname}`;
    const formattedAddress = {
      ...shippingAddress,
      name: fullName,
    };

    if (cart && cart.products.length > 0) {
      // Debug: Log cart products trước khi tạo checkout
      console.log('🛒 Cart products for checkout:', JSON.stringify(cart.products, null, 2));
      
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: formattedAddress,
          paymentMethod: selectedPaymentMethod === "zalopay" ? "ZaloPay" : "PayPal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        // Lưu checkoutId vào localStorage để dùng sau khi thanh toán
        localStorage.setItem('currentCheckoutId', res.payload._id);
        toast.success("Đã tạo đơn hàng thành công!");
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      console.log('🎯 PayPal payment success:', details);
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      
      if (response.status === 200) {
        // Finalize checkout KHÔNG navigate
        await handleFinalizeCheckoutSilent(checkoutId);
        
        // Clear cart sau khi thanh toán thành công
        dispatch(clearCart());
        // Xóa checkoutId khỏi localStorage
        localStorage.removeItem('currentCheckoutId');
        
        // Redirect đến payment success page với thông tin PayPal
        const paymentParams = new URLSearchParams({
          method: 'PayPal',
          transactionId: details.id || details.orderID,
          amount: cart.totalPrice,
          status: 'success'
        });
        
        console.log('🔄 Redirecting to payment success with params:', paymentParams.toString());
        navigate(`/payment-success?${paymentParams.toString()}`);
        toast.success("Thanh toán PayPal thành công!");
      }
    } catch (error) {
      console.log("Lỗi thanh toán:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    }
  };

  const handleZaloPaySuccess = async () => {
    // ZaloPay sẽ redirect về trang success, xử lý ở đó
    toast.success("Đang xử lý thanh toán ZaloPay...");
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    toast.error(`Lỗi thanh toán: ${error}`);
  };

  // Finalize without navigation (for PayPal)
  const handleFinalizeCheckoutSilent = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        { source: 'PayPalCheckout' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log('✅ PayPal checkout finalized silently');
    } catch (error) {
      console.log("Lỗi finalize checkout:", error);
      throw error; // Re-throw để handle ở level trên
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500 text-lg">Error: {error}</p>
    </div>
  );

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-600">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          💳 Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Section - Shipping & Payment */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6 flex items-center">
              <FaShieldAlt className="mr-2 sm:mr-3 text-sm sm:text-base" />
              Thông tin thanh toán
            </h2>

            <form onSubmit={handleCreateCheckout} className="space-y-4 sm:space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Chi tiết liên hệ</h3>
                <div className="relative">
                  <input
                    type="email"
                    value={user ? user.email : ""}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    disabled
                  />
                  <span className="absolute right-3 sm:right-4 top-3 sm:top-4 text-green-500 text-sm sm:text-base">✓</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Email được lấy từ tài khoản của bạn</p>
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Thông tin giao hàng</h3>
                
                {/* Thông báo tự động điền */}
                {user && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-sm flex-shrink-0 mt-0.5">✓</span>
                      <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                        Thông tin đã được tự động điền từ hồ sơ của bạn (tên, email, số điện thoại, địa chỉ). Bạn có thể chỉnh sửa nếu cần.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <input
                    type="text"
                    placeholder="Họ"
                    value={shippingAddress.lastname}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        lastname: e.target.value,
                      })
                    }
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    value={shippingAddress.firstname}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        firstname: e.target.value,
                      })
                    }
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={shippingAddress.phonenumber}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phonenumber: e.target.value,
                      })
                    }
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value="Cần Thơ"
                      className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                      disabled
                    />
                    <span className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 text-sm sm:text-base">🔒</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Thành phố được cố định là Cần Thơ</p>

                <textarea
                  placeholder="Ghi chú đặc biệt (tùy chọn)"
                  value={shippingAddress.description}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                  rows="3"
                />
              </div>

              {/* Payment Method Selection */}
              {!checkoutId && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Chọn phương thức thanh toán</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`block p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-xl sm:text-2xl mr-2 sm:mr-3">{method.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{method.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-pink-500 bg-pink-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                          {method.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {!checkoutId ? (
                <div className="space-y-2 sm:space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Tiếp tục thanh toán
                  </button>
                  
                  {import.meta.env.DEV && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        💡 Debug: CheckoutId sẽ được tạo và lưu vào localStorage
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Hoàn tất thanh toán
                  </h3>
                  
                  {selectedPaymentMethod === "zalopay" && (
                    <div className="space-y-3 sm:space-y-4">
                      <ZaloPayButton
                        amount={cart.totalPrice}
                        orderInfo={`Đơn hàng Luna Bakery #${checkoutId.slice(-6)}`}
                        onSuccess={handleZaloPaySuccess}
                        onError={handlePaymentError}
                      />
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="text-blue-500 text-base sm:text-lg flex-shrink-0 mt-0.5">💡</div>
                          <div>
                            <h4 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">Hướng dẫn thanh toán ZaloPay</h4>
                            <p className="text-xs sm:text-sm text-blue-700">
                              Sau khi thanh toán thành công trên ZaloPay, bạn sẽ được chuyển về trang hoàn tất đơn hàng.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPaymentMethod === "paypal" && (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <PayPalButton
                        amount={cart.totalPrice}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Tóm tắt đơn hàng</h3>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {cart.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{product.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{product.flavor}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Size: {product.size}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Số lượng: {product.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-pink-600 text-sm sm:text-base">
                      {product.price?.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-2 sm:space-y-3">
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Tổng giá sản phẩm:</span>
                <span className="font-semibold">
                  {cart.totalPrice?.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold text-pink-600 pt-2 sm:pt-3 border-t border-gray-200">
                <span>Tổng cộng:</span>
                <span>{cart.totalPrice?.toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaShieldAlt className="text-green-500 text-xs sm:text-sm" />
                  <span>Bảo mật SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCreditCard className="text-blue-500 text-xs sm:text-sm" />
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
