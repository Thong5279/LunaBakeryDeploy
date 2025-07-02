import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBakerRecipes, 
  fetchBakerRecipeCategories,
  setFilters,
  clearFilters,
  searchBakerRecipes,
  clearSearchResults
} from '../../redux/slices/bakerRecipeSlice';
import { toast } from 'sonner';
import { 
  FaBook, 
  FaSearch, 
  FaClock, 
  FaUtensils, 
  FaFilter,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import BakerRecipeModal from './BakerRecipeModal';
import { RECIPE_CATEGORIES, RECIPE_DIFFICULTIES } from '../../constants/recipeConstants';

const BakerRecipeManagement = () => {
  const dispatch = useDispatch();
  const { 
    recipes, 
    categories, 
    searchResults, 
    loading, 
    searchLoading, 
    error, 
    pagination, 
    filters 
  } = useSelector(state => state.bakerRecipes);

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    dispatch(fetchBakerRecipes(filters));
    dispatch(fetchBakerRecipeCategories());
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        dispatch(searchBakerRecipes(searchQuery));
        setShowSearchResults(true);
      } else {
        dispatch(clearSearchResults());
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }));
  };

  const handleViewRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setShowModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    dispatch(clearSearchResults());
  };

  const handleSearchResultClick = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setShowModal(true);
    setShowSearchResults(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ':
        return 'text-green-600 bg-green-100';
      case 'Trung bình':
        return 'text-yellow-600 bg-yellow-100';
      case 'Khó':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} giờ`;
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <FaBook className="text-2xl text-pink-600" />
          <h1 className="text-2xl font-bold text-gray-900">Sổ tay công thức</h1>
        </div>
        <p className="text-gray-600">
          Xem và tìm hiểu các công thức làm bánh để thực hiện đơn hàng
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm công thức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-96 overflow-y-auto">
                {searchResults.map((recipe) => (
                  <div
                    key={recipe._id}
                    onClick={() => handleSearchResultClick(recipe._id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {recipe.image?.url && (
                        <img
                          src={recipe.image.url}
                          alt={recipe.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{recipe.category}</span>
                          <span>•</span>
                          <span>{recipe.difficulty}</span>
                          <span>•</span>
                          <span>{formatTime((recipe.preparationTime || 0) + (recipe.cookingTime || 0))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-pink-500 text-white border-pink-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaFilter />
            <span>Bộ lọc</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">Tất cả danh mục</option>
                  {RECIPE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ khó
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">Tất cả mức độ</option>
                  {RECIPE_DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sắp xếp
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="difficulty">Độ khó</option>
                  <option value="totalTime">Thời gian</option>
                  <option value="popular">Phổ biến</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Tổng công thức</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.totalRecipes}</p>
            </div>
            <FaBook className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Bánh ngọt</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.category === 'Bánh ngọt').length}
              </p>
            </div>
            <FaUtensils className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Bánh kem</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.category === 'Bánh kem').length}
              </p>
            </div>
            <FaUtensils className="text-pink-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Dễ làm</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.difficulty === 'Dễ').length}
              </p>
            </div>
            <FaClock className="text-pink-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách công thức ({pagination.totalRecipes})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy công thức
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Recipe Image */}
                  {recipe.image?.url && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={recipe.image.url}
                        alt={recipe.image.altText || recipe.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Recipe Header */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {recipe.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    {/* Recipe Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                        {recipe.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>Chuẩn bị: {formatTime(recipe.preparationTime || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>Nướng: {formatTime(recipe.cookingTime || 0)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEye className="mr-1" />
                        <span>{recipe.views || 0} lượt xem</span>
                      </div>
                      
                      <button
                        onClick={() => handleViewRecipe(recipe._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        <FaEye />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Trang {pagination.currentPage} / {pagination.totalPages}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <FaChevronLeft />
                      <span>Trước</span>
                    </button>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <span>Tiếp</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {showModal && (
        <BakerRecipeModal
          recipeId={selectedRecipeId}
          onClose={() => {
            setShowModal(false);
            setSelectedRecipeId(null);
          }}
        />
      )}
    </div>
  );
};

export default BakerRecipeManagement; 