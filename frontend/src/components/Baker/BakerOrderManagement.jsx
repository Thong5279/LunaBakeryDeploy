import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBakerOrders, startBaking, completeBaking } from '../../redux/slices/bakerOrderSlice';
import { toast } from 'sonner';
import ConfirmModal from '../Common/ConfirmModal';

const BakerOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.bakerOrders);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
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
    dispatch(fetchBakerOrders());
  }, [dispatch]);

  // Lọc và sắp xếp đơn hàng
  const filteredAndSortedOrders = orders
    .filter(order => {
      // Lọc theo từ khóa tìm kiếm
      const searchLower = searchTerm.toLowerCase();
      const orderId = order._id.toLowerCase();
      const customerName = order.user?.name?.toLowerCase() || '';
      const customerEmail = order.user?.email?.toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
        orderId.includes(searchLower) ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower);

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

  const handleStartBaking = async (orderId) => {
    try {
      await dispatch(startBaking(orderId)).unwrap();
      toast.success('Đã bắt đầu làm bánh!');
      dispatch(fetchBakerOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi bắt đầu làm bánh');
    }
  };

  const handleCompleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCompleteModal(true);
  };

  const handleCompleteConfirm = async () => {
    try {
      await dispatch(completeBaking(selectedOrderId)).unwrap();
      toast.success('Đã hoàn thành làm bánh!');
      dispatch(fetchBakerOrders());
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi hoàn thành làm bánh');
    } finally {
      setShowCompleteModal(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'Chờ làm bánh';
      case 'baking':
        return 'Đang làm bánh';
      case 'ready':
        return 'Đã làm xong';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      case 'baking':
        return 'text-orange-600 bg-orange-100';
      case 'ready':
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
          onClick={() => dispatch(fetchBakerOrders())}
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Nhân viên làm bánh</h1>
          <p className="text-gray-600 mt-1">
            Quản lý quá trình sản xuất bánh
          </p>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="https://clipart-library.com/images/rijKyMB7T.gif" 
            alt="Thợ làm bánh đang làm việc" 
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
                src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NDNtcXNjMmZmNHc5d3o2bHd3N3Fpem93dWdidXdhbjJ3YTRhdmk1ciZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/hW3Bo0xqFsllVryZ3J/giphy.gif" 
                alt="Tổng đơn hàng" 
                className="w-26 h-26 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Chờ làm bánh</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.filter(order => order.status === 'approved').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MGRzdGdlam1iYjhxb3Vmc3kyM3hjOWR3cGFrcjJhbWI3OWtpaTV1NyZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/f6sXmBxrDcZMGr0551/giphy.gif" 
                alt="Chờ làm bánh" 
                className="w-26 h-26 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Đang làm bánh</h3>
              <p className="text-3xl font-bold text-orange-600">
                {orders.filter(order => order.status === 'baking').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MG9xZWRmdDhrbXdocDBwbTZncnN2d2xoMTFpMDB1cHpsN3BnbXBkYSZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/AS8yqmf0UQyjb0eqgx/giphy.gif" 
                alt="Đang làm bánh" 
                className="w-26 h-26 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-700">Đã làm xong</h3>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter(order => order.status === 'ready').length}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NDNtcXNjMmZmNHc5d3o2bHd3N3Fpem93dWdidXdhbjJ3YTRhdmk1ciZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/Qs7qUlu5WjSrX4qTun/giphy.gif" 
                alt="Đã làm xong" 
                className="w-26 h-26 rounded-lg"
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
              placeholder="Tìm theo mã đơn hàng, tên khách hàng..."
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
              <option value="approved">Chờ làm bánh</option>
              <option value="baking">Đang làm bánh</option>
              <option value="ready">Đã làm xong</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.name} x{item.quantity}
                          {item.size && <span className="text-gray-500"> ({item.size})</span>}
                          {item.flavor && <span className="text-gray-500"> - {item.flavor}</span>}
                        </div>
                      ))}
                    </div>
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
                    {order.status === 'approved' && (
                      <button
                        onClick={() => handleStartBaking(order._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Bắt đầu làm bánh
                      </button>
                    )}
                    {order.status === 'baking' && (
                      <button
                        onClick={() => handleCompleteClick(order._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <span className="text-xs text-gray-500">
                        Chờ giao hàng
                      </span>
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

      {/* Confirm Complete Modal */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleCompleteConfirm}
        title="Xác nhận hoàn thành"
        message="Bạn có chắc chắn đã hoàn thành làm bánh cho đơn hàng này? Sau khi xác nhận, đơn hàng sẽ được chuyển sang phòng giao hàng."
        type="success"
        confirmText="Hoàn thành"
        cancelText="Tiếp tục làm"
      />
    </div>
  );
};

export default BakerOrderManagement; 