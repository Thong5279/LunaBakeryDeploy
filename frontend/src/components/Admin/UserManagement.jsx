import React, { useState } from "react";

const UserManagement = () => {
  const users = [
    {
      name: "Bui Ngoc Nhu",
      email: "Luna@gmail.com",
      role: "admin",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
//   reset về mặc định khi submit
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(formData)
    setFormData({
        name: "",
        email: "",
        password: "",
        role: "",

    });
  }

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      {/* add new user from */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Thêm tài khoản </h3>
        <form action="" className="" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Tên tài khoản
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Quyền tài khoản
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              id=""
              className="w-full p-2 border rounded"
            >
                <option value="customer">khách hàng</option>
                <option value="admin">Admin</option>
                <option value="manager">Quản lý</option>
                <option value="baker">Nhân viên làm bánh</option>
                <option value="Shipper">Giao bánh</option>
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 hover:bg-green-600">
            Thêm tài khoản 
          </button>
        </form>
      </div>
      {/* danh sách người dùng */}
     
    </div>
  );
};

export default UserManagement;
