import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";  
import { useNavigate } from "react-router-dom";
import { addUser, updateUser, deleteUser } from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);
  const {users, loading, error} = useSelector((state) => state.admin);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
   if(user &&  user.role !== "admin") {
    navigate("/");
   }
  }, [user, navigate]);
  
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
    dispatch(addUser(formData));

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleRoleChange = (userId, newRole) =>{
    dispatch(updateUser({id: userId, role: newRole}));
  }
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      {/* add new user from */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p>Lỗi khi tải dữ liệu: {error}</p>}
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
                    <option value="baker">Nhân viên làm bánh</option>
                    <option value="shipper">Nhân viên giao bánh</option>
                  </select>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa tài khoản
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa tài khoản của <strong>{userToDelete?.name}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
