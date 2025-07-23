import React from "react";
import ContactManagement from "../components/Admin/ContactManagement";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

const ManagerContactManagement = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaTimes className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có quyền truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chỉ Admin hoặc Manager mới có thể truy cập chức năng này.
          </p>
        </div>
      </div>
    );
  }
  return <ContactManagement />;
};

export default ManagerContactManagement; 