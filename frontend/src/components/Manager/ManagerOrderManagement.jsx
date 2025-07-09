import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagerOrders, approveOrder, cancelOrder } from '../../redux/slices/managerOrderSlice';
import { toast } from 'sonner';
import ConfirmModal from '../Common/ConfirmModal';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const ManagerOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.managerOrders);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    dispatch(fetchManagerOrders());
  }, [dispatch]);

  const handleApprove = async (orderId) => {
    try {
      await dispatch(approveOrder(orderId)).unwrap();
      toast.success('Đơn hàng đã được duyệt thành công!');
      dispatch(fetchManagerOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi duyệt đơn hàng');
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await dispatch(cancelOrder(selectedOrderId)).unwrap();
      toast.success('Đơn hàng đã được hủy thành công!');
      dispatch(fetchManagerOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setShowCancelModal(false);
      setSelectedOrderId(null);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  // Lọc và sắp xếp đơn hàng
  const filteredAndSortedOrders = orders
    .filter(order => {
      // Lọc theo trạng thái
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      // Lọc theo từ khóa tìm kiếm
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        order._id.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower) ||
        order.totalPrice?.toString().includes(searchLower);
      
      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      // Đơn hàng pending luôn lên đầu
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;

      // Sắp xếp theo trường được chọn
      let comparison = 0;
      switch (sortConfig.key) {
        case 'orderId':
          comparison = a._id.localeCompare(b._id);
          break;
        case 'customerName':
          comparison = (a.user?.name || '').localeCompare(b.user?.name || '');
          break;
        case 'totalPrice':
          comparison = (a.totalPrice || 0) - (b.totalPrice || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

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
          onClick={() => dispatch(fetchManagerOrders())}
          className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý và theo dõi trạng thái các đơn hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Chờ duyệt</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {orders.filter(order => order.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đã duyệt</h3>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter(order => order.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đã hủy</h3>
          <p className="text-3xl font-bold text-red-600">
            {orders.filter(order => order.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Search Box */}
        <div className="flex-1 min-w-[300px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="baking">Đang làm bánh</option>
          <option value="ready">Sẵn sàng giao</option>
          <option value="shipping">Đang giao hàng</option>
          <option value="delivered">Đã giao hàng</option>
          <option value="cancelled">Đã hủy</option>
          <option value="cannot_deliver">Không thể giao</option>
        </select>
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
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderId')}
                >
                  <div className="flex items-center">
                    Mã đơn hàng
                    {getSortIcon('orderId')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center">
                    Khách hàng
                    {getSortIcon('customerName')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalPrice')}
                >
                  <div className="flex items-center">
                    Tổng tiền
                    {getSortIcon('totalPrice')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Ngày đặt
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(order.totalPrice)} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Duyệt đơn
                        </button>
                        <button
                          onClick={() => handleCancelClick(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}
                    {order.status !== 'pending' && (
                      <span className={`text-xs ${
                        order.status === 'approved' ? 'text-blue-600' : 
                        order.status === 'cancelled' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAndSortedOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Không tìm thấy đơn hàng nào phù hợp với từ khóa tìm kiếm'
                  : statusFilter === 'all' 
                    ? 'Không có đơn hàng nào' 
                    : `Không có đơn hàng nào ở trạng thái ${getStatusText(statusFilter)}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Cancel Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Hủy đơn hàng"
        cancelText="Giữ lại"
      />
    </div>
  );
};

export default ManagerOrderManagement; 