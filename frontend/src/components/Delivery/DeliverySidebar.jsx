import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaUser, FaTruck, FaSignOutAlt, FaArrowLeft, FaClipboardList } from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const DeliverySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)' }}>
      {/* Header */}
      <div className="p-6 border-b border-pink-200" style={{ background: 'rgba(252, 231, 243, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img 
              src="https://cdn-icons-png.flaticon.com/128/3272/3272682.png" 
              alt="Nhân viên giao hàng" 
              className="w-6 h-6"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg text-pink-700">Nhân viên giao hàng</h2>
            <p className="text-sm text-pink-600">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/delivery"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive("/delivery")
                  ? "bg-pink-100 text-pink-700 border-2 border-pink-300 shadow-md"
                  : "text-pink-700 hover:bg-pink-50"
              }`}
            >
              <FaHome className="text-lg" />
              <span className="font-medium">Trang chủ</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/delivery/orders"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive("/delivery/orders")
                  ? "bg-pink-100 text-pink-700 border-2 border-pink-300 shadow-md"
                  : "text-pink-700 hover:bg-pink-50"
              }`}
            >
              <FaClipboardList className="text-lg" />
              <span className="font-medium">Quản lý đơn hàng</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 text-pink-700 hover:bg-pink-50"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pink-200" style={{ background: 'rgba(252, 231, 243, 0.5)' }}>
        <div className="flex items-center space-x-3 text-pink-600 mb-4">
          <FaUser className="text-lg" />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs">Nhân viên giao hàng</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 text-pink-700 hover:bg-pink-50"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default DeliverySidebar; 