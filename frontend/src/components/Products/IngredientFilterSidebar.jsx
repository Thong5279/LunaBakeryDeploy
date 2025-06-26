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
    <div className="p-4">
      <h3 className="text-xl font-medium text-pink-500 mb-4">Lọc nguyên liệu</h3>
      
      {/* Search */}
      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">
          Tìm kiếm
        </label>
        <input
          type="text"
          placeholder="Tìm nguyên liệu..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">
          Danh mục
        </label>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            name="category"
            value="all"
            checked={filters.category === 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">Tất cả danh mục</span>
        </div>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Stock Status */}
      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">
          Tình trạng kho
        </label>
        {stockOptions.map((option) => (
          <div key={option.value} className="flex items-center mb-1">
            <input
              type="radio"
              name="stock"
              value={option.value}
              checked={filters.stock === option.value}
              onChange={(e) => handleFilterChange('stock', e.target.value)}
              className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">{option.label}</span>
          </div>
        ))}
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="mt-6">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors font-medium"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default IngredientFilterSidebar; 