import React from "react";
import { useSelector } from "react-redux";
import { FaTruck, FaRoute, FaBoxOpen, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const DeliveryHomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-white/20 rounded-full flex items-center justify-center">
            <FaTruck className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chào mừng, {user?.name}!</h1>
            <p className="text-green-100">Trang làm việc dành cho nhân viên giao hàng</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Đơn cần giao</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaBoxOpen className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Đang giao</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaRoute className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Hoàn thành hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Khoảng cách</p>
              <p className="text-2xl font-bold text-gray-900">0 km</p>
            </div>
            <FaMapMarkerAlt className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Queue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng cần giao</h3>
          <div className="text-center py-8">
            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng cần giao</h4>
            <p className="text-gray-500">Các đơn hàng sẵn sàng giao sẽ hiển thị ở đây</p>
          </div>
        </div>

        {/* Delivery Route */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lộ trình giao hàng</h3>
          <div className="text-center py-8">
            <FaRoute className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có lộ trình</h4>
            <p className="text-gray-500">Lộ trình tối ưu sẽ được tạo tự động</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Hướng dẫn cho nhân viên giao hàng</h3>
        <div className="text-green-700 space-y-2">
          <p>• Kiểm tra danh sách đơn hàng cần giao trong ngày</p>
          <p>• Xác nhận thông tin khách hàng trước khi giao</p>
          <p>• Cập nhật trạng thái giao hàng theo thời gian thực</p>
          <p>• Liên hệ khách hàng khi có vấn đề về địa chỉ</p>
          <p>• Đảm bảo an toàn sản phẩm trong quá trình vận chuyển</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHomePage; 