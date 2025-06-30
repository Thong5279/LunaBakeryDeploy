import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaSignOutAlt,
  FaStore,
  FaWarehouse,
  FaClipboardList,
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
        {/* Quản lý đơn hàng */}
        <NavLink
          to={"/manager/orders"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 bg-pink-100"
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaClipboardList className="text-pink-500"></FaClipboardList>
          <span className="">Đơn hàng</span>
        </NavLink>

        {/* Quản lý sản phẩm */}
        <NavLink
          to={"/manager/products"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 bg-pink-100"
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaBoxOpen className="text-pink-500"></FaBoxOpen>
          <span className="">Sản phẩm</span>
        </NavLink>

        {/* Quản lý nguyên liệu */}
        <NavLink
          to={"/manager/ingredients"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 bg-pink-100"
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaBox className="text-pink-500"></FaBox>
          <span className="">Nguyên liệu</span>
        </NavLink>

        {/* Quản lý kho */}
        <NavLink
          to={"/manager/inventory"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 bg-pink-100"
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaWarehouse className="text-pink-500"></FaWarehouse>
          <span className="">Quản lý kho</span>
        </NavLink>

        {/* Trở về trang chủ */}
        <NavLink
          to={"/"}
          className="text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
        >
          <FaStore className="text-pink-500"></FaStore>
          <span className="">Trang chủ</span>
        </NavLink>
      </nav>

      {/* Nút đăng xuất */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-pink-400 hover:bg-pink-500 py-2 rounded-3xl flex items-center justify-center space-x-2 transition-colors"
        >
          <FaSignOutAlt />
          <span className="text-white">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar; 