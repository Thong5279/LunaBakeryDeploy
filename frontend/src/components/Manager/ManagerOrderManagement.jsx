import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagerOrders, approveOrder, cancelOrder } from '../../redux/slices/managerOrderSlice';
import { toast } from 'sonner';
import ConfirmModal from '../Common/ConfirmModal';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hủy đơn hàng');
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
          <h2 className="text-xl font-bold mb-4 text-gray-900">Xác nhận hủy đơn hàng</h2>
          <p className="text-gray-600 mb-4">
            Vui lòng nhập lý do hủy đơn hàng để thông báo cho khách hàng.
          </p>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Nhập lý do hủy đơn hàng..."
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
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleCancelConfirm = async (reason) => {
    try {
      await dispatch(cancelOrder({ id: selectedOrderId, cancelReason: reason })).unwrap();
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

  const getStatusLabel = (status) => {
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

  // Tổng hợp dữ liệu trạng thái đơn hàng cho biểu đồ
  const statusCounts = orders.reduce((acc, order) => {
    const label = getStatusLabel(order.status);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // Chờ xử lý - vàng
          'rgba(59, 130, 246, 0.8)',  // Đã duyệt - xanh dương
          'rgba(249, 115, 22, 0.8)',  // Đang làm bánh - cam
          'rgba(147, 51, 234, 0.8)',  // Sẵn sàng giao hàng - tím
          'rgba(34, 197, 94, 0.8)',   // Đã giao hàng - xanh lá
          'rgba(239, 68, 68, 0.8)',   // Đã hủy/Không thể giao hàng - đỏ
          'rgba(99, 102, 241, 0.8)',  // Đang giao hàng - xanh chàm
          'rgba(156, 163, 175, 0.8)', // Không xác định - xám
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Phân bố trạng thái đơn hàng',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} đơn (${percentage}%)`;
          }
        }
      }
    },
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
      {/* Biểu đồ phân bố trạng thái đơn hàng */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố Trạng thái Đơn hàng</h3>
        <div className="h-80">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi tiết
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
            {selectedOrder.status === 'cannot_deliver' && selectedOrder.cannotDeliverReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">Lý do không thể giao hàng</h4>
                <p className="text-red-700 text-sm">{selectedOrder.cannotDeliverReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedOrderId(null);
        }}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default ManagerOrderManagement; 