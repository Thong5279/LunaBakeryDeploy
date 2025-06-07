import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "PayPal",
      shippingAddress: {
        address: "123 ly tu trong",
        district: "ninh kiều",
        city: "can tho",
      },
      orderItems: [
        {
          productId: "product1",
          name: "Bánh Tiramisu",
          price: 50000,
          size: "12cm",
          flavor: "Socola",
          img: "https://picsum.photos/150?random=1",
          quantity: 2,
        },
        {
          productId: "product2",
          name: "Bánh Kem Dâu",
          price: 60000,
          size: "14cm",
          flavor: "Dâu tây",
          img: "https://picsum.photos/150?random=2",
          quantity: 1,
        },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, [id]);
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 ">
      <h2 className=" text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-950">
        Đơn hàng chi tiết
      </h2>
      {!orderDetails ? (
        <p> không có đơn hàng nào </p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          {/* Order info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div className="">
              <h3 className="text-lg md:text-xl font-semibold text-pink-500">
                Mã đơn hàng:{" "}
                <span className="text-emerald-600">#{orderDetails._id}</span>
              </h3>
              <p className="text-gray-600">
                Ngày mua:{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className=" flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              {/* duyệt đơn hàng & chờ xử lý */}
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
                px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Đã duyệt" : "Chờ xử lý"}
              </span>
              {/* chờ giao hàng */}
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
                px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isDelivered ? "đã nhận" : "đang giao hàng"}
              </span>
            </div>
          </div>
          {/* khách hàng , thanh toán , thông tin vận chuyển */}
          <div className="gird grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {/*  */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-8 mb-8">
              <div className="">
                <h4 className="text-lg font-semibold mb-2 text-pink-500 ">
                  Thông tin thanh toán
                </h4>
                <p>Phương thức thanh toán : {orderDetails.paymentMethod}</p>
                <p>
                  Tình trạng giao dịch :{" "}
                  {orderDetails.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </p>
              </div>
              {/*  */}
              <div className="">
                <h4 className="text-lg font-semibold mb-2 text-pink-500">
                  Thông tin vận chuyển
                </h4>
                <p>Phương thức vận chuyển : {orderDetails.paymentMethod}</p>
                <p>
                  Tình trạng đơn hàng :{" "}
                  {`${orderDetails.shippingAddress.address},${orderDetails.shippingAddress.city}`}
                </p>
              </div>
            </div>
          </div>

          {/* danh sách sản phẩm  */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4 text-pink-500">
              Sản phẩm
            </h4>
            <table className="min-w-full text-gray-700 border border-gray-300 rounded-md overflow-hidden shadow-sm mb-6">
              <thead className="bg-gray-100 text-sm font-semibold text-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-gray-300">
                    Tên
                  </th>
                  <th className="py-3 px-4 text-center border-r border-gray-300">
                    Giá
                  </th>
                  <th className="py-3 px-4 text-center border-r border-gray-300">
                    Số lượng
                  </th>
                  <th className="py-3 px-4 text-center">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-gray-50 border-t border-gray-200"
                  >
                    <td className="py-3 px-4 flex items-center gap-4">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md border border-gray-300"
                      />
                      <Link
                        rel="stylesheet"
                        href=""
                        to={`/product/${item.productId}`}
                      >
                        <span className="text-sm font-medium text-purple-400">
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* trở về trang đơn hàng */}
          <Link to="/my-orders" className="text-purple-400 hover:underline">
            <span className="text-sm font-medium">Trở về trang đơn hàng</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
