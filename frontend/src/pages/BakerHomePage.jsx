import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBirthdayCake, FaClock, FaCalendar, FaChartLine, FaQuoteLeft, FaBook, FaExclamationTriangle, FaListUl, FaUserFriends, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { fetchBakerOrders } from "../redux/slices/bakerOrderSlice";

const RULES = [
  "Đảm bảo vệ sinh an toàn thực phẩm trong mọi công đoạn.",
  "Không sử dụng nguyên liệu quá hạn hoặc không rõ nguồn gốc.",
  "Giữ gìn khu vực làm việc sạch sẽ, gọn gàng.",
  "Báo cáo ngay cho quản lý khi phát hiện sự cố về nguyên liệu hoặc thiết bị.",
  "Không tự ý rời khỏi vị trí khi chưa hoàn thành nhiệm vụ."
];

const REGULATIONS = [
  "Mọi sản phẩm phải đúng công thức, đúng định lượng.",
  "Thời gian hoàn thành đơn hàng phải tuân thủ quy định của LunaBakery.",
  "Không chia sẻ công thức nội bộ ra ngoài.",
  "Tôn trọng đồng nghiệp, hỗ trợ lẫn nhau trong công việc.",
  "Luôn cập nhật trạng thái đơn hàng trên hệ thống."
];

const MOTIVATION_QUOTES = [
  "Không có thành công nào đến từ sự lười biếng.",
  "Mỗi chiếc bánh là một tác phẩm nghệ thuật, hãy làm bằng cả trái tim!",
  "Đam mê là nguyên liệu bí mật của mọi chiếc bánh ngon.",
  "Hãy để mùi thơm của bánh lan tỏa niềm vui đến mọi người.",
  "Chỉ cần bạn cố gắng, mọi thứ đều có thể!"
];

// Demo: top 3 thợ làm bánh (có thể lấy từ API nếu có)
const TOP_BAKERS = [
  { name: "Nguyễn Văn A", total: 120 },
  { name: "Trần Thị B", total: 110 },
  { name: "Lê Văn C", total: 98 },
];

// Demo: thông báo nội bộ
const NOTIFICATIONS = [
  { id: 1, message: "Lưu ý: Kiểm tra kỹ hạn sử dụng nguyên liệu trước khi làm bánh!", type: "warning" },
];

const BakerHomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.bakerOrders);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchBakerOrders());
    }
  }, [dispatch]);

  // Thống kê
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const ordersToday = useMemo(() =>
    orders.filter(order => new Date(order.createdAt).toISOString().slice(0, 10) === todayStr),
    [orders, todayStr]
  );
  const totalOrders = orders.length;

  // Random quote
  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    return MOTIVATION_QUOTES[idx];
  }, []);

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
            <FaBirthdayCake className="text-3xl text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng, {user?.name || "Thợ làm bánh"}!</h1>
            <p className="text-gray-600 text-lg">Trang làm việc dành cho thợ làm bánh LunaBakery</p>
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
                <span className="text-gray-600">LunaBakery Kitchen</span>
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
              <p className="text-pink-600 text-sm font-medium mb-1">Đơn hàng hôm nay</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : ordersToday.length}</p>
              <p className="text-green-500 text-sm">+2 so với hôm qua</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
              <FaCalendar className="text-pink-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : totalOrders}</p>
              <p className="text-blue-500 text-sm">Đang xử lý</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <FaBirthdayCake className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Tỷ lệ hoàn thành</p>
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="text-green-500 text-sm">Xuất sắc</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Đang làm bánh</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-purple-500 text-sm">Trung bình 2.3h/đơn</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <FaChartLine className="text-purple-600 text-2xl" />
            </div>
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
            {RULES.map((rule, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-pink-100' : 
                    index === 1 ? 'bg-blue-100' : 
                    index === 2 ? 'bg-green-100' : 
                    index === 3 ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <FaBirthdayCake className={`text-lg ${
                      index === 0 ? 'text-pink-600' : 
                      index === 1 ? 'text-blue-600' : 
                      index === 2 ? 'text-green-600' : 
                      index === 3 ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quy tắc {index + 1}</p>
                    <p className="text-sm text-gray-600">{rule}</p>
                  </div>
                </div>
              </div>
            ))}
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
            {REGULATIONS.map((regulation, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Quy định {index + 1}</p>
                    <p className="text-sm text-gray-600">{regulation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
              <FaListUl className="text-pink-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Đơn hàng cần làm</h4>
              <p className="text-sm text-gray-600">Xem danh sách đơn hàng</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <FaBook className="text-blue-600 text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Công thức</h4>
              <p className="text-sm text-gray-600">Xem công thức làm bánh</p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aTU3NHhqd2NqeDRiN3N5dTV4NzZhM2dkODQzdzY2amVqOGt6bXJ6ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/aU1zEDJ9xPVjFBbtvJ/giphy.gif" 
                alt="Linh vật xem công thức" 
                className="w-16 h-16 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-green-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Báo cáo sự cố</h4>
              <p className="text-sm text-gray-600">Báo cáo vấn đề</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo nội bộ */}
      {NOTIFICATIONS.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaExclamationTriangle className="text-yellow-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Thông báo nội bộ</h3>
          </div>
          <div className="space-y-2">
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-yellow-200">
                <FaExclamationTriangle className="text-yellow-500" />
                <span className="text-gray-700">{n.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Câu nói truyền cảm hứng */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaQuoteLeft className="text-pink-600 mr-3" />
          Câu nói truyền cảm hứng
        </h3>
        <div className="text-center">
          <p className="italic text-gray-700 text-lg font-medium">"{randomQuote}"</p>
        </div>
      </div>
    </div>
  );
};

export default BakerHomePage; 