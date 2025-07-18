import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaClipboard,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
  FaChartBar,
  FaWarehouse,
  FaStar,
  FaFire,
  FaEnvelope,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const menuItems = [
    { 
      path: "/admin/users", 
      icon: FaUser, 
      label: "Người dùng",
      iconColor: "text-blue-500"
    },
    { 
      path: "/admin/products", 
      icon: FaBoxOpen, 
      label: "Sản phẩm",
      iconColor: "text-purple-500"
    },
    { 
      path: "/admin/ingredients", 
      icon: FaBox, 
      label: "Nguyên liệu",
      iconColor: "text-green-500"
    },
    { 
      path: "/admin/recipes", 
      icon: FaClipboard, 
      label: "Công thức",
      iconColor: "text-yellow-600"
    },
    { 
      path: "/admin/inventory", 
      icon: FaWarehouse, 
      label: "Thống kê mua bán",
      iconColor: "text-indigo-500"
    },
    { 
      path: "/admin/orders", 
      icon: FaClipboardList, 
      label: "Đơn hàng",
      iconColor: "text-pink-500"
    },
    { 
      path: "/admin/contacts", 
      icon: FaEnvelope, 
      label: "Tin nhắn liên hệ",
      iconColor: "text-teal-500"
    },
    { 
      path: "/admin/analytics", 
      icon: FaChartBar, 
      label: "Thống kê",
      iconColor: "text-orange-500"
    },
    { 
      path: "/admin/reviews", 
      icon: FaStar, 
      label: "Đánh giá",
      iconColor: "text-yellow-500"
    },
    { 
      path: "/admin/flash-sales", 
      icon: FaFire, 
      label: "Flash Sale",
      iconColor: "text-red-500"
    },
    { 
      path: "/", 
      icon: FaStore, 
      label: "Trang chủ",
      iconColor: "text-teal-500"
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl text-pink-400 font-medium">
          Luna Bakery
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">
        Bảng quản trị viên
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

export default AdminSidebar;
