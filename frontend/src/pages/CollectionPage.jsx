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
    <div className="flex flex-col lg:flex-row">
        {/* Mobile filter button */}
        <button onClick={toggleSidebar} className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2'/> Lọc sản phẩm 
        </button>

        {/* filter sidebar */}
     <div ref={sidebarRef} 
     className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64
      bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:w-1/4 lg:shadow-none`}
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
        
        <FilterSidebar/>
     </div>
     <div className="flex-grow p-4">
     <h2 className="text-3xl font-bold uppercase mb-6 text-pink-500 tracking-wide">Toàn bộ sản phẩm</h2>

        {/* sort Options */}
        <SortOptions/>

        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error}/>
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

export default CollectionPage;
