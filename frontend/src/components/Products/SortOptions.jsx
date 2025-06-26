import React from 'react'
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  
  const handleSortChange = (e) => {
      const sortBy = e.target.value;
      searchParams.set('sortBy', sortBy);
      setSearchParams(searchParams);
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      {/* Results Count */}
      <div className="text-gray-600">
        <span className="font-medium">{products?.length || 0}</span> sản phẩm
      </div>

      {/* Sort Selection */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-gray-700 font-medium">
          Sắp xếp:
        </label>
        <select 
          name="" 
          id="sort"
          onChange={handleSortChange}
          value={searchParams.get('sortBy') || ''}
          className='border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors min-w-[180px]'
        >
          <option value="">Mặc định</option>
          <option value="priceAsc">Giá: thấp đến cao</option>
          <option value="priceDesc">Giá: cao đến thấp</option>
          <option value="popularity">Phổ biến nhất</option>
        </select>
      </div>
    </div>
  )
}

export default SortOptions