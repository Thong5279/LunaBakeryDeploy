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
        <FilterSidebar/>
     </div>
     <div className="flex-grow p-4">
     <h2 className="text-3xl font-bold uppercase mb-6 text-pink-500 tracking-wide">Toàn bộ sản phẩm</h2>

        {/* sort Options */}
        <SortOptions/>

        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error}/>
     </div>
    </div>
  );
};

export default CollectionPage;
