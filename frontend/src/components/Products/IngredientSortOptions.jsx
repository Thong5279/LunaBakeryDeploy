import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../../redux/slices/ingredientsSlice';

const IngredientSortOptions = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, pagination } = useSelector((state) => state.ingredients);

  const sortOptions = [
    { value: 'name-asc', label: 'Tên A-Z', icon: '🔤' },
    { value: 'name-desc', label: 'Tên Z-A', icon: '🔤' },
    { value: 'price-asc', label: 'Giá thấp đến cao', icon: '💰' },
    { value: 'price-desc', label: 'Giá cao đến thấp', icon: '💰' },
    { value: 'newest', label: 'Mới nhất', icon: '🆕' },
    { value: 'oldest', label: 'Cũ nhất', icon: '⏰' }
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Results Count */}
      <div className="flex items-center text-sm text-gray-600">
        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Hiển thị{' '}
        <span className="font-semibold mx-1">
          {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
        </span>
        -
        <span className="font-semibold mx-1">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>
        trong số{' '}
        <span className="font-semibold ml-1">{pagination.total}</span>
        {' '}nguyên liệu
      </div>

      {/* Sort Options */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 5v4" />
          </svg>
          Sắp xếp:
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm transition-colors min-w-[200px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IngredientSortOptions; 