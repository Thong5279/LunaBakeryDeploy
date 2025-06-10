import React from "react";

const OderManagement = () => {
  const orders = [
    {
      _id: 12312323,
      user: {
        name: "Pham huynh thong",
      },
      totalPrice: 110000,
      status: "Đang xử lý",
    },
  ];

  const handleStatusChange = (orderId, status) => {
    console.log({ id: orderId, status });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Mã đơn hàng</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Tổng giá</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-pink-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("vi-VN").format(order.totalPrice)}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      forced-ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đã giao hàng</option>
                      <option value="Delivered">Đã nhận hàng</option>
                      <option value="Cancelled">Huỷ đơn</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleStatusChange(order._id, "Delivered")}
                    className="bg-green-500 text-white px-4 py-2 rouded hover:bg-green-600">
                       Đánh dấu là đã giao hàng
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  ôi không nó trống trơn!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OderManagement;
