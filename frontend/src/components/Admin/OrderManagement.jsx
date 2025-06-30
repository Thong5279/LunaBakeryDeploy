import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";
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

  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      dispatch(fetchAllOrders()); // Refresh orders
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing':
        return 'Đang xử lý';
      case 'Approved':
        return 'Đã duyệt';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Baking':
        return 'Đang làm bánh';
      case 'Ready':
        return 'Sẵn sàng giao hàng';
      case 'CannotDeliver':
        return 'Không thể giao hàng';
      case 'Delivered':
        return 'Đã giao hàng thành công';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Approved':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Cancelled':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'Baking':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Ready':
        return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'CannotDeliver':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'Delivered':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getWorkflowStage = (status) => {
    switch (status) {
      case 'Processing':
        return 'Chờ quản lý duyệt';
      case 'Approved':
        return 'Chờ nhân viên làm bánh';
      case 'Baking':
        return 'Nhân viên đang làm bánh';
      case 'Ready':
        return 'Chờ nhân viên giao hàng';
      case 'CannotDeliver':
        return 'Giao hàng thất bại';
      case 'Delivered':
        return 'Hoàn thành đơn hàng';
      case 'Cancelled':
        return 'Đơn hàng đã bị hủy';
      default:
        return 'Trạng thái không xác định';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">Lỗi: {error}</p>
        <button 
          onClick={() => dispatch(fetchAllOrders())}
          className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const processingOrders = orders.filter(order => order.status === 'Processing').length;
  const approvedOrders = orders.filter(order => order.status === 'Approved').length;
  const bakingOrders = orders.filter(order => order.status === 'Baking').length;
  const readyOrders = orders.filter(order => order.status === 'Ready').length;
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;
  const cannotDeliverOrders = orders.filter(order => order.status === 'CannotDeliver').length;

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
          <p className="text-2xl font-bold text-yellow-600">{processingOrders}</p>
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
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-700">Đã giao hàng</h3>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-semibold text-gray-700">Đã hủy</h3>
          <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-400">
          <h3 className="text-sm font-semibold text-gray-700">Giao thất bại</h3>
          <p className="text-2xl font-bold text-red-500">{cannotDeliverOrders}</p>
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
                  Giai đoạn workflow
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
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getWorkflowStage(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="Processing">Đang xử lý</option>
                        <option value="Approved">Đã duyệt</option>
                        <option value="Cancelled">Đã hủy</option>
                        <option value="Baking">Đang làm bánh</option>
                        <option value="Ready">Sẵn sàng giao hàng</option>
                        <option value="CannotDeliver">Không thể giao hàng</option>
                        <option value="Delivered">Đã giao hàng thành công</option>
                      </select>
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

      {/* Workflow Legend */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quy trình xử lý đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">1. Đang xử lý</p>
              <p className="text-xs text-gray-500">Chờ quản lý duyệt</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">2. Đã duyệt</p>
              <p className="text-xs text-gray-500">Chuyển cho nhân viên làm bánh</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">3. Đang làm bánh</p>
              <p className="text-xs text-gray-500">Nhân viên đang sản xuất</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">4. Sẵn sàng giao hàng</p>
              <p className="text-xs text-gray-500">Chờ nhân viên giao hàng</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">5. Đã giao hàng</p>
              <p className="text-xs text-gray-500">Hoàn thành đơn hàng</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Đã hủy</p>
              <p className="text-xs text-gray-500">Quản lý từ chối đơn hàng</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Giao hàng thất bại</p>
              <p className="text-xs text-gray-500">Không thể liên hệ khách hàng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
