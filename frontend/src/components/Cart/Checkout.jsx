import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";

const cart = {
  products: [
    {
      name: "bánh tiramisu",
      price: 50000,
      size: "12cm",
      flavor: "socola",
      description:
        "Bánh tiramisu là một loại bánh ngọt truyền thống của Ý, nổi tiếng với hương vị cà phê đậm đà và lớp kem mascarpone mịn màng. Bánh thường được xếp lớp với bánh quy ladyfinger ngâm trong cà phê espresso, tạo nên sự kết hợp hoàn hảo giữa vị ngọt và đắng.",
      img: "https://picsum.photos/150?random=1",
    },
    {
      name: "bánh kem dâu",
      price: 60000,
      size: "14cm",
      flavor: "dâu tây",
      description:
        "Bánh kem dâu là một loại bánh ngọt nhẹ nhàng, thường được làm từ lớp bánh bông lan mềm mịn, phủ kem tươi và trang trí bằng dâu tây tươi. Hương vị ngọt ngào của dâu tây kết hợp với kem tươi tạo nên một món tráng miệng hoàn hảo cho những ngày hè.",
      img: "https://picsum.photos/150?random=2",
    },
    {
      name: "bánh mousse trà xanh",
      price: 70000,
      size: "16cm",
      flavor: "trà xanh",
      description:
        "Bánh mousse trà xanh là một món tráng miệng thanh mát, được làm từ lớp mousse trà xanh mịn màng, thường được phủ lớp chocolate trắng hoặc kem tươi. Hương vị nhẹ nhàng của trà xanh kết hợp với độ béo ngậy của mousse tạo nên một trải nghiệm thú vị.",
      img: "https://picsum.photos/150?random=3",
    },
  ],
  totalPrice: 180000, // Tổng giá trị của các sản phẩm trong giỏ hàng
};

const Checkout = () => {
  const navigate = useNavigate();
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

  const handleCreateCheckout = (e) => { 
  e.preventDefault();
  setCheckoutId("checkout12345"); // Simulate checkout ID creation
}

    const handlePaymentSuccess = (details) => {
        console.log("Payment successful:", details);
        navigate("/orders-confimation"); // Redirect to orders page after successful payment
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
              value="ten@gmail.com"
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
                    <button type="submit" 
                    className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
                    >Tiếp tục hình thức thanh toán</button>
                ) : (
                    <div>
                        <h3 className="text-lg mb-4">Thanh toán với Paypal</h3>
                        {/* Paypal compnent */}
                        <PayPalButton 
                        amount={1000} 
                        onSuccess={handlePaymentSuccess} 
                        onError={(err) => alert("Payment failed: ")} />
                    
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
            className="flex items-start justify-between py-2 border-b">
            <div className="flex items-start ">
                <img src={product.img} alt={product .name} className="w-20 h-24 object-cover mr-4 rounded" />
                <div>
                    <h3 className="text-gray-800 font-semibold">{product.name}</h3>
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
                }
                )}
           </p>
          </div>   
            ))} 
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
        <p>Tổng giá sản phẩm</p>
        <p>
            ${cart.totalPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }
            )}
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
            }
            )}
        </p>
        </div>
      </div>
      
    </div>
  );
};

export default Checkout;
