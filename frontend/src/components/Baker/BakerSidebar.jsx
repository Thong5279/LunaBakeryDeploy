import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaUser, FaBirthdayCake, FaSignOutAlt, FaArrowLeft, FaClipboardList, FaBook } from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import "./BakerSidebar.css";

const BakerSidebar = () => {
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
    <div className="baker-sidebar-container">
      {/* Header */}
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="https://images-platform.99static.com/lU-GBE1-IiZezutUfdYfUThnGfQ=/500x500/top/smart/99designs-contests-attachments/17/17795/attachment_17795074" alt="" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-pink-700">Thợ làm bánh</h2>
            <p className="text-sm text-pink-600">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="baker-nav-list space-y-2">
          <li>
            <Link
              to="/baker"
              className={`baker-nav-item ${
                isActive("/baker") ? "active" : ""
              }`}
            >
              <FaHome className="baker-nav-icon" />
              <span className="baker-nav-text">Trang chủ</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/baker/orders"
              className={`baker-nav-item ${
                isActive("/baker/orders") ? "active" : ""
              }`}
            >
              <FaClipboardList className="baker-nav-icon" />
              <span className="baker-nav-text">Quản lý đơn hàng</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/baker/recipes"
              className={`baker-nav-item ${
                isActive("/baker/recipes") ? "active" : ""
              }`}
            >
              <FaBook className="baker-nav-icon" />
              <span className="baker-nav-text">Sổ tay công thức</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/"
              className="baker-nav-item"
            >
              <FaArrowLeft className="baker-nav-icon" />
              <span className="baker-nav-text">Về trang chủ</span>
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
            <p className="text-xs">Thợ làm bánh</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="baker-nav-item w-full"
        >
          <FaSignOutAlt className="baker-nav-icon" />
          <span className="baker-nav-text">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default BakerSidebar; 