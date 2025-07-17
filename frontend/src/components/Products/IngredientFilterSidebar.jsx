import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchIngredientCategories, setFilters } from '../../redux/slices/ingredientsSlice';

const IngredientFilterSidebar = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, filters } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredientCategories());
  }, [dispatch]);

  // Sync filters with URL params
  useEffect(() => {
    const urlFilters = {
      category: searchParams.get('category') || 'all',
      stock: searchParams.get('stock') || 'all',
      search: searchParams.get('search') || ''
    };
    dispatch(setFilters(urlFilters));
  }, [searchParams, dispatch]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all' || value === '') {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value);
    }
    
    // Reset to page 1 when filter changes
    newParams.delete('page');
    
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const stockOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'available', label: 'Còn hàng' },
    { value: 'out', label: 'Hết hàng' }
  ];

  const hasActiveFilters = filters.category !== 'all' || filters.stock !== 'all' || filters.search !== '';

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header with clear button */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-3 border-b border-gray-100">
        <h3 className="text-xl font-medium text-pink-500">Lọc nguyên liệu</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Xóa lọc
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-3">
            Tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tìm nguyên liệu..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-3">
            Danh mục
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-3 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">Tất cả danh mục</span>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mr-3 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-3">
            Tình trạng kho
          </label>
          <div className="space-y-2 border border-gray-200 rounded-lg p-3">
            {stockOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="stock"
                  value={option.value}
                  checked={filters.stock === option.value}
                  onChange={(e) => handleFilterChange('stock', e.target.value)}
                  className="mr-3 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientFilterSidebar; 