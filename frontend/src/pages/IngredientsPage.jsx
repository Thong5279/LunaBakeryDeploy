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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🧑‍🍳 Nguyên Liệu Làm Bánh</h1>
            <p className="text-xl text-green-100">
              Khám phá bộ sưu tập nguyên liệu chất lượng cao cho công việc làm bánh của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter button */}
          <button 
            onClick={toggleSidebar} 
            className='lg:hidden bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow mb-4'
          >
            <FaFilter className='mr-2 text-green-600'/> 
            <span className="font-medium">Lọc nguyên liệu</span>
          </button>

          {/* Filter sidebar */}
          <div 
            ref={sidebarRef} 
            className={`${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 z-50 left-0 w-80 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:w-80 lg:shadow-none`}
          >
            <div className="h-full overflow-y-auto p-4 lg:p-0">
              {/* Mobile close button */}
              <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
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
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Trang chủ
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-green-600 md:ml-2">Nguyên liệu</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Sort options */}
            <IngredientSortOptions />

            {/* Products grid */}
            <IngredientGrid 
              ingredients={ingredients} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
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