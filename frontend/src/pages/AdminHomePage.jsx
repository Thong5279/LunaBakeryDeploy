import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { 
  FaShoppingCart, 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCrown,
  FaMapMarkerAlt
} from "react-icons/fa";

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

  // Tính toán thống kê
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'cancelled':
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  if (productLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (productError || orderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 text-lg">Lỗi khi tải dữ liệu</p>
          <p className="text-gray-500 text-sm mt-2">{productError || orderError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 p-8 rounded-2xl shadow-sm mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
              <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXN1ZjR2NmM2Z3QxYnRvb2RqOW1pc29kMXR4eWNkcTQwZ3M1MmtrZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Xxq7xGRiH0asGf5PXD/giphy.gif" alt="" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Chào mừng đến với Luna Bakery
              </h1>
              <p className="text-gray-600 text-lg">
                Bảng điều khiển quản trị - Theo dõi và quản lý hoạt động kinh doanh
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-pink-500" />
                  <span className="text-gray-600">{new Date().toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <span className="text-gray-600">LunaBakery Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Doanh thu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium mb-1">Tổng doanh thu</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Intl.NumberFormat("vi-VN").format(totalSales)}
                </p>
                <p className="text-gray-500 text-sm mt-1">VNĐ</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                <FaChartLine className="text-pink-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Tổng đơn hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Tổng đơn hàng</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                <p className="text-blue-500 text-sm mt-1">Đơn hàng</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Sản phẩm</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                <p className="text-green-500 text-sm mt-1">Sản phẩm</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <FaBox className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Đơn hàng chờ xử lý */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Chờ xử lý</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
                <p className="text-purple-500 text-sm mt-1">Đơn hàng</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <FaClock className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/admin/orders" 
            className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý đơn hàng</h3>
                <p className="text-gray-600">Xem và xử lý đơn hàng</p>
              </div>
              <FaShoppingCart className="text-3xl text-pink-600" />
            </div>
          </Link>

          <Link 
            to="/admin/products" 
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý sản phẩm</h3>
                <p className="text-gray-600">Thêm, sửa, xóa sản phẩm</p>
              </div>
              <FaBox className="text-3xl text-blue-600" />
            </div>
          </Link>

          <Link 
            to="/admin/users" 
            className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý người dùng</h3>
                <p className="text-gray-600">Quản lý tài khoản</p>
              </div>
              <FaUsers className="text-3xl text-green-600" />
            </div>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Đơn hàng gần đây</h2>
            <p className="text-gray-600 text-sm mt-1">Danh sách các đơn hàng mới nhất</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user?.name || "Không xác định"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat("vi-VN").format(order.totalPrice)} VNĐ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                          <FaEye className="text-lg" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                          <FaEdit className="text-lg" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
                      <p className="text-sm">Đơn hàng đầu tiên sẽ xuất hiện ở đây</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {orders.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Link 
                to="/admin/orders" 
                className="text-pink-600 hover:text-pink-800 font-medium transition-colors duration-200"
              >
                Xem tất cả đơn hàng →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
