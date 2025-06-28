import React from "react";
import { useSelector } from "react-redux";
import { FaBirthdayCake, FaClock, FaCalendar, FaChartLine } from "react-icons/fa";

const BakerHomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-white/20 rounded-full flex items-center justify-center">
            <FaBirthdayCake className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chào mừng, {user?.name}!</h1>
            <p className="text-pink-100">Trang làm việc dành cho thợ làm bánh</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Đơn hàng hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaCalendar className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Đang làm</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaClock className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FaBirthdayCake className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
            <FaChartLine className="text-pink-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Queue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hàng đợi đơn hàng</h3>
          <div className="text-center py-8">
            <FaBirthdayCake className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng mới</h4>
            <p className="text-gray-500">Các đơn hàng cần làm sẽ hiển thị ở đây</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="text-center py-8">
            <FaClock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có hoạt động</h4>
            <p className="text-gray-500">Lịch sử làm việc sẽ hiển thị ở đây</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-pink-50 border border-pink-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-pink-800 mb-2">Thông tin cho thợ làm bánh</h3>
        <div className="text-pink-700 space-y-2">
          <p>• Kiểm tra đơn hàng cần làm trong hàng đợi</p>
          <p>• Cập nhật trạng thái làm bánh theo quy trình</p>
          <p>• Liên hệ quản lý khi có vấn đề về nguyên liệu</p>
          <p>• Đảm bảo chất lượng và thời gian hoàn thành</p>
        </div>
      </div>
    </div>
  );
};

export default BakerHomePage; 