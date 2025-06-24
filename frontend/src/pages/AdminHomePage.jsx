import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trang quản trị viên </h1>
      {productLoading || orderLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : productError ? (
        <p>Lỗi khi tải dữ liệu: {productError}</p>
      ): orderError ? (
        <p>Lỗi khi tải dữ liệu: {orderError}</p>
      ): (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Doanh thu</h2>
          <p className="text-2xl"> {new Intl.NumberFormat("vi-VN").format(totalSales)} vnđ</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Tổng số đơn hàng</h2>
          <p className="text-2xl">{totalOrders}</p>
          <Link to="/admin/orders" className="text-pink-500 hover:underline">
            Quản lý đơn hàng
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
          <p className="text-2xl">{products.length}</p>
          <Link to="/admin/products" className="text-pink-500 hover:underline">
            Quản lý sản phẩm
          </Link>
        </div>
      </div>
      )}
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
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4">#{order._id}</td>
                  <td className="py-3 px-4">{order.user.name}</td>
                  <td className="py-3 px-4">
                    {new Intl.NumberFormat("vi-VN").format(order.totalPrice)}{" "}
                    vnđ
                  </td>
                  <td className="py-3 px-4">{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
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

export default AdminHomePage;
