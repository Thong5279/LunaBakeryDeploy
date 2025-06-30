import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagerOrders, approveOrder, cancelOrder } from '../../redux/slices/managerOrderSlice';
import { toast } from 'sonner';

const ManagerOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.managerOrders);

  useEffect(() => {
    dispatch(fetchManagerOrders());
  }, [dispatch]);

  const handleApprove = async (orderId) => {
    try {
      await dispatch(approveOrder(orderId)).unwrap();
      toast.success('Đơn hàng đã được duyệt thành công!');
      dispatch(fetchManagerOrders()); // Refresh orders
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi duyệt đơn hàng');
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success('Đơn hàng đã được hủy thành công!');
        dispatch(fetchManagerOrders()); // Refresh orders
      } catch (error) {
        toast.error(error || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
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
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Approved':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Quản lý</h1>
        <p className="text-gray-600 mt-1">
          Duyệt hoặc hủy các đơn hàng đang chờ xử lý
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đang chờ duyệt</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {orders.filter(order => order.status === 'Processing').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đã duyệt hôm nay</h3>
          <p className="text-3xl font-bold text-green-600">
            {orders.filter(order => 
              order.status === 'Approved' && 
              new Date(order.updatedAt).toDateString() === new Date().toDateString()
            ).length}
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
                  Tổng tiền
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.totalPrice?.toLocaleString()} VNĐ
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
                    {order.status === 'Processing' && (
                      <>
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {order.status !== 'Processing' && (
                      <span className="text-xs text-gray-500">
                        {order.status === 'Approved' ? 'Đã duyệt' : 'Đã hủy'}
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
    </div>
  );
};

export default ManagerOrderManagement; 