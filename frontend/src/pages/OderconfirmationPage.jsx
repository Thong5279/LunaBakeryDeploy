import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Xác nhận đơn hàng thành công!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border mb-20">
          <div className="flex-4xl font-bold text-center text-emerald-700 mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Mã đơn hàng:{" "}
              <span className="text-emerald-600">{checkout._id}</span>
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <p className=" text-gray-500">
                Ngày mua:{" "}
                {new Date(checkout.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {/* estimated delivery dự kiến giao hàng */}
              <div>
                <p className="text-gray-600 text-sm">
                  Dự kiến giao hàng từ : {" "}
                  {calculateEstimatedDelivery(checkout.createdAt, 2)}-{" "}
                  {calculateEstimatedDelivery(checkout.createdAt, 4)}
                </p>
              </div>
            </div>
          </div>

          {/* order items */}
          <div className="mb-15 mt-15">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.img}
                  referrerPolicy="no-referrer"
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">
                    Vị: {item.flavor} - Kích thước: {item.size}
                  </p>
                  <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  <div></div>
                </div>
                <div>
                  <p className="text-gray-800 font-bold">
                    Giá:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* delivery info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Thanh Toán</h4>
              <p>PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Giao hàng</h4>
              <p className="">
                địa chỉ : {checkout.shippingAddress.adress} ,thành phố{" "}
                {checkout.shippingAddress.city},
              </p>

              <p>
                tên: {checkout.shippingAddress.firstname}{" "}
                {checkout.shippingAddress.lastname},
              </p>
              <p>Số điện thoại: {checkout.shippingAddress.phonenumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OderconfirmationPage;
