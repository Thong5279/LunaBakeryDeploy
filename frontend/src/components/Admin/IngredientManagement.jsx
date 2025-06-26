import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAdminIngredients, 
  deleteIngredient, 
  createIngredient,
  setFilters,
  clearError 
} from "../../redux/slices/adminIngredientSlice";
import { 
  INGREDIENT_CATEGORIES, 
  INGREDIENT_UNITS,
  INGREDIENT_SORT_OPTIONS,
  STOCK_FILTER_OPTIONS,
  INGREDIENT_STATUS
} from "../../constants/ingredientConstants";

const IngredientManagement = () => {
  const dispatch = useDispatch();
  const { 
    ingredients, 
    pagination,
    filters,
    loading, 
    error,
    actionLoading 
  } = useSelector((state) => state.adminIngredients);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const [searchInput, setSearchInput] = useState(filters.search);
  
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    description: "",
    category: INGREDIENT_CATEGORIES[0],
    price: "",
    discountPrice: "",
    quantity: "",
    unit: INGREDIENT_UNITS[0],
    sku: "",
    images: [],
    supplier: "",
    notes: ""
  });

  useEffect(() => {
    dispatch(fetchAdminIngredients(filters));
  }, [dispatch, filters]);

  const handleDelete = (ingredient) => {
    setIngredientToDelete(ingredient);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ingredientToDelete) {
      dispatch(deleteIngredient(ingredientToDelete._id))
        .then((result) => {
          if (result.type.endsWith("/fulfilled")) {
            setDeleteSuccess(true);
            setTimeout(() => {
              setDeleteSuccess(false);
            }, 3000);
          }
        });
      setShowDeleteModal(false);
      setIngredientToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIngredientToDelete(null);
  };

  const handleAddIngredient = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setCreateError("");
    setNewIngredient({
      name: "",
      description: "",
      category: INGREDIENT_CATEGORIES[0],
      price: "",
      discountPrice: "",
      quantity: "",
      unit: INGREDIENT_UNITS[0],
      sku: "",
      images: [],
      supplier: "",
      notes: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewIngredient = (e) => {
    e.preventDefault();
    
    const ingredientData = {
      ...newIngredient,
      price: Number(newIngredient.price),
      discountPrice: Number(newIngredient.discountPrice) || 0,
      quantity: Number(newIngredient.quantity)
    };

    dispatch(createIngredient(ingredientData))
      .then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          handleCloseModal();
          dispatch(fetchAdminIngredients(filters));
        } else if (result.type.endsWith("/rejected")) {
          setCreateError(result.payload || "Có lỗi xảy ra khi thêm nguyên liệu");
        }
      })
      .catch((error) => {
        console.error("Error creating ingredient:", error);
        setCreateError("Có lỗi xảy ra khi thêm nguyên liệu");
      });
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchInput }));
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hết hàng</span>;
    } else if (quantity <= 10) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Sắp hết</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Còn hàng</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Lỗi khi tải dữ liệu: {error}</p>
        <button 
          onClick={() => dispatch(fetchAdminIngredients(filters))}
          className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Success Message */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Đã xóa nguyên liệu thành công!</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý nguyên liệu</h2>
        <button
          onClick={handleAddIngredient}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          + Thêm nguyên liệu
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Tất cả danh mục</option>
              {INGREDIENT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={filters.stock}
              onChange={(e) => handleFilterChange('stock', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {STOCK_FILTER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Tất cả trạng thái</option>
              {INGREDIENT_STATUS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {INGREDIENT_SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Tên nguyên liệu</th>
              <th scope="col" className="px-6 py-3">Danh mục</th>
              <th scope="col" className="px-6 py-3">Giá</th>
              <th scope="col" className="px-6 py-3">Số lượng</th>
              <th scope="col" className="px-6 py-3">Trạng thái</th>
              <th scope="col" className="px-6 py-3">Mã SKU</th>
              <th scope="col" className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <tr key={ingredient._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {ingredient.name}
                  </td>
                  <td className="px-6 py-4">{ingredient.category}</td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium">{formatPrice(ingredient.price)}</span>
                      {ingredient.discountPrice > 0 && (
                        <div className="text-sm text-green-600">
                          Giảm: {formatPrice(ingredient.discountPrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span>{ingredient.quantity} {ingredient.unit}</span>
                      {getStockStatus(ingredient.quantity)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ingredient.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ingredient.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{ingredient.sku}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/ingredients/${ingredient._id}/edit`}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 text-sm"
                    >
                      Sửa
                    </Link>
                    <button
                      className="bg-red-400 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                      onClick={() => handleDelete(ingredient)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  <p className="text-gray-500">Không có nguyên liệu nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => handleFilterChange('page', pagination.page - 1)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Trước
            </button>
            
            {[...Array(pagination.pages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handleFilterChange('page', index + 1)}
                className={`px-3 py-2 rounded-md ${
                  pagination.page === index + 1
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => handleFilterChange('page', pagination.page + 1)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa nguyên liệu
              </h3>
              
              {ingredientToDelete && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Bạn có chắc chắn muốn xóa nguyên liệu:
                  </p>
                  <p className="font-semibold text-gray-900">
                    {ingredientToDelete.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    SKU: {ingredientToDelete.sku}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {ingredientToDelete.quantity} {ingredientToDelete.unit}
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-6">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến nguyên liệu sẽ bị xóa vĩnh viễn.
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
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {actionLoading ? "Đang xóa..." : "Xóa nguyên liệu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Thêm nguyên liệu mới
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewIngredient}>
              {createError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {createError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nguyên liệu *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newIngredient.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={newIngredient.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={newIngredient.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {INGREDIENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị *
                  </label>
                  <select
                    name="unit"
                    value={newIngredient.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {INGREDIENT_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newIngredient.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá giảm (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={newIngredient.discountPrice}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newIngredient.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={newIngredient.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà cung cấp
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={newIngredient.supplier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={newIngredient.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {actionLoading ? "Đang thêm..." : "Thêm nguyên liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement; 