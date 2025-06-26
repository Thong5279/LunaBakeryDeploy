import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchIngredients } from '../redux/slices/ingredientsSlice';
import IngredientFilterSidebar from '../components/Products/IngredientFilterSidebar';
import IngredientSortOptions from '../components/Products/IngredientSortOptions';
import IngredientGrid from '../components/Products/IngredientGrid';

const IngredientsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { ingredients, loading, error } = useSelector((state) => state.ingredients);
  
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch ingredients when filters change
  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);
    dispatch(fetchIngredients(queryParams));
  }, [dispatch, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button 
        onClick={toggleSidebar} 
        className='lg:hidden border p-2 flex justify-center items-center'
      >
        <FaFilter className='mr-2'/> 
        Lọc nguyên liệu
      </button>

      {/* Filter sidebar */}
      <div 
        ref={sidebarRef} 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 z-50 left-0 w-64 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:w-1/4 lg:shadow-none`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-pink-500">Bộ lọc</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <IngredientFilterSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-4">
        <h2 className="text-3xl font-bold uppercase mb-6 text-pink-500 tracking-wide">
          Nguyên liệu làm bánh
        </h2>

        {/* Sort options */}
        <IngredientSortOptions />

        {/* Ingredients grid */}
        <IngredientGrid 
          ingredients={ingredients} 
          loading={loading} 
          error={error} 
        />
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default IngredientsPage; 