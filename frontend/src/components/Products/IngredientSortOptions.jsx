import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../../redux/slices/ingredientsSlice';

const IngredientSortOptions = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, pagination, ingredients } = useSelector((state) => state.ingredients);

  const sortOptions = [
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' }
  ];

  const handleSortChange = (sortValue) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (sortValue === 'name-asc') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sortValue);
    }
    
    // Reset to page 1 when sort changes
    newParams.delete('page');
    
    setSearchParams(newParams);
    dispatch(setFilters({ sort: sortValue }));
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
      {/* Results Count */}
      <div className="text-gray-600">
        Hiển thị{' '}
        <span className="font-medium">
          {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
        </span>
        -
        <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>
        {' '}trong số{' '}
        <span className="font-medium">{pagination.total}</span>
        {' '}nguyên liệu
      </div>

      {/* Sort Selection */}
      <div className="flex items-center gap-3">
        <label className="text-gray-700 font-medium">
          Sắp xếp:
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors min-w-[200px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IngredientSortOptions; 