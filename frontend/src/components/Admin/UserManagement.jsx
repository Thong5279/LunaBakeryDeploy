import React, { useState } from "react";

const UserManagement = () => {
  const users = [
    {
      _id: "12313",
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleRoleChange = (userId, newRole) =>{
    console.log({id: userId, role: newRole})
  }
  const handleDeleteUser = (userId) =>{
    if(window.confirm("Bạn có chắc muốn xoá tài khoản này?"))
    {
      console.log("xoá người dùng với id " , userId)
    }
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
              <option value="shipper">Giao bánh</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 hover:bg-green-600"
          >
            Thêm tài khoản
          </button>
        </form>
      </div>
      {/* danh sách người dùng */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Quyền</th>
              <th className="py-3 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    name=""
                    id=""
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Quản lý</option>
                    <option value="banker">Nhân viên làm bánh</option>
                    <option value="shipper">Nhân viên giao bánh</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                      Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
