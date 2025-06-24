import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaClipboard,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
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
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl text-pink-400 font-medium">
          Luna Bakery
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">
        {" "}
        Bảng quản trị viên
      </h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to={"/admin/users"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 "
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaUser className="text-pink-500"></FaUser>
          <span className="">Người dùng</span>
        </NavLink>
        {/*  */}
        <NavLink
          to={"/admin/products"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 "
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaBoxOpen className="text-pink-500"></FaBoxOpen>
          <span className="">Sản phẩm</span>
        </NavLink>
        {/*  */}
        <NavLink
          to={"/admin/orders"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 "
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaClipboardList className="text-pink-500"></FaClipboardList>
          <span className="">Đơn hàng</span>
        </NavLink>
        {/*  */}
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 px-4 py-3 rounded flex items-center space-x-2 "
              : "text-gray-700 hover:bg-pink-100 px-4 py-3 rounded flex items-center space-x-2"
          }
          end
        >
          <FaStore className="text-pink-500"></FaStore>
          <span className="">trang chủ</span>
        </NavLink>
        {/*  */}
      </nav>
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-pink-400 hover:bg-pink-500 py-2 rounded-3xl flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span className="text-white">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
