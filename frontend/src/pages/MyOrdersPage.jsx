import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";


const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  console.log("Orders state:", orders, loading, error);
  useEffect(() => {
    console.log("Fetching orders...");
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`); // Chuyển hướng đến trang chi tiết đơn hàng
  };
  if(loading) return <p>Đang tải...</p>
  if(error) return <p>Error: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Đơn hàng của tôi</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gary-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Ảnh</th>
              <th className="py-2 px-4 sm:py-3">ID đơn hàng</th>
              <th className="py-2 px-4 sm:py-3">Ngày đặt hàng</th>
              <th className="py-2 px-4 sm:py-3">Địa chỉ giao hàng</th>
              <th className="py-2 px-4 sm:py-3">Sản phẩm</th>
              <th className="py-2 px-4 sm:py-3">Tổng tiền</th>
              <th className="py-2 px-4 sm:py-3">Trạng thái thanh toán</th>
              <th className="py-2 px-4 sm:py-3">Thêm</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)} // Chuyển hướng đến trang chi tiết đơn hàng
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:h-12 sm:w-12 object-cover rounded"
                    />
                  </td>
                  {/* id sản phẩm  */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium whitespace-nowrap">
                    #{order._id}
                  </td>
                  {/* ngày đặt hàng */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {/* địa chỉ giao hàng */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {`${
                      order.shippingAddress
                        ? ` ${order.shippingAddress.address}, ${order.shippingAddress.city}`
                        : "Chưa có địa chỉ"
                    }`}
                  </td>
                  {/* sản phẩm */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.map((item) => item.name).join(", ")}
                  </td>
                  {/* tổng tiền */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  {/* trạng thái thanh toán */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>
                  {/* thao tác */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Thao tác</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="py-4 px-4 text-center text-[#db2777]"
                >
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
