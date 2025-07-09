import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, clearError } from "../../redux/slices/adminOrderSlice";
import { toast } from 'sonner';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

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
      console.log('Attempting to update status:', { orderId, status }); // Debug log
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      dispatch(fetchAllOrders());
    } catch (error) {
      console.error('Error in handleStatusChange:', error); // Debug log
      toast.error(error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái hiện tại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cập nhật trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || "Không xác định"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat("vi-VN").format(order.totalPrice)} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status || 'pending'} // Set default value if status is undefined
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
                      <p className="text-sm">Đơn hàng sẽ xuất hiện ở đây khi có khách đặt hàng</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
