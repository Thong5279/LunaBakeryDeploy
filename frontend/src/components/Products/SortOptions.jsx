import React from 'react'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleSortChange = (e) => {
      const sortBy =e.target.value;
      searchParams.set('sortBy', sortBy);
      setSearchParams(searchParams);
  }
  return (
    <div className='mb-4 flex items-center justify-end'>
      <select 
      name="" id="sort"
      onChange={handleSortChange}
      value={searchParams.get('sortBy') || ''}
      className='border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500'
      >
        <option value="">Mặc định</option>
        <option value="priceAsc">Giá: thấp đến cao</option>
        <option value="priceDesc">Giá: Cao đến thấp</option>
        <option value="popularity">Phổ biến nhất</option>
        
      </select>
    </div>
  )
}

export default SortOptions