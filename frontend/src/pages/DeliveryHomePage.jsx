import React from "react";
import { useSelector } from "react-redux";
import { FaTruck, FaRoute, FaBoxOpen, FaMapMarkerAlt, FaCheckCircle, FaClock, FaUserFriends } from "react-icons/fa";

const DeliveryHomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-6">
          <img src="https://cdn-icons-gif.flaticon.com/13471/13471023.gif" alt="Chào mừng" className="w-20 h-20 rounded-full border-2 border-pink-300 shadow" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng, {user?.name}!</h1>
            <p className="text-gray-600 text-lg">Trang làm việc dành cho nhân viên giao hàng</p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center space-x-2">
                <FaClock className="text-pink-500" />
                <span className="text-gray-600">{new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-purple-500" />
                <span className="text-gray-600">TP. Cần Thơ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium mb-1">Đơn cần giao</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-green-500 text-sm">+1 hôm nay</p>
            </div>
            <img src="https://cdn-icons-gif.flaticon.com/11779/11779500.gif" alt="Đơn cần giao" className="w-16 h-16 rounded-full border-2 border-pink-300 shadow" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Đang giao</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-blue-500 text-sm">Đang xử lý</p>
            </div>
            <img src="https://cdn-icons-gif.flaticon.com/18485/18485030.gif" alt="Đang giao" className="w-16 h-16 rounded-full border-2 border-blue-300 shadow" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Hoàn thành hôm nay</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-green-500 text-sm">+2 so với hôm qua</p>
            </div>
            <img src="https://cdn-icons-gif.flaticon.com/18485/18485014.gif" alt="Hoàn thành hôm nay" className="w-16 h-16 rounded-full border-2 border-green-300 shadow" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Tổng khoảng cách</p>
              <p className="text-3xl font-bold text-gray-900">18 km</p>
              <p className="text-purple-500 text-sm">Trung bình 2.3km/đơn</p>
            </div>
            <img src="https://cdn-icons-gif.flaticon.com/11201/11201870.gif" alt="Tổng khoảng cách" className="w-16 h-16 rounded-full border-2 border-purple-300 shadow" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nội quy */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Nội quy</h3>
            <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
              Bắt buộc
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Nội quy items */}
            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="https://cdn-icons-gif.flaticon.com/18485/18485045.gif" alt="Kiểm tra đơn hàng" className="w-12 h-12 rounded-full border-2 border-pink-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Kiểm tra đơn hàng</p>
                  <p className="text-sm text-gray-600">Xác nhận thông tin khách hàng, địa chỉ, số điện thoại trước khi giao</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="http://cdn-icons-gif.flaticon.com/15309/15309671.gif" alt="Tuân thủ lộ trình" className="w-12 h-12 rounded-full border-2 border-blue-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Tuân thủ lộ trình</p>
                  <p className="text-sm text-gray-600">Giao hàng theo thứ tự đã định, không tự ý thay đổi</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="https://cdn-icons-gif.flaticon.com/15401/15401345.gif" alt="Cập nhật trạng thái" className="w-12 h-12 rounded-full border-2 border-green-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Cập nhật trạng thái</p>
                  <p className="text-sm text-gray-600">Báo cáo ngay khi hoàn thành giao hàng</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="https://cdn-icons-gif.flaticon.com/11779/11779515.gif" alt="Liên hệ khách hàng" className="w-12 h-12 rounded-full border-2 border-purple-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Liên hệ khách hàng</p>
                  <p className="text-sm text-gray-600">Gọi điện xác nhận trước khi đến giao hàng</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="https://cdn-icons-gif.flaticon.com/17904/17904640.gif" alt="Đúng giờ" className="w-12 h-12 rounded-full border-2 border-orange-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Đúng giờ</p>
                  <p className="text-sm text-gray-600">Giao hàng đúng thời gian đã hẹn với khách hàng</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img src="https://cdn-icons-gif.flaticon.com/17882/17882586.gif" alt="Bảo quản hàng hóa" className="w-12 h-12 rounded-full border-2 border-red-300 shadow" />
                <div>
                  <p className="font-medium text-gray-900">Bảo quản hàng hóa</p>
                  <p className="text-sm text-gray-600">Đảm bảo sản phẩm không bị hư hỏng trong quá trình vận chuyển</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quy định */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Quy định</h3>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              Quan trọng
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Thời gian giao hàng</p>
                  <p className="text-sm text-gray-600">8:00 - 18:00 hàng ngày, nghỉ trưa 12:00 - 13:00</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Khu vực giao hàng</p>
                  <p className="text-sm text-gray-600">Trung tâm TP. Cần Thơ: Ninh Kiều, Bình Thủy, Cái Răng</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Trang phục và thái độ</p>
                  <p className="text-sm text-gray-600">Đồng phục công ty, lịch sự, chuyên nghiệp</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Xử lý khiếu nại</p>
                  <p className="text-sm text-gray-600">Báo cáo ngay cho quản lý khi có vấn đề</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">An toàn giao thông</p>
                  <p className="text-sm text-gray-600">Tuân thủ luật giao thông, đội mũ bảo hiểm</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Báo cáo hàng ngày</p>
                  <p className="text-sm text-gray-600">Gửi báo cáo hoàn thành công việc cuối ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
              <FaUserFriends className="text-pink-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Liên hệ khách hàng</h4>
              <p className="text-sm text-gray-600">Xem thông tin chi tiết</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <FaRoute className="text-blue-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Cập nhật trạng thái</h4>
              <p className="text-sm text-gray-600">Đánh dấu đã giao</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Báo cáo hoàn thành</h4>
              <p className="text-sm text-gray-600">Gửi báo cáo ngày</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTruck className="text-pink-600 mr-3" />
          Hướng dẫn giao hàng tại TP. Cần Thơ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              Kiểm tra danh sách đơn hàng cần giao trong ngày
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              Xác nhận thông tin khách hàng trước khi giao
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              Cập nhật trạng thái giao hàng theo thời gian thực
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              Giao hàng trong khu vực trung tâm TP. Cần Thơ
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Liên hệ khách hàng khi có vấn đề về địa chỉ
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Đảm bảo an toàn sản phẩm trong quá trình vận chuyển
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Tuân thủ lộ trình giao hàng tối ưu
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Chú ý giao thông và địa hình tại Cần Thơ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHomePage; 