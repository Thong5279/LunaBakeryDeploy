import React, { use } from "react";
import { Link } from "react-router-dom";

const AdminHomePage = () => {
  const orders = [
    {
      _id: "123456",
      user: {
        name: "Nguyen Van A",
      },
      totalPrice: 500000,
      status: "Đang xử lý",
    },
    {
      _id: "789012",
      user: {
        name: "Tran Thi B",
      },
      totalPrice: 300000,
      status: "Đã giao hàng",
    },
    {
      _id: "345678",
      user: {
        name: "Le Van C",
      },
      totalPrice: 700000,
      status: "Đang giao hàng",
    },
    {
      _id: "901234",
      user: {
        name: "Pham Thi D",
      },
      totalPrice: 200000,
      status: "Đã hủy",
    },
    {
      _id: "567890",
      user: {
        name: "Hoang Van E",
      },
      totalPrice: 600000,
      status: "Đang xử lý",
    },
    {
      _id: "234567",
      user: {
        name: "Nguyen Thi F",
      },
      totalPrice: 400000,
      status: "Đã giao hàng",
    },

    {
        _id: "890123",
        user: {
            name: "Tran Van G",
        },
        totalPrice: 800000,
        status: "Đang giao hàng",
        },
        {
        _id: "456789",
        user: {
            name: "Le Thi H",
        },
        totalPrice: 900000,
        status: "Đã hủy",
        },
        {
        _id: "123789",
        user: {
            name: "Pham Van I",
        },
        totalPrice: 1000000,
        status: "Đang xử lý",
        },
        {
        _id: "789456",
        user: {
            name: "Hoang Thi J",
        },
        totalPrice: 1100000,
        status: "Đã giao hàng",
        },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trang quản trị viên </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Doanh thu</h2>
          <p className="text-2xl">1.000.000vnđ</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Tổng số đơn hàng</h2>
          <p className="text-2xl">100</p>
          <Link to="/admin/orders" className="text-pink-500 hover:underline">Quản lý đơn hàng</Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
          <p className="text-2xl">200</p>
          <Link to="/admin/products" className="text-pink-500 hover:underline">Quản lý sản phẩm</Link>
        </div>
        
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
        <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                    <th className="py-3 px-4 "> Mã đơn </th>
                    <th className="py-3 px-4 ">Người dùng</th>
                    <th className="py-3 px-4 "> Giá bán</th>
                    <th className="py-3 px-4 ">Tình trạng</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                     orders.map((order) => (
                        <tr key={order._id}  className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="py-3 px-4">#{order._id}</td>
                            <td className="py-3 px-4">{order.user.name}</td>
                            <td className="py-3 px-4">{order.totalPrice} vnđ</td>
                            <td className="py-3 px-4">{order.status}</td>
                        </tr>
                     ))
                ) :(
                        <tr>
                            <td colSpan="4" className="py-3 px-4 text-center text-gray-500">Không có đơn hàng nào</td>
                        </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomePage;
