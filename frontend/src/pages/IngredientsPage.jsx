import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchIngredients } from '../redux/slices/ingredientsSlice';
import IngredientFilterSidebar from '../components/Products/IngredientFilterSidebar';
import IngredientSortOptions from '../components/Products/IngredientSortOptions';
import IngredientGrid from '../components/Products/IngredientGrid';
import Pagination from '../components/Common/Pagination';

const IngredientsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { ingredients, loading, error, pagination } = useSelector((state) => state.ingredients);
  
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

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title - Full Width */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold uppercase text-pink-500 tracking-wide">
            Nguyên liệu làm bánh
          </h1>
        </div>
      </div>

      {/* Main Content Container - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter button */}
        <button 
          onClick={toggleSidebar} 
          className='lg:hidden bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow mb-8 w-full'
        >
          <FaFilter className='mr-3 text-pink-500'/> 
          <span className="font-medium">Lọc nguyên liệu</span>
        </button>

        {/* Desktop Layout: 1/4 Filter + 3/4 Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - 1/4 width */}
          <div 
            ref={sidebarRef} 
            className={`${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 z-50 left-0 w-80 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:w-1/4 lg:shadow-none lg:bg-transparent`}
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
            
            {/* Filter Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:max-h-[calc(100vh-200px)]">
              <IngredientFilterSidebar />
            </div>
          </div>

          {/* Main Content - 3/4 width */}
          <div className="flex-1 lg:w-3/4">
            {/* Sort Options */}
            <div className="mb-8">
              <IngredientSortOptions />
            </div>

            {/* Ingredients Grid */}
            <IngredientGrid 
              ingredients={ingredients} 
              loading={loading} 
              error={error} 
            />

            {/* Pagination */}
            {!loading && !error && ingredients?.length > 0 && (
              <div className="mt-8 mb-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.page < pagination.pages}
                  hasPrevPage={pagination.page > 1}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default IngredientsPage; 