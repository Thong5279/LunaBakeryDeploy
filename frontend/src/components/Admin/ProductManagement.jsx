import React from "react";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const products = [
    {
      _id: 123123,
      name: "Bánh kem",
      price: 110000,
      sku: "1123123123",
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      console.log("Xóa sản phẩm voi id : ",id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên sản phẩm
              </th>
              <th scope="col" className="px-6 py-3">
                Giá
              </th>
              <th scope="col" className="px-6 py-3">
                Mã hàng
              </th>
              <th scope="col" className="px-6 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/products/${product._id}/edit`}
                    className="bg-yellow-400 text-white px-4 py-1 rounded-md mr-2 hover:bg-yellow-600">
                      Sửa
                    </Link>
                    <button 
                    className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-600" 
                    onClick={() => handleDelete(product._id)}
                      >Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr colSpan={4} className="text-center py-10">
                <td colSpan={4} className="text-center py-10">
                  <p className="text-gray-500">Không có sản phẩm nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
