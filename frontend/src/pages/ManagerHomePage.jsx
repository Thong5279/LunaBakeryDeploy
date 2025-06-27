import React from "react";
import { FaBox, FaBoxOpen, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ManagerHomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header chào mừng */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chào mừng trở lại, {user?.name || "Quản lý"}!
          </h1>
          <p className="text-gray-600">
            Hệ thống quản lý Luna Bakery - Quản lý sản phẩm và nguyên liệu
          </p>
        </div>

        {/* Cards điều hướng nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Quản lý sản phẩm */}
          <Link
            to="/manager/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-pink-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Quản lý sản phẩm
                </h3>
                <p className="text-gray-600 text-sm">
                  Thêm, sửa, xóa và quản lý các sản phẩm bánh
                </p>
              </div>
              <FaBoxOpen className="text-3xl text-pink-500" />
            </div>
          </Link>

          {/* Card Quản lý nguyên liệu */}
          <Link
            to="/manager/ingredients"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Quản lý nguyên liệu
                </h3>
                <p className="text-gray-600 text-sm">
                  Quản lý kho nguyên liệu và nguồn cung cấp
                </p>
              </div>
              <FaBox className="text-3xl text-green-500" />
            </div>
          </Link>

          {/* Card Trang chủ */}
          <Link
            to="/"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-pink-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Trang chủ website
                </h3>
                <p className="text-gray-600 text-sm">
                  Xem trang chủ Luna Bakery
                </p>
              </div>
              <FaStore className="text-3xl text-pink-500" />
            </div>
          </Link>
        </div>

        {/* Thông tin hệ thống */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin hệ thống
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-medium text-pink-800 mb-2">Vai trò của bạn</h3>
              <p className="text-pink-600">Quản lý (Manager)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Quyền truy cập</h3>
              <p className="text-green-600">Quản lý sản phẩm và nguyên liệu</p>
            </div>
          </div>
        </div>

        {/* Hướng dẫn nhanh */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-pink-800 mb-4">
            Hướng dẫn nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-pink-700 mb-2">Quản lý sản phẩm:</h4>
              <ul className="text-pink-600 space-y-1">
                <li>• Thêm sản phẩm mới với đầy đủ thông tin</li>
                <li>• Cập nhật giá và mô tả sản phẩm</li>
                <li>• Quản lý trạng thái hiển thị</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-pink-700 mb-2">Quản lý nguyên liệu:</h4>
              <ul className="text-pink-600 space-y-1">
                <li>• Theo dõi tồn kho nguyên liệu</li>
                <li>• Cập nhật giá và nhà cung cấp</li>
                <li>• Quản lý danh mục nguyên liệu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHomePage; 