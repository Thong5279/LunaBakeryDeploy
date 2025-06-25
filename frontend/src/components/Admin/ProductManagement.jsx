import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, deleteProduct, createProduct } from "../../redux/slices/adminProductSlice";
import { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } from "../../constants/productConstants";


const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: PRODUCT_CATEGORIES[0],
    images: [],
    sizes: [],
    flavors: [],
    countInStock: "10"
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setCreateError("");
    setNewProduct({
      name: "",
      description: "",
      price: "",
      sku: "",
      category: PRODUCT_CATEGORIES[0],
      images: [],
      sizes: [],
      flavors: [],
      countInStock: "10"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const handleSubmitNewProduct = (e) => {
    e.preventDefault();
    
    const productData = {
      ...newProduct,
      price: Number(newProduct.price),
      countInStock: Number(newProduct.countInStock),
    };

    console.log("Sending product data:", productData);

    dispatch(createProduct(productData))
      .then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          handleCloseModal();
          dispatch(fetchAdminProducts());
        } else if (result.type.endsWith("/rejected")) {
          setCreateError(result.payload?.message || "Có lỗi xảy ra khi thêm sản phẩm");
        }
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        setCreateError("Có lỗi xảy ra khi thêm sản phẩm");
      });
  };

  if(loading) {
    return <p>Đang tải dữ liệu...</p>
  }
  if(error) {
    return <p>Lỗi khi tải dữ liệu: {error}</p>
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          + Thêm sản phẩm
        </button>
      </div>
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
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("vi-VN").format(product.price)} vnđ
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-400 text-white px-4 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                      className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      Xóa
                    </button>
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Thêm sản phẩm mới
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewProduct}>
              {createError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {createError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá
                </label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã sản phẩm (SKU)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={newProduct.countInStock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {PRODUCT_SIZES.map((size) => (
                    <label key={size} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={size}
                        checked={newProduct.sizes.includes(size)}
                        onChange={(e) => handleCheckboxChange(e, 'sizes')}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Đã chọn: {newProduct.sizes.join(", ") || "Chưa chọn"}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hương vị
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {PRODUCT_FLAVORS.map((flavor) => (
                    <label key={flavor} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={flavor}
                        checked={newProduct.flavors.includes(flavor)}
                        onChange={(e) => handleCheckboxChange(e, 'flavors')}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{flavor}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Đã chọn: {newProduct.flavors.join(", ") || "Chưa chọn"}
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Thêm sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
