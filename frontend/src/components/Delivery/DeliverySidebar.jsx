import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaUser, FaTruck } from "react-icons/fa";

const DeliverySidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <FaTruck className="text-white text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-green-700">Nhân viên giao hàng</h2>
            <p className="text-sm text-green-600">{user?.name}</p>
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
                  ? "bg-green-200 text-green-800"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              <FaHome className="text-lg" />
              <span>Trang chủ</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-200">
        <div className="flex items-center space-x-3 text-green-600">
          <FaUser className="text-lg" />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs">Nhân viên giao hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySidebar; 