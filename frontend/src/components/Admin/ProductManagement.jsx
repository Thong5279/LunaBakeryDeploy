import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, deleteProduct, createProduct } from "../../redux/slices/adminProductSlice";
import { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES, PRODUCT_STATUS, SIZE_PRICE_INCREMENT } from "../../constants/productConstants";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: PRODUCT_CATEGORIES[0],
    status: "active",
    images: [],
    sizes: [],
    flavors: []
  });

  // Tính giá tự động cho các size
  const calculateSizePricing = (basePrice, selectedSizes) => {
    if (!basePrice || selectedSizes.length === 0) return [];
    
    const sortedSizes = [...selectedSizes].sort((a, b) => {
      // Sắp xếp size theo thứ tự tăng dần
      const sizeOrder = PRODUCT_SIZES.indexOf(a) - PRODUCT_SIZES.indexOf(b);
      return sizeOrder;
    });

    return sortedSizes.map((size, index) => ({
      size,
      price: Number(basePrice) + (index * SIZE_PRICE_INCREMENT),
      discountPrice: 0
    }));
  };

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id))
        .then((result) => {
          if (result.type.endsWith("/fulfilled")) {
            setDeleteSuccess(true);
            // Auto hide success message after 3 seconds
            setTimeout(() => {
              setDeleteSuccess(false);
            }, 3000);
          }
        });
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
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
      status: "active",
      images: [],
      sizes: [],
      flavors: []
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
    
    // Tính giá cho từng size
    const sizePricing = calculateSizePricing(newProduct.price, newProduct.sizes);
    
    const productData = {
      ...newProduct,
      price: Number(newProduct.price),
      sizePricing
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

  // Tính preview giá cho các size đã chọn
  const sizePricingPreview = calculateSizePricing(newProduct.price, newProduct.sizes);

  if(loading) {
    return <p>Đang tải dữ liệu...</p>
  }
  if(error) {
    return <p>Lỗi khi tải dữ liệu: {error}</p>
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Success Message */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Đã xóa sản phẩm thành công!</span>
          </div>
        </div>
      )}
      
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
                Trạng thái
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-400 text-white px-4 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                      className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(product)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr colSpan={5} className="text-center py-10">
                <td colSpan={5} className="text-center py-10">
                  <p className="text-gray-500">Không có sản phẩm nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa sản phẩm
              </h3>
              
              {productToDelete && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Bạn có chắc chắn muốn xóa sản phẩm:
                  </p>
                  <p className="font-semibold text-gray-900">
                    {productToDelete.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    SKU: {productToDelete.sku}
                  </p>
                  <p className="text-sm text-gray-500">
                    Giá: {new Intl.NumberFormat("vi-VN").format(productToDelete.price)} VNĐ
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-6">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến sản phẩm sẽ bị xóa vĩnh viễn.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Trạng thái sản phẩm
                </label>
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {PRODUCT_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {newProduct.status === 'active' ? 
                    '✅ Sản phẩm sẽ được bán' : 
                    '❌ Sản phẩm sẽ tạm ngừng bán'
                  }
                </p>
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
                
                {/* Preview giá theo size */}
                {sizePricingPreview.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview giá theo size:</p>
                    <div className="space-y-1">
                      {sizePricingPreview.map((sizePrice, index) => (
                        <div key={index} className="flex justify-between text-xs text-gray-600">
                          <span>{sizePrice.size}:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN").format(sizePrice.price)} VNĐ
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      * Mỗi size tăng {SIZE_PRICE_INCREMENT.toLocaleString()} VNĐ
                    </p>
                  </div>
                )}
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
