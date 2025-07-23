import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import ManagerSidebar from "./ManagerSidebar";
import ManagerHomePage from "../../pages/ManagerHomePage";
import ManagerRecipeManagement from './ManagerRecipeManagement';
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile toggle button */}
      <div className="flex md:hidden p-4 bg-pink-100 text-pink-800 z-20 shadow-md">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl text-pink-500 font-semibold">Trang quản lý</h1>
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
        className={`bg-pink-50 border-r border-pink-200 w-64 min-h-screen text-pink-800 absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20 shadow-lg`}
      >
        {/* Nội dung Sidebar ở đây */}
        <ManagerSidebar />
      </div>
      {/* nội dung chính của trang quản lý*/}
      <main className="flex-1 min-h-screen">
        <div className="container mx-auto px-4 py-6 md:py-8 mt-14 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout; 