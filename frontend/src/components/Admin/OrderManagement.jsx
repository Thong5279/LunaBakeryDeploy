import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, clearError } from "../../redux/slices/adminOrderSlice";
import { toast } from 'sonner';
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Xử lý tìm kiếm và lọc
  const filteredOrders = orders.filter(order => {
    let matchesSearch = true;
    let matchesStatus = true;
    let matchesDate = true;

    // Tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matchesSearch = 
        order._id.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.shippingAddress?.phone?.includes(searchTerm);
    }

    // Lọc trạng thái
    if (statusFilter !== "all") {
      matchesStatus = order.status === statusFilter;
    }

    // Lọc ngày
    if (dateRange.startDate) {
      matchesDate = matchesDate && new Date(order.createdAt) >= new Date(dateRange.startDate);
    }
    if (dateRange.endDate) {
      matchesDate = matchesDate && new Date(order.createdAt) <= new Date(dateRange.endDate);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sắp xếp đơn hàng
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "highest":
        return b.totalPrice - a.totalPrice;
      case "lowest":
        return a.totalPrice - b.totalPrice;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const approvedOrders = orders.filter(order => order.status === 'approved').length;
  const bakingOrders = orders.filter(order => order.status === 'baking').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const shippingOrders = orders.filter(order => order.status === 'shipping').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
  const cannotDeliverOrders = orders.filter(order => order.status === 'cannot_deliver').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Tổng quan hệ thống</h1>
        <p className="text-gray-600 mt-1">
          Theo dõi trạng thái tất cả đơn hàng trong hệ thống
        </p>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tìm kiếm */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Lọc theo trạng thái */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="baking">Đang làm bánh</option>
              <option value="ready">Sẵn sàng giao hàng</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
              <option value="cannot_deliver">Không thể giao hàng</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="relative">
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Giá cao nhất</option>
              <option value="lowest">Giá thấp nhất</option>
            </select>
          </div>

          {/* Lọc theo ngày */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Đến ngày"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <h3 className="text-sm font-semibold text-gray-700">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-700">Chờ duyệt</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-700">Đã duyệt</h3>
          <p className="text-2xl font-bold text-blue-600">{approvedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-sm font-semibold text-gray-700">Đang làm bánh</h3>
          <p className="text-2xl font-bold text-orange-600">{bakingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-700">Chờ giao hàng</h3>
          <p className="text-2xl font-bold text-purple-600">{readyOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
          <h3 className="text-sm font-semibold text-gray-700">Đang giao hàng</h3>
          <p className="text-2xl font-bold text-indigo-600">{shippingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-700">Đã giao hàng</h3>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-semibold text-gray-700">Đã hủy/Lỗi</h3>
          <p className="text-2xl font-bold text-red-600">{cancelledOrders + cannotDeliverOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Danh sách đơn hàng</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái hiện tại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cập nhật trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.user?.name || "Không xác định"}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || ""}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Intl.NumberFormat("vi-VN").format(order.totalPrice)} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="baking">Đang làm bánh</option>
                        <option value="ready">Sẵn sàng giao hàng</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="delivered">Đã giao hàng</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="cannot_deliver">Không thể giao hàng</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-xs"
                        onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
                      <p className="text-sm">Thử thay đổi bộ lọc để tìm kiếm lại</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl"
              onClick={() => setShowDetailModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-pink-600 mb-4">Chi tiết đơn hàng #{selectedOrder._id.slice(-8)}</h2>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Thông tin khách hàng</h3>
              <div className="text-sm text-gray-700">
                <div><span className="font-medium">Tên:</span> {selectedOrder.user?.name || 'Không xác định'}</div>
                <div><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'Không xác định'}</div>
                <div><span className="font-medium">SĐT:</span> {selectedOrder.shippingAddress?.phonenumber || 'Không xác định'}</div>
                <div><span className="font-medium">Địa chỉ:</span> {selectedOrder.shippingAddress?.address || 'Không xác định'}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Sản phẩm đã mua</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border">Tên sản phẩm</th>
                      <th className="px-3 py-2 border">Số lượng</th>
                      <th className="px-3 py-2 border">Size</th>
                      <th className="px-3 py-2 border">Vị</th>
                      <th className="px-3 py-2 border">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 border">{item.name}</td>
                        <td className="px-3 py-2 border text-center">{item.quantity}</td>
                        <td className="px-3 py-2 border text-center">{item.size || '-'}</td>
                        <td className="px-3 py-2 border text-center">{item.flavor || '-'}</td>
                        <td className="px-3 py-2 border text-right">{item.price?.toLocaleString('vi-VN')} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Chờ xử lý';
    case 'approved':
      return 'Đã duyệt';
    case 'baking':
      return 'Đang làm bánh';
    case 'ready':
      return 'Sẵn sàng giao hàng';
    case 'shipping':
      return 'Đang giao hàng';
    case 'delivered':
      return 'Đã giao hàng';
    case 'cancelled':
      return 'Đã hủy';
    case 'cannot_deliver':
      return 'Không thể giao hàng';
    default:
      return 'Không xác định';
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'approved':
      return 'text-blue-700 bg-blue-100 border-blue-200';
    case 'baking':
      return 'text-orange-700 bg-orange-100 border-orange-200';
    case 'ready':
      return 'text-purple-700 bg-purple-100 border-purple-200';
    case 'shipping':
      return 'text-indigo-700 bg-indigo-100 border-indigo-200';
    case 'delivered':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'cancelled':
      return 'text-red-700 bg-red-100 border-red-200';
    case 'cannot_deliver':
      return 'text-red-700 bg-red-100 border-red-200';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

export default OrderManagement;
