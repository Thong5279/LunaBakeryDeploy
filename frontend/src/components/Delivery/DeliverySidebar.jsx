import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaUser, FaTruck, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
            <FaTruck className="text-white text-lg" />
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
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/delivery")
                  ? "bg-pink-200 text-pink-800"
                  : "text-pink-700 hover:bg-pink-100"
              }`}
            >
              <FaHome className="text-lg" />
              <span>Trang chủ</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-pink-700 hover:bg-pink-100"
            >
              <FaArrowLeft className="text-lg" />
              <span>Về trang chủ</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pink-200">
        <div className="flex items-center space-x-3 text-pink-600 mb-4">
          <FaUser className="text-lg" />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs">Nhân viên giao hàng</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-pink-700 hover:bg-pink-100 hover:text-pink-800"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default DeliverySidebar; 