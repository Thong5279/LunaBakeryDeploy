import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaUser, FaBirthdayCake } from "react-icons/fa";

const BakerSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-orange-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <FaBirthdayCake className="text-white text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-orange-700">Thợ làm bánh</h2>
            <p className="text-sm text-orange-600">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/baker"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/baker")
                  ? "bg-orange-200 text-orange-800"
                  : "text-orange-700 hover:bg-orange-100"
              }`}
            >
              <FaHome className="text-lg" />
              <span>Trang chủ</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-orange-200">
        <div className="flex items-center space-x-3 text-orange-600">
          <FaUser className="text-lg" />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs">Thợ làm bánh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakerSidebar; 