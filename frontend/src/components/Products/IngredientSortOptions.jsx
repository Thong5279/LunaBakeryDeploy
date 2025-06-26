import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../../redux/slices/ingredientsSlice';

const IngredientSortOptions = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, pagination } = useSelector((state) => state.ingredients);

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
    <div className="flex justify-between items-center mb-4">
      <div className="text-gray-600">
        Hiển thị {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-
        {Math.min(pagination.page * pagination.limit, pagination.total)} 
        trong số {pagination.total} nguyên liệu
      </div>
      <div className="flex items-center">
        <label className="text-gray-700 mr-2">Sắp xếp:</label>
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
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