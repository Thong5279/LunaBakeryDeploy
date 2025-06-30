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

  useEffect(() => {
    dispatch(fetchBakerOrders());
  }, [dispatch]);

  const handleStartBaking = async (orderId) => {
    try {
      await dispatch(startBaking(orderId)).unwrap();
      toast.success('Đã bắt đầu làm bánh!');
      dispatch(fetchBakerOrders()); // Refresh orders
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
      dispatch(fetchBakerOrders()); // Refresh orders
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi hoàn thành làm bánh');
    } finally {
      setShowCompleteModal(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Approved':
        return 'Chờ làm bánh';
      case 'Baking':
        return 'Đang làm bánh';
      case 'Ready':
        return 'Đã làm xong';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-blue-600 bg-blue-100';
      case 'Baking':
        return 'text-orange-600 bg-orange-100';
      case 'Ready':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Nhân viên làm bánh</h1>
        <p className="text-gray-600 mt-1">
          Quản lý quá trình sản xuất bánh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Chờ làm bánh</h3>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter(order => order.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đang làm bánh</h3>
          <p className="text-3xl font-bold text-orange-600">
            {orders.filter(order => order.status === 'Baking').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đã làm xong</h3>
          <p className="text-3xl font-bold text-green-600">
            {orders.filter(order => order.status === 'Ready').length}
          </p>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
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
                    {order.status === 'Approved' && (
                      <button
                        onClick={() => handleStartBaking(order._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Bắt đầu làm bánh
                      </button>
                    )}
                    {order.status === 'Baking' && (
                      <button
                        onClick={() => handleCompleteClick(order._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <span className="text-xs text-gray-500">
                        Chờ giao hàng
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>

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