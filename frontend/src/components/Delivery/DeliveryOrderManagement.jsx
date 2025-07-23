import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryOrders, startShipping, markCannotDeliver, markDelivered } from '../../redux/slices/deliveryOrderSlice';
import { toast } from 'sonner';
import ConfirmModal from '../Common/ConfirmModal';

const CannotDeliverModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do không thể giao hàng');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Không thể giao hàng</h2>
          <p className="text-gray-600 mb-4">
            Vui lòng nhập lý do không thể giao hàng để thông báo cho quản lý và khách hàng.
          </p>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Nhập lý do không thể giao hàng..."
            className={`w-full p-2 border rounded-lg mb-2 h-32 resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                onClose();
                setReason('');
                setError('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.deliveryOrders);
  const [showCannotDeliverModal, setShowCannotDeliverModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State cho tính năng lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    dispatch(fetchDeliveryOrders());
  }, [dispatch]);

  // Lọc và sắp xếp đơn hàng
  const filteredAndSortedOrders = orders
    .filter(order => {
      // Lọc theo từ khóa tìm kiếm
      const searchLower = searchTerm.toLowerCase();
      const orderId = order._id.toLowerCase();
      const customerName = order.user?.name?.toLowerCase() || '';
      const customerEmail = order.user?.email?.toLowerCase() || '';
      const customerPhone = order.shippingAddress?.phonenumber?.toLowerCase() || '';
      const customerAddress = order.shippingAddress?.address?.toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
        orderId.includes(searchLower) ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerPhone.includes(searchLower) ||
        customerAddress.includes(searchLower);

      // Lọc theo trạng thái
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Lọc theo ngày
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
          break;
        case 'lastWeek':
          matchesDate = orderDate >= lastWeek;
          break;
        case 'lastMonth':
          matchesDate = orderDate >= lastMonth;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'customerName':
          aValue = a.user?.name || '';
          bValue = b.user?.name || '';
          break;
        case 'orderId':
          aValue = a._id;
          bValue = b._id;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'customerPhone':
          aValue = a.shippingAddress?.phonenumber || '';
          bValue = b.shippingAddress?.phonenumber || '';
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleStartShipping = async (orderId) => {
    try {
      await dispatch(startShipping(orderId)).unwrap();
      toast.success('Đã bắt đầu giao hàng!');
      dispatch(fetchDeliveryOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi bắt đầu giao hàng');
    }
  };

  const handleCannotDeliverClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCannotDeliverModal(true);
  };

  const handleCannotDeliverConfirm = async (reason) => {
    try {
      await dispatch(markCannotDeliver({ id: selectedOrderId, reason })).unwrap();
      toast.success('Đã cập nhật trạng thái không thể giao hàng!');
      dispatch(fetchDeliveryOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setShowCannotDeliverModal(false);
      setSelectedOrderId(null);
    }
  };

  const handleMarkDeliveredClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeliveredModal(true);
  };

  const handleMarkDeliveredConfirm = async () => {
    try {
      await dispatch(markDelivered(selectedOrderId)).unwrap();
      toast.success('Đã giao hàng thành công!');
      dispatch(fetchDeliveryOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi đánh dấu giao hàng thành công');
    } finally {
      setShowDeliveredModal(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return 'Sẵn sàng giao hàng';
      case 'shipping':
        return 'Đang giao hàng';
      case 'cannot_deliver':
        return 'Không thể giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return 'text-blue-600 bg-blue-100';
      case 'shipping':
        return 'text-purple-600 bg-purple-100';
      case 'cannot_deliver':
        return 'text-red-600 bg-red-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
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
          onClick={() => dispatch(fetchDeliveryOrders())}
          className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Nhân viên giao hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý quá trình giao hàng
          </p>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="https://cdn-icons-png.flaticon.com/128/3272/3272682.png" 
            alt="Nhân viên giao hàng" 
            className="w-20 h-20 rounded-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://cdn-icons-gif.flaticon.com/14357/14357121.gif" 
                alt="Tổng đơn hàng" 
                className="w-26 h-26 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Chờ giao hàng</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.filter(order => order.status === 'ready').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://cdn-icons-gif.flaticon.com/18485/18485058.gif" 
                alt="Chờ giao hàng" 
                className="w-26 h-26 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Đang giao hàng</h3>
              <p className="text-3xl font-bold text-purple-600">
                {orders.filter(order => order.status === 'shipping').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://cdn-icons-gif.flaticon.com/11933/11933522.gif" 
                alt="Đang giao hàng" 
                className="w-26 h-26 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Đã giao hàng</h3>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter(order => order.status === 'delivered').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://cdn-icons-gif.flaticon.com/11614/11614839.gif" 
                alt="Đã giao hàng" 
                className="w-26 h-26 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo mã đơn hàng, tên khách hàng, SĐT, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="ready">Chờ giao hàng</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="cannot_deliver">Không thể giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="lastWeek">Tuần này</option>
              <option value="lastMonth">Tháng này</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="customerName-asc">Tên A-Z</option>
              <option value="customerName-desc">Tên Z-A</option>
              <option value="status-asc">Trạng thái A-Z</option>
              <option value="status-desc">Trạng thái Z-A</option>
              <option value="customerPhone-asc">SĐT A-Z</option>
              <option value="customerPhone-desc">SĐT Z-A</option>
            </select>
          </div>
        </div>

        {/* Filter Summary and Clear Button */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị {filteredAndSortedOrders.length} / {orders.length} đơn hàng
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <span className="ml-2 text-pink-600">
                (Đã lọc)
              </span>
            )}
          </div>
          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-pink-600 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ giao hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{order.shippingAddress?.name}</div>
                      <div>{order.shippingAddress?.address}</div>
                      <div>{order.shippingAddress?.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.shippingAddress?.phonenumber || 'Chưa có'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {order.status === 'ready' && (
                      <button onClick={() => handleStartShipping(order._id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Bắt đầu giao hàng</button>
                    )}
                    {order.status === 'shipping' && (
                      <>
                        <button onClick={() => handleMarkDeliveredClick(order._id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Đã giao hàng</button>
                        <button onClick={() => handleCannotDeliverClick(order._id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Không thể giao</button>
                      </>
                    )}
                    {order.status === 'cannot_deliver' && (
                      <span className="text-xs text-red-500">Giao hàng thất bại</span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-xs text-green-500">Hoàn thành giao hàng</span>
                    )}
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
              ))}
            </tbody>
          </table>
          {filteredAndSortedOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {orders.length === 0 ? 'Không có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp với bộ lọc'}
              </p>
            </div>
          )}
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
                <div><span className="font-medium">Thành phố:</span> {selectedOrder.shippingAddress?.city || 'Không xác định'}</div>
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
            {selectedOrder.status === 'cannot_deliver' && selectedOrder.cannotDeliverReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">Lý do không thể giao hàng</h4>
                <p className="text-red-700 text-sm">{selectedOrder.cannotDeliverReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cannot Deliver Modal */}
      <CannotDeliverModal
        isOpen={showCannotDeliverModal}
        onClose={() => {
          setShowCannotDeliverModal(false);
          setSelectedOrderId(null);
        }}
        onConfirm={handleCannotDeliverConfirm}
      />

      {/* Delivered Modal */}
      <ConfirmModal
        isOpen={showDeliveredModal}
        onClose={() => setShowDeliveredModal(false)}
        onConfirm={handleMarkDeliveredConfirm}
        title="Xác nhận giao hàng thành công"
        message="Bạn có chắc chắn đã giao hàng thành công? Khách hàng đã nhận được đơn hàng và hài lòng với sản phẩm?"
        type="success"
        confirmText="Đã giao thành công"
        cancelText="Kiểm tra lại"
      />
    </div>
  );
};

export default DeliveryOrderManagement; 