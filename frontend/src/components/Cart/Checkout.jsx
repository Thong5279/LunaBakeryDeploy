import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PayPalButton from "./PayPalButton";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice"; // đường dẫn đúng theo cấu trúc project của bạn



const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    address: "",
    city: "",
    description: "",
  });

  //gio hang khong duoc tai truoc
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    const fullName = `${shippingAddress.firstname} ${shippingAddress.lastname}`;

    const formattedAddress = {
      ...shippingAddress,
      name: fullName, 
    };

    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: formattedAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }


  };

  const handlePaymentSuccess = async (details) => {
    try {
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
        // ✅ Gọi finalize để chuyển checkout thành order
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (error) {
      console.log("Lỗi thanh toán PayPal:", error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {}, // Empty body
        {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          },
        }
      );
      navigate("/orders-confirmation");
    } catch (error) {
      console.log("Lỗi finalize checkout:", error)
    }
  };
  if(loading) return <p>Đang tải giỏ hàng...</p>;
  if(error) return <p>Error: {error}</p>;
  if(!cart || !cart.products || cart.products.length === 0){
    return <p>Giỏ hàng của bạn đang trống</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter ">
      {/* left section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6 text-pink-500">Thanh toán</h2>
        <form action="" onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4"> Chi tiết liên hệ </h3>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user? user.email : ""}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Thông tin giao hàng</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="block text-gray-600">
                Họ
              </label>
              <input
                type="text"
                value={shippingAddress.lastname}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastname: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
            </div>

            <div>
              <label htmlFor="" className="block text-gray-600">
                Tên
              </label>
              <input
                type="text"
                value={shippingAddress.firstname}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstname: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              required
            />
          </div>

          <div className="mb-4 gird gird-cols-2 gap-4">
            <div>
              <label htmlFor="" className="block text-gray-600">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={shippingAddress.phonenumber}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phonenumber: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
            </div>
            <div>
              <label htmlFor="" className="block text-gray-600">
                Thành phố
              </label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-600">
              Mô tả
            </label>
            <textarea
              value={shippingAddress.description}
              placeholder="bạn có thể cho chúng tôi tên lời chúc tốt đẹp... hoặc để tặng nến sinh nhật nếu có nhé :)"
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              rows="3"
            ></textarea>
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Tiếp tục hình thức thanh toán
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Thanh toán với Paypal</h3>
                {/* Paypal compnent */}
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed: ")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Tổng đơn hàng</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start ">
                <img
                  src={product.image}
                  referrerPolicy="no-referrer"
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4 rounded"
                />
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{product.flavor}</p>
                  <p className="text-gray-600 text-sm">Size : {product.size}</p>
                  {/* <p className="text-gray-500 text-xs">{item.description}</p> */}
                  <p className="text-gray-500 text-xs mt-1">Số lượng: 1</p>
                </div>
              </div>
              <p className="text-xl">
                {product.price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Tổng giá sản phẩm</p>
          <p>
            $
            {cart.totalPrice?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p> Phí vận chuyển </p>
          <p>miễn phí</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Tổng cộng</p>
          <p>
            {cart.totalPrice?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
