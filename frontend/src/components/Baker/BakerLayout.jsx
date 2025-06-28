import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import BakerSidebar from "./BakerSidebar";
import { Outlet } from "react-router-dom";

const BakerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile toggle button */}
      <div className="flex md:hidden p-4 bg-pink-100 text-brown-800 z-20 shadow-md">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl text-pink-500 font-semibold">Trang thợ làm bánh</h1>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-pink-50 border-r border-pink-200 w-64 min-h-screen text-brown-800 absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20 shadow-lg`}
      >
        <BakerSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet/>
      </div>
    </div>
  );
};

export default BakerLayout; 