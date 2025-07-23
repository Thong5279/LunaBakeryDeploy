import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaSignOutAlt,
  FaStore,
  FaWarehouse,
  FaClipboardList,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const menuItems = [
    { path: "/manager/orders", icon: FaClipboardList, label: "Đơn hàng", iconColor: "text-pink-500" },
    { path: "/manager/products", icon: FaBoxOpen, label: "Sản phẩm", iconColor: "text-purple-500" },
    { path: "/manager/ingredients", icon: FaBox, label: "Nguyên liệu", iconColor: "text-green-500" },
    { path: "/manager/inventory", icon: FaWarehouse, label: "Thống kê mua bán", iconColor: "text-indigo-500" },
    { path: "/manager/reviews", icon: FaStar, label: "Đánh giá", iconColor: "text-yellow-500" },
    { path: "/manager/recipes", icon: FaBoxOpen, label: "Công thức", iconColor: "text-yellow-600" },
    { path: "/manager/contacts", icon: FaEnvelope, label: "Tin nhắn liên hệ", iconColor: "text-teal-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/manager" className="text-2xl text-pink-400 font-medium">
          Luna Bakery
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">
        Bảng quản lý
      </h2>

      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2"
                : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
            }
            end
          >
            <item.icon className={`${item.iconColor} transition-colors duration-200`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to={"/"}
          className="text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
        >
          <FaStore className="text-teal-500" />
          <span>Trang chủ</span>
        </NavLink>
      </nav>

      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-pink-400 hover:bg-pink-500 py-2 rounded-3xl flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt className="text-white" />
          <span className="text-white">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar; 