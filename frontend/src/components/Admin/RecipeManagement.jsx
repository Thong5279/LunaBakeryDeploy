import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaClock,
  FaUsers,
  FaChartLine,
  FaFilter,
  FaTimes,
  FaUtensils
} from "react-icons/fa";
import {
  fetchAdminRecipes,
  deleteRecipe,
  toggleRecipeStatus,
  toggleRecipePublish,
  clearError,
  clearSuccessMessage,
  setFilters,
} from "../../redux/slices/adminRecipeSlice";
import {
  RECIPE_DIFFICULTIES,
  RECIPE_STATUS,
} from "../../constants/recipeConstants";
import ConfirmModal from "../Common/ConfirmModal";
import RecipeModal from "./RecipeModal";

const RecipeManagement = () => {
  const dispatch = useDispatch();
  const {
    recipes,
    pagination,
    filters,
    loading,
    error,
    actionLoading,
    successMessage,
  } = useSelector((state) => state.adminRecipes);

  // Local state
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "",
  });

  // Load recipes on component mount and when filters change
  useEffect(() => {
    dispatch(fetchAdminRecipes(filters));
  }, [dispatch, filters]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ ...localFilters, page: 1 }));
    setShowFilters(false);
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setLocalFilters({ search: "", status: "" });
    dispatch(setFilters({ search: "", status: "", page: 1 }));
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ ...filters, page: newPage }));
  };

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setShowRecipeModal(true);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleDeleteRecipe = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      dispatch(deleteRecipe(recipeToDelete._id));
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    }
  };

  const handleToggleStatus = (recipe) => {
    dispatch(toggleRecipeStatus(recipe._id));
  };

  const handleTogglePublish = (recipe) => {
    dispatch(toggleRecipePublish(recipe._id));
  };

  const getDifficultyColor = (difficulty) => {
    const difficultyObj = RECIPE_DIFFICULTIES.find(d => d.value === difficulty);
    return difficultyObj?.color || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours} giờ`;
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Đang tải danh sách công thức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaUtensils className="text-pink-500" />
              Quản lý Công thức
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý các công thức làm bánh cho nhân viên
            </p>
          </div>
          <button
            onClick={handleAddRecipe}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Thêm công thức mới
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors"
          >
            <FaFilter />
            <span>Bộ lọc & Tìm kiếm</span>
            {showFilters ? <FaTimes /> : <FaChartLine />}
          </button>
        </div>

        {showFilters && (
          <div className="p-4">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tên công thức..."
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={localFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  {RECIPE_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <FaUtensils className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            Chưa có công thức nào
          </h3>
          <p className="text-gray-400 mb-6">
            Hãy thêm công thức đầu tiên để bắt đầu
          </p>
          <button
            onClick={handleAddRecipe}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <FaPlus />
            Thêm công thức mới
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                {/* Recipe Image */}
                <div className="relative h-48 bg-gray-200">
                  {recipe.image?.url ? (
                    <img
                      src={recipe.image.url}
                      alt={recipe.image.altText || recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaUtensils size={48} />
                    </div>
                  )}
                  
                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipe.status)}`}>
                      {recipe.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                    </span>
                    {recipe.isPublished && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        Công khai
                      </span>
                    )}
                  </div>

                  {/* Difficulty badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Category removed as requested */}

                  {/* Time and servings */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{formatTime(recipe.cookingTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>{recipe.servings} phần</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRecipe(recipe)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                        disabled={actionLoading}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(recipe)}
                        className={`p-2 rounded-lg transition-colors ${
                          recipe.status === 'active'
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={recipe.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
                        disabled={actionLoading}
                      >
                        {recipe.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => handleTogglePublish(recipe)}
                        className={`p-2 rounded-lg transition-colors ${
                          recipe.isPublished
                            ? 'text-blue-600 hover:bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={recipe.isPublished ? 'Ẩn công thức' : 'Công khai công thức'}
                        disabled={actionLoading}
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Recipe Modal */}
      {showRecipeModal && (
        <RecipeModal
          isOpen={showRecipeModal}
          onClose={() => {
            setShowRecipeModal(false);
            setEditingRecipe(null);
          }}
          recipe={editingRecipe}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRecipeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa công thức"
        message={
          recipeToDelete
            ? `Bạn có chắc chắn muốn xóa công thức "${recipeToDelete.name}"? Hành động này không thể hoàn tác.`
            : ""
        }
        type="danger"
        confirmText="Xóa công thức"
        cancelText="Hủy bỏ"
      />
    </div>
  );
};

export default RecipeManagement; 