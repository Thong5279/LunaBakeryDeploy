import React, { useState, useEffect,useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {useSearchParams } from 'react-router-dom';
import { fetchProductsByFilters } from '../redux/slices/productsSlice'; 

const CollectionPage = () => {
  const {collection} = useParams();
  const [ searchParams ] = useSearchParams();
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({collection, ...queryParams}));
  },[dispatch,collection,searchParams])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleClickOutside = (e) => {
    // close sidebar if click outside of it
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // add event listenner for click
    document.addEventListener('mousedown', handleClickOutside);
    //clean up the event listener
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title - Full Width */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold uppercase text-pink-500 tracking-wide">
            Toàn bộ sản phẩm
          </h1>
        </div>
      </div>

      {/* Main Content Container - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile filter button */}
        <button 
          onClick={toggleSidebar} 
          className='lg:hidden bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow mb-6 w-full'
        >
          <FaFilter className='mr-2 text-pink-500'/> 
          <span className="font-medium">Lọc sản phẩm</span>
        </button>

        {/* Desktop Layout: 1/4 Filter + 3/4 Content */}
        <div className="flex flex-col lg:flex-row gap-6">
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
              <FilterSidebar/>
            </div>
          </div>

          {/* Main Content - 3/4 width */}
          <div className="flex-1 lg:w-3/4">
            {/* Sort Options */}
            <div className="mb-6">
              <SortOptions/>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} error={error}/>
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

export default CollectionPage;
