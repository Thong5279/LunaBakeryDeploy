import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBirthdayCake, FaClock, FaCalendar, FaChartLine, FaQuoteLeft, FaBook, FaExclamationTriangle, FaListUl } from "react-icons/fa";
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

  // Lịch sử hoạt động gần đây (5 đơn gần nhất)
  const recentOrders = useMemo(() =>
    orders.slice(0, 5),
    [orders]
  );

  // Random quote
  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    return MOTIVATION_QUOTES[idx];
  }, []);

  return (
    <div className="space-y-6">
      {/* Chào mừng + avatar thợ làm bánh */}
      <div className="flex items-center gap-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 rounded-lg shadow-lg border border-blue-200">
        <img
          src="https://images-platform.99static.com/lU-GBE1-IiZezutUfdYfUThnGfQ=/500x500/top/smart/99designs-contests-attachments/17/17795/attachment_17795074"
          alt="Baker Icon"
          className="w-20 h-20 rounded-full border-4 border-blue-300 shadow-lg"
        />
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-1">Chào mừng, {user?.name || "Thợ làm bánh"}!</h1>
          <p className="text-blue-600">Trang làm việc dành cho thợ làm bánh LunaBakery</p>
        </div>
      </div>

      {/* Thông báo nội bộ */}
      {NOTIFICATIONS.length > 0 && (
        <div className="space-y-2">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`p-4 rounded-lg shadow flex items-center gap-3 ${n.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800' : 'bg-green-50 border-l-4 border-green-400 text-green-800'}`}>
              {n.type === 'warning' ? <FaExclamationTriangle className="text-yellow-400" /> : <FaBirthdayCake className="text-green-400" />}
              <span>{n.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Nút truy cập nhanh */}
      <div className="flex flex-wrap gap-4">
        <a href="/baker/orders" className="flex items-center gap-2 px-4 py-2 bg-blue-200 text-blue-700 rounded-lg shadow hover:bg-blue-300 transition-colors">
          <FaListUl /> Đơn hàng cần làm
        </a>
        <a href="/baker/recipes" className="flex items-center gap-2 px-4 py-2 bg-purple-200 text-purple-700 rounded-lg shadow hover:bg-purple-300 transition-colors">
          <FaBook /> Công thức
        </a>
        <a href="/baker/report" className="flex items-center gap-2 px-4 py-2 bg-pink-200 text-pink-700 rounded-lg shadow hover:bg-pink-300 transition-colors">
          <FaExclamationTriangle /> Báo cáo sự cố
        </a>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">Đơn hàng hôm nay</p>
            <p className="text-3xl font-bold text-blue-800">{loading ? '...' : ordersToday.length}</p>
          </div>
          <FaCalendar className="text-blue-600 text-3xl" />
        </div>
        <div className="bg-gradient-to-br from-purple-200 to-purple-300 p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-purple-700 text-sm font-medium">Tổng số đơn làm bánh</p>
            <p className="text-3xl font-bold text-purple-800">{loading ? '...' : totalOrders}</p>
          </div>
          <FaBirthdayCake className="text-purple-600 text-3xl" />
        </div>
        <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-pink-700 text-sm font-medium">Tỷ lệ hoàn thành</p>
            <p className="text-3xl font-bold text-pink-800">100%</p>
          </div>
          <FaChartLine className="text-pink-600 text-3xl" />
        </div>
      </div>

      {/* Nội quy và Quy định */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-l-4 border-blue-300 p-6 rounded-lg shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Nội quy & Quy định LunaBakery</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">📋 Nội quy dành cho thợ làm bánh</h3>
                <ul className="list-disc pl-6 text-blue-800 space-y-1">
                  {RULES.map((rule, idx) => <li key={idx}>{rule}</li>)}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-pink-600 mb-2">📖 Quy định của LunaBakery</h3>
                <ul className="list-disc pl-6 text-purple-800 space-y-1">
                  {REGULATIONS.map((reg, idx) => <li key={idx}>{reg}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aTU3NHhqd2NqeDRiN3N5dTV4NzZhM2dkODQzdzY2amVqOGt6bXJ6ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/aU1zEDJ9xPVjFBbtvJ/giphy.gif" 
              alt="Linh vật đọc nội quy và quy định" 
              className="w-24 h-24 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Lịch sử hoạt động gần đây */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border border-blue-300 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-blue-700 mb-3">Lịch sử hoạt động gần đây</h3>
        {recentOrders.length === 0 ? (
          <p className="text-blue-600 italic">Chưa có đơn hàng nào.</p>
        ) : (
          <ul className="divide-y divide-blue-300">
            {recentOrders.map((order, idx) => (
              <li key={order._id || idx} className="py-3 flex items-center gap-4 hover:bg-blue-200 rounded-lg px-2 transition-colors">
                <FaBirthdayCake className="text-purple-500" />
                <span className="font-medium text-blue-800">#{order._id?.slice(-6) || '---'}</span>
                <span className="text-purple-600 text-sm">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 text-white ml-auto">{order.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Câu nói truyền cảm hứng */}
      <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 border-l-4 border-blue-400 p-6 rounded-lg shadow-lg flex items-center gap-4">
        <FaQuoteLeft className="text-blue-600 text-3xl" />
        <span className="italic text-blue-800 text-lg font-medium">{randomQuote}</span>
      </div>
    </div>
  );
};

export default BakerHomePage; 