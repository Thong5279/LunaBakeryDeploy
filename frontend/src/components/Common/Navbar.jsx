import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiSearch, FiX } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40  ">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo bên trái */}
          <div className="text-xl font-bold text-[#a37ba3] tracking-wide">
            <Link to={"/"}>Luna Bakery</Link>
          </div>

          {/* Menu chính (ẩn trên mobile) */}
          <div>
            <ul className="hidden md:flex gap-6 font-medium text-gray-700">
              <div>
                <Link to={"/"} className="hover:text-pink-500 cursor-pointer">
                  Trang chủ
                </Link>
              </div>
              <div>
                <Link
                  to={"collections/all"}
                  className="hover:text-pink-500 cursor-pointer"
                >
                  Sản phẩm
                </Link>
              </div>
              <div>
                <Link to={"#"} className="hover:text-pink-500 cursor-pointer">
                  Nguyên liệu
                </Link>
              </div>
              <div>
                <Link to={"#"} className="hover:text-pink-500 cursor-pointer">
                  Liên hệ
                </Link>
              </div>
              <div>
                <Link to={"#"} className="hover:text-pink-500 cursor-pointer">
                  Tin tức
                </Link>
              </div>
            </ul>
          </div>

          {/* Icon bên phải */}
          <div className="flex items-center gap-4 text-gray-700">
            {user && user.role === "admin" && (
              <Link
                to={"/admin"}
                className="bg-pink-400 px-2 rounded-2xl hover:bg-pink-500 text-sm"
              >
                Admin
              </Link>
            )}

            <Link to={"/profile"}>
              <FiUser
                className="text-xl hover:text-[#a37ba3] cursor-pointer"
                title="Tài khoản"
              />
            </Link>
            <button onClick={toggleCartDrawer}>
              <FiShoppingCart className="text-xl hover:text-[#a37ba3] cursor-pointer" />
              {cartItemCount > 0 && (
                <span
                  className="absolute bg-[#a37ba3] text-white text-xs rounded-full px-2 py-0.5"
                  style={{ top: "6px" }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/*Tìm kiếm */}
            <div className="overflow-hidden">
              <Searchbar />
            </div>

            {/* Nút mở menu mobile */}
            <div className="md:hidden">
              <HiMenu
                className="text-2xl cursor-pointer hover:text-[#a37ba3]"
                title="Menu"
                onClick={() => setIsMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-1/3 
        bg-white transform transition-transform duration-300 shadow-lg z-50  ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-[#a37ba3]">Menu</h2>
          <FiX
            className="text-2xl cursor-pointer hover:text-red-500"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>

        <ul className="flex flex-col gap-4 p-4 text-gray-700 font-medium">
          <Link to={"/"} className="hover:text-pink-500 cursor-pointer">
            Trang chủ
          </Link>
          <Link
            to={"collections/all"}
            className="hover:text-pink-500 cursor-pointer"
          >
            Sản phẩm
          </Link>
          <Link className="hover:text-pink-500 cursor-pointer">
            Về chúng tôi
          </Link>
          <Link className="hover:text-pink-500 cursor-pointer">Liên hệ</Link>
          <Link className="hover:text-pink-500 cursor-pointer">Tin tức</Link>
        </ul>
      </div>

      {/* Overlay khi menu mở */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 overlay z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
};

export default Navbar;
